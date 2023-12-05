const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    console.log(spots)
    res.json(spots)
});

// Get details of a Spot from an id
// router.get('/:spotId', async (req, res) => {
//     const id = req.spotId
//     const spot = await Spot.findOne({
//         where: {
//             id: id
//         },
//         // include: [
//         //     { model: 'User', as: 'Owner'},
//         // ]
//     });
//     res.json(spot)
// });

module.exports = router
