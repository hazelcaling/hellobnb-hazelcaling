const express = require('express');
const { Booking } = require('../../db/models');
const router = express.Router();

// test
router.get('/', async (req, res) => {
    const bookings = await Booking.findAll();
    res.json(bookings)
})


module.exports = router;
