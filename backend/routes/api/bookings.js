const express = require('express');
const {Sequelize} = require('sequelize')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Booking, User, Spot, Image } = require('../../db/models');
const { check} = require('express-validator');
const router = express.Router();
const { Op } = require('sequelize');

const validateEditBooking = [
    check('startDate')
    .custom(async (value, { req }) => {
      const startDate = req.body.startDate
      if (new Date(startDate) < new Date()) throw new Error()
    })
    .withMessage('Start date cannot be in the past'),
    check('endDate')
      .custom(async (value, { req }) => {
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        if (new Date(endDate) < new Date(startDate)) throw new Error()
      })
      .withMessage('endDate cannot come before startDate'),
    // check(['startDate', 'endDate'])
    //   .toDate()
    //   .custom(async (value, { req }) => {
    //     if (value && value < new Date()) throw new Error()
    //   })
    //   .withMessage("Past booking cannot be modified"),
    //   check('endDate')
    //   .custom(async (value, { req }) => {
    //     const startDate = req.body.startDate
    //     const endDate = req.body.endDate
    //     if (new Date(startDate) === new Date(endDate)) throw new Error()
    //   })
    //   .withMessage('Start date cannot be same as End date'),
    handleValidationErrors
  ];

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
        const userBookings = await Booking.findAll({
            include: [
                {
                    model: Spot,
                    attributes:{ exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Image,
                            as:'previewImage',
                            attributes: ['url'],
                            limit: 1
                        }
                    ]
                }
            ],
            group: ['Booking.id', 'Spot.id'],
            where: {
                userId: user.id
            },
        })

        const bookings = [];
        for (let i = 0; i < userBookings.length; i++) {
            const booking = userBookings[i].toJSON()
            bookings.push(booking)
            if (parseInt(booking.Spot.previewImage.length) === parseInt(0)) {
                booking.Spot.previewImage = 'No image'
            } else {
                booking.Spot.previewImage = booking.Spot.previewImage[0].url
            }
        }

        res.json({Bookings: bookings})
});

// Edit a Booking
router.put('/:bookingId', validateEditBooking, requireAuth, async (req, res) => {
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const booking = await Booking.findByPk(bookingId)


    if (!booking) return res.status(404).json({message: "Booking couldn't be found"});
    if (req.user.id !== booking.userId) return res.status(403).json({message: 'Forbidden'})
    if (startDate === endDate) return res.status(403).json({message: "Start date cannot be the same as the end date"})
    if (new Date(booking.startDate) < new Date() || new Date(booking.endDate) < new Date()) return res.status(403).json({message: "Past bookings can't be modified"})

            // conflicting dates
            const conflictingDates = await Booking.findAll({
                where: {
                    spotId: booking.spotId,
                    id: {[Op.ne]: parseInt(bookingId)},
                    [Op.or]: [
                        // Avoid dates within existing booking
                        {startDate: {[Op.gt]: new Date(startDate)}, endDate: {[Op.lt]: new Date(endDate)}},
                        // Avoid dates surround existing booking
                        {startDate: {[Op.lt]: new Date(startDate)}, endDate: {[Op.gt]: new Date(endDate)}},
                        // Avoid same start/end date
                        {startDate: {[Op.eq]: new Date(startDate)}, endDate: {[Op.eq]: new Date(endDate)}},
                    ]
                }
            })

            if (conflictingDates.length > 0) return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    startDate: 'Start date conflicts with an existing booking',
                    endDate: 'End date conflicts with an existing booking'
                }
            })

        // conflicting booking start date
        const conflictingStartDate = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: {[Op.ne]: parseInt(bookingId)},
                [Op.or]: [
                    // Avoid start date on existing start date
                    {startDate: {[Op.eq]: new Date(startDate)}},
                    // Avoid start date on existing end date
                    {endDate: {[Op.eq]: new Date(startDate)}},
                    // Avoid start date during existing booking
                    {startDate: {[Op.lt]: new Date(startDate)}, endDate: {[Op.gt]: new Date(startDate)}}
                ]
            }
        });

        if (conflictingStartDate.length > 0) return res.status(403).json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
                startDate: 'Start date conflicts with an existing booking'
            }
        })

        // conflicting booking end date
        const conflictingEndDate = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: {[Op.ne]: parseInt(bookingId)},
                [Op.or]: [
                    // Avoid end date on existing start date
                    {startDate: {[Op.eq]: new Date(endDate)}},
                    // Avoid end date on existing end date
                    {endDate: {[Op.eq]: new Date(endDate)}},
                    // Avoid end date during existing booking
                    {startDate: {[Op.lt]: new Date(endDate)}, endDate: {[Op.gt]: new Date(endDate)}}
                ]
            }
        })

        if (conflictingEndDate.length > 0) return res.status(403).json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
                endDate: 'End date conflicts with an existing booking'
            }
        })



    await booking.update({
        startDate,
        endDate
    });

    res.json(booking)

})

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const {bookingId} = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({message: "Booking couldn't be found"})
    const spot = await Spot.findOne({where:{id: booking.spotId}})
    if (spot.ownerId !== req.user.id && booking.userId !== req.user.id) return res.status(403).json({message: 'You are not authorized to delete this booking'})
    await booking.destroy();
    res.json({message: "Successfully deleted"})
})

module.exports = router;
