const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, User, Spot, Image } = require('../../db/models');
const router = express.Router();

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: Spot,
                    attributes:{ exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Image,
                            attributes: ['url'],
                            as:'previewImage'
                        }
                    ]
                }
            ]
        })

        const bookings = [];
        for (let i = 0; i < userBookings.length; i++) {
            const booking = userBookings[i].toJSON()
            bookings.push(booking)
            booking.Spot.previewImage = booking.Spot.previewImage[0].url
        }

        res.json({Bookings: bookings})
});

// Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const booking = await Booking.findByPk(bookingId)
    if (req.user.id !== booking.userId) return res.status(403).json('Forbidden')
    if (!booking) return res.status(404).json({message: "Booking couldn't be found"});
    if (new Date(booking.endDate) < new Date()) return res.status(403).json({message: "Past bookings can't be modified"});
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
