const express = require('express');
const { Spot, Review, Image, User } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

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
const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Stars must be an integer from 1 to 5'),
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

// Delete a Spot
router.delete('/:spotId', async (req, res) => {
    const { user } = req;
    if (user) {
        const id = req.params.spotId
        const spot = await Spot.findOne({where: {id: id}});
        if (user.id !== spot.ownerId) return res.status(403).json({message: 'Forbidden'})

        if (!spot) res.status(404).json({ "message": "Spot couldn't be found" });
        await Spot.destroy({where: {id: id}});
        res.json({ "message": "Successfully deleted" })
    }
})

// Edit a Spot
router.put('/:spotId', validate, async (req, res) => {
    const {user} = req
    const spot = await Spot.findOne({where: {id: req.params.spotId}})
    if (user.id !== spot.ownerId) return res.status(403).json({message: 'Forbidden'})

    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        if (!spot) return res.status(404).json({ "message": "Spot couldn't be found" })
        await Spot.update({
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        }, {
            where: {
                id: req.params.spotId
            }
        })

        const updatedSpot = await Spot.findOne({where: {id: req.params.spotId}})

        res.json({
            status: 'success',
            message: 'Successfully updated spot',
            data: updatedSpot
        })


    } catch(err) {
        next({
            status: "not-found",
            message: 'Could not update new spot',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});


// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', async (req, res) => {
    const spot = await Spot.findOne({where: {id: req.params.spotId}});
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found"})

    if (req.user) {
        if (req.user.id !== spot.ownerId) return res.status(403).json({message: 'Forbidden'});
        const { url, preview } = req.body
        const newImg = await Image.create({
        imageableId: req.params.spotId,
        imageableType: 'Spot',
        url: url,
        preview: preview
    });

    res.json({ id: newImg.id, url: newImg.url, preview: newImg.preview})
    }
});

router.get('/')

router.post('/:spotId/reviews', validateReview, async (req, res) => {
    const { spotId } = req.params
    const { user } = req
    const spot = await Spot.findOne({where: {id: spotId}});
    const review = await Review.findOne({where: {spotId: spotId}});

    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
    if (!user) return res.status(403).json({message: 'Login required'});
    if (user.id !== spot.ownerId) return res.status(403).json({message: 'Spot must belong to current user'});
    if (review) return res.status(500).json({ message: "User already has a review for this spot" })

        const newReview = await Review.create({
        userId: user.id,
        spotId: spotId,
        review: req.body.review,
        stars: req.body.stars});
        return res.status(201).json(newReview);
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params
    const spot = await Spot.findOne({where: {id: spotId}});
    const review = await Review.findAll({include: [{model: User, attributes: ['id', 'firstName', 'lastName']}, {model: Image, as: 'ReviewImages'}]},{where: {spotId: spotId}});

    if (!spot) return res.status(404).json({message: "Spot couldn't be found"})
    res.json({Reviews: review})

});


module.exports = router
