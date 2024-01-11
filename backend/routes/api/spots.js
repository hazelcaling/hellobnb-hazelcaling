const express = require('express');
const { Spot, Review, Image, User, Booking, Sequelize, sequelize } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const validateSpot = [
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
      .withMessage('Latitude is not valid')
      .isFloat({ min: -90, max: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Longtitude is not valid')
      .isFloat({ min: -180, max: 180})
      .withMessage('Longtitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isLength({min: 1, max: 50})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price per day is required')
      .isFloat({ min: 0})
      .withMessage('Price per day must be a positive number'),
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
      .isFloat({ min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


// Get all Spots
router.get('/', async (req, res) => {

        const spots = await Spot.findAll({
        attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
                // [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
            ],
            include: [
                { model: Review, attributes: []},
                {model: Image, as: 'previewImage', attributes: ['url'], limit: 1}
            ],
            group: ['Spot.id']
        })

        const spotList = [];
        for (let i = 0; i < spots.length; i++) {
            const spot = spots[i].toJSON()
            spotList.push(spot)
            spot.avgRating = parseFloat(spot.avgRating)
            if (!spot.avgRating) spot.avgRating = parseInt(0)
            if (spot.previewImage.length === 0) {
                spot.previewImage = 'No image';
            } else {
                spot.previewImage = spot.previewImage[0].url
            }
        }

        res.json(spotList)

    // try {
    //     // default page = 1, size 20
    //     let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice = 0, maxPrice = 0} = req.query;

    //     // ensure page, size are within the range
    //     // page min 1, max 10    size min 1 max 20
    //     page = Math.min(Math.max(parseInt(page), 1, 10))
    //     size = Math.min(Math.max(parseInt(size), 1, 20))

    //     // ensure minPrice and maxPrice are atleast 0
    //     minPrice = Math.max(parseInt(minPrice), 0);
    //     maxPrice = Math.max(parseInt(maxPrice), 0)

    //     minLat = parseInt(minLat)
    //     maxLat = parseInt(maxLat)
    //     minLng = parseInt(minLng)
    //     maxLng = parseInt(maxLng)

    //     // build where clause based on params
    //     let where = {};

    //     if (minLat && maxLat) {
    //         where.lat = {[Op.between]: [minLat, maxLat]}
    //     }

    //     if (minLng && maxLng) {
    //         where.lng = {[Sequelize.Op.between]: [minLng, maxLng]}
    //     }

    //     if (minPrice && maxPrice) {
    //         where.price = {[Sequelize.Op.between]: [minPrice, maxPrice]}
    //     }

    //     const spots = await Spot.findAll({
    //         where: where,
    //         attributes: [
    //             'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
    //             // [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
    //             [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
    //         ],
    //         include: [
    //             { model: Review, attributes: []},
    //             {model: Image, as: 'previewImage', attributes: ['url'], limit: 1}
    //         ],
    //         group: ['Spot.id']

    //     })

    //     const spotList = [];
    //     for (let i = 0; i < spots.length; i++) {
    //         const spot = spots[i].toJSON()
    //         spotList.push(spot)
    //         if (spot.previewImage.length === 0) {
    //             spot.previewImage = 'No image';
    //         } else {
    //             spot.previewImage = spot.previewImage[0].url
    //         }
    //     }

    //     // // Paginate results
    //     // const startIndex = (page - 1) * size;
    //     // const paginatedSpots = spotList.slice(startIndex, startIndex + size);

    //     res.json({
    //     'Spots': spotList
    // })

    // } catch(error) {
    //    console.error(error)
    //    return res.json('Hello')
    // }

});

// Get all Spots owned by the Current User
router.get(
    '/current', requireAuth,
    async (req, res) => {
      const { user } = req;

      const spots = await Spot.findAll({
        attributes: {
            include: [
                // [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
            ]
        },
        include: [
            {model: Review, attributes: []},
            {model: Image, as: 'previewImage', attributes: ['url']}
        ],
        group: ['Spot.id', 'previewImage.id'],
        where: {ownerId: user.id}
      })

    const spotList = [];
    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i].toJSON()
        spotList.push(spot)
        if (spot.previewImage.length === 0) {
            spot.previewImage = 'No image';
        } else {
            spot.previewImage = spot.previewImage[0].url
        }
    }
      res.json({Spots: spotList})

    }
  );

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findOne({where: {id: req.params.spotId}});
    if (!spot) return res.status(404).json({message: "Spot couldn't be found"});

    const spotDetails = await Spot.findOne({
        attributes: {
            include: [
                 [Sequelize.fn('COUNT', sequelize.col('spotId')), 'numReviews'],
                //  [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating'],
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
            ]
        },
        include: [
            { model: Review, attributes: []},
            {model: Image, as: 'SpotImages', attributes: ['id', 'url', 'preview']},
            {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']},
        ],
        group: ['Spot.id', 'SpotImages.id', 'Owner.id'],
        where: {id: req.params.spotId}
    })

    res.json(spotDetails)

});

// Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;
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
        res.json(newSpot)
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
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

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const {user} = req
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) return res.status(404).json({ "message": "Spot couldn't be found" })
    if (user.id !== spot.ownerId) return res.status(403).json({message: 'Forbidden'})

    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
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

        const updatedSpot = await Spot.findByPk(req.params.spotId)

        res.json(updatedSpot)

    } catch(err) {
        console.error('Error updating spot')
    }
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) res.status(404).json({ "message": "Spot couldn't be found" });
    const { user } = req;
    if (user) {
        const id = req.params.spotId
        if (user.id !== spot.ownerId) return res.status(403).json({message: 'Forbidden'})
        await Spot.destroy({where: {id: id}});
        res.json({ "message": "Successfully deleted" })
    }
})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params
    const spot = await Spot.findOne({where: {id: spotId}});
    const review = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Image, as: 'ReviewImages', attributes: ['id', 'url']}],
            where: {spotId: spotId}
        });

    if (!spot) return res.status(404).json({message: "Spot couldn't be found"})
    res.json({Reviews: review})
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview,  async (req, res) => {
    const { spotId } = req.params
    const { user } = req
    const spot = await Spot.findOne({where: {id: spotId}});
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
    const review = await Review.findOne({where: {spotId: spotId}});

    if (review) return res.status(500).json({ message: "User already has a review for this spot" })
        const newReview = await Review.create({
        userId: user.id,
        spotId: spotId,
        review: req.body.review,
        stars: req.body.stars});
        return res.status(201).json(newReview);
});



// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const {user} = req;
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) return res.status(404).json({message: "Spot couldn't be found"})
    const ownerBookings = await Booking.findAll({
     include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        where: {spotId: req.params.spotId}
    });

    const bookings = await Booking.findAll({attributes: ['spotId', 'startDate', 'endDate'], where: {spotId: req.params.spotId}})

    if (spot.ownerId !== user.id) {
        return res.json({Bookings: bookings})
    }
    if (spot.ownerId === user.id) {
        return res.json({Bookings: ownerBookings})
    }
})

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
    if (spot.ownerId === req.user.id) return res.status(404).json({message: 'Spot must not belong to the current user'});

    // Check if the spot is already booked for the specified date
    const existingBooking = await Booking.findAll({
        where: {
            spotId,
            [Sequelize.Op.or]: [
                {startDate: {[Sequelize.Op.between]: [startDate, endDate]}},
                {endDate: {[Sequelize.Op.between]: [startDate, endDate]}}
            ]
        }
    });

    if (existingBooking) return res.status(403).json({message: "Sorry, this spot is already booked for the specified dates"})
    if (startDate === endDate) return res.status(403).json({message: "Start date cannot be the same as the end date"})
    if (new Date(endDate) < new Date(startDate)) return res.status(403).json({message: "End date cannot be before start date"})
    if (new Date(endDate) < new Date() || new Date(startDate) < new Date()) return res.status(403).json({message: "Past bookings can't be modified"});

    const newBooking = await Booking.create({
        userId: req.user.id,
        spotId,
        startDate,
        endDate
    })
    res.json(newBooking)
});





module.exports = router
