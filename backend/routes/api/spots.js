const express = require('express');
const { Spot, Review, Image, User } = require('../../db/models');
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    // ({
    //     attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'],
    // }, { raw: true })

    const spotList = [];

    for (let i = 0; i < spots.length; i++) {
        const totalNumReviews = await Review.count({where:{spotId: spots[i].id}})
        const totalSum = await Review.sum('stars')
        const images = await Image.findAll({where: {imageableType: 'Spot'}, attributes: ['url']})
        const spot = spots[i].toJSON()
        spotList.push(spot)
        spot.numReviews = spot.Reviews
        spot.numReviews = totalNumReviews
        spot.avgStarRating = totalSum / totalNumReviews
        spot.previewImage = images[0].url
    }

    res.json(spotList)

});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {include: [{model: User, attributes: ['id', 'firstName', 'lastName']}]})
    // Owner = spot.User not working still showing User
    const images = await Image.findAll({where: {imageableType: 'Spot'}, attributes: ['id', 'url', 'preview']})
    SpotImages = images



    res.json({
        spot,
        SpotImages
    })


});

module.exports = router
