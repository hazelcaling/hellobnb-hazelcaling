const express = require('express');
const { Spot, Review, Image, User } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validate = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Longtitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price per day is required'),

    handleValidationErrors
];

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
        if(!totalNumReviews) {
            spot.avgRating = 0;
        } else {
            spot.avgRating = totalSum / totalNumReviews
        }
        spot.previewImage = images[0].url
    }

    res.json(spotList)

});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId, {include: [{model: User, attributes: ['id', 'firstName', 'lastName']}]});
    if (!spot) {
        res.statusCode = 404
        return res.json({message: "Spot couldn't be found"})
    }
    spot = spot.toJSON()
    spot.numReviews = await Review.count({where:{spotId: req.params.spotId}})
    totalSum = await Review.sum('stars')
    if (!spot.totalNumReviews) {
        spot.avgStarRating = 0;
    } else {
        spot.avgStarRating = totalSum / spot.totalNumReviews
    }
    const images = await Image.findAll({where: {imageableType: 'Spot'}, attributes: ['id', 'url', 'preview']})
    SpotImages = images
    res.json({
        spot,
        SpotImages
    })
});

// Create a Spot
router.post('/', requireAuth, validate, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;

    try {
        const newSpot = await Spot.create({
            ownerId: user.id,
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })
        res.statusCode = 201
        res.json({
            status: "success",
            message: "Successfully created Spot",
            data: newSpot
        });``

    } catch(err) {
        next({
            status: "error",
            message: 'Could not create new tree',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
})

module.exports = router
