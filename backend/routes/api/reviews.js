const express = require('express');
const { Review } = require('../../db/models');
const router = express.Router();

// test
router.get('/', async (req, res) => {
    const reviews = await Review.findAll();
    res.json(reviews)
})


module.exports = router
