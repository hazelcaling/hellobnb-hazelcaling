const express = require('express');
const {Sequelize} = require('sequelize')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, User, Spot, Image } = require('../../db/models');
const router = express.Router();
const { Op } = require('sequelize');

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
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const booking = await Booking.findByPk(bookingId)
    const currentDate = new Date()

    if (!booking) return res.status(404).json({message: "Booking couldn't be found"});
    if (req.user.id !== booking.userId) return res.status(403).json({message: 'Forbidden'})
    if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) return res.status(403).json({message: "Past bookings can't be modified"})

    const withinExistingBooking = await Booking.findAll({
        where: {
            id: bookingId,
            [Op.and]: [{startDate: {[Op.lte]: startDate}},{endDate: {[Op.gte]: endDate}}]
        }
    })

    const existingBooking = await Booking.findAll({
        where: {
            id: bookingId,
            // [Op.or]: [{startDate: new Date(startDate)}, {startDate: new Date(endDate)}, {endDate: new Date(startDate)}, {endDate: new Date(endDate)}]
            [Op.or]: [
                {startDate: new Date(startDate)}, {startDate: new Date(endDate)}, {endDate: new Date(startDate)}, {endDate: new Date(endDate)},
                {
                    startDate: {
                        [Op.lte]: new Date(startDate),
                        [Op.gte]: new Date(endDate)
                    },
                    endDate: {
                        [Op.gte]: endDate,
                    }
                },
                {
                    startDate: {
                        [Op.lte]: new Date(startDate),
                    },
                    endDate: {
                        [Op.gte]: new Date(startDate),
                        [Op.lte]: new Date(endDate),
                    }
                },
                {
                    startDate: {
                        [Op.gte]: new Date(startDate),
                    },
                    endDate: {
                        [Op.lte]: new Date(endDate)
                    }
                }]
        }
    });

    if (existingBooking.length > 0 || withinExistingBooking.length > 0) return res.status(403).json({message: "Sorry, this spot is already booked for the specified dates"})
    if (startDate === endDate) return res.status(403).json({message: "Start date cannot be the same as the end date"})
    if (new Date(endDate) < new Date(startDate)) return res.status(403).json({message: "End date cannot be before start date"})

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
