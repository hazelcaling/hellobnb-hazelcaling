const express = require("express")
const {
  Spot,
  Review,
  Image,
  User,
  Booking,
  Sequelize,
  sequelize,
} = require("../../db/models")
const router = express.Router()
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth")
const { check, query } = require("express-validator")
const { handleValidationErrors } = require("../../utils/validation")
const { Op } = require("sequelize")

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Latitude is not valid")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Longtitude is not valid")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longtitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 30, max: 500 })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Price per day is required")
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
]

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
]

const validateQueryParams = [
  query("page")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  query("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  query("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  query("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  query("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
]

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Page must be greater than or equal to 1")
    .toInt(),
  query("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be greater than or equal to 1")
    .toInt(),
  handleValidationErrors,
]

const validateBooking = [
  check("startDate")
    .custom(async (value, { req }) => {
      const startDate = req.body.startDate
      if (new Date(startDate) < new Date()) throw new Error()
    })
    .withMessage("Start date cannot be in the past"),
  check("endDate")
    .custom(async (value, { req }) => {
      const startDate = req.body.startDate
      const endDate = req.body.endDate
      if (new Date(endDate) <= new Date(startDate)) throw new Error()
    })
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors,
]

// Get all Spots
router.get("/", validateQueryParams, validatePagination, async (req, res) => {
  const where = {}

  const page = parseInt(req.query.page) || 1
  const size = parseInt(req.query.size) || 20
  const minLat = parseFloat(req.query.minLat)
  const maxLat = parseFloat(req.query.maxLat)
  const minLng = parseFloat(req.query.minLng)
  const maxLng = parseFloat(req.query.maxLng)
  const minPrice = parseFloat(req.query.minPrice)
  const maxPrice = parseFloat(req.query.maxPrice)

  if (minLat || maxLat)
    where.lat = { [Op.between]: [Math.max(minLat, -90), Math.min(maxLat, 90)] }
  if (minLng || maxLng)
    where.lng = {
      [Op.between]: [Math.max(minLng, -180), Math.min(maxLng, 180)],
    }
  if (minPrice || maxPrice)
    where.price = {
      [Op.between]: [Math.max(minPrice, 0), Math.min(maxPrice, 1000000)],
    }
  const spots = await Spot.findAll({
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [
        sequelize.fn(
          "ROUND",
          sequelize.fn("AVG", sequelize.col("Reviews.stars")),
          1
        ),
        "avgRating",
      ],
    ],
    include: [
      { model: Review, attributes: [] },
      { model: Image, as: "previewImage", attributes: ["url"], limit: 1 },
    ],
    where,
    group: ["Spot.id"],
    order: ["id"],
    // limit: size,
    // offset: (page - 1) * size,
    subQuery: false,
  })

  const spotList = []
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i].toJSON()
    spotList.push(spot)
    spot.avgRating = parseInt(spot.avgRating)
    if (spot.previewImage.length === 0) {
      spot.previewImage = "No image"
    } else {
      spot.previewImage = spot.previewImage[0].url
    }
  }

  res.json({
    Spots: spotList,
  })
})

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req

  const spots = await Spot.findAll({
    attributes: {
      include: [
        // [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgRating",
        ],
      ],
    },
    include: [
      { model: Review, attributes: [] },
      { model: Image, as: "previewImage", attributes: ["url"] },
    ],
    group: ["Spot.id", "previewImage.id"],
    where: { ownerId: user.id },
  })

  const spotList = []
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i].toJSON()
    spotList.push(spot)
    if (spot.previewImage.length === 0) {
      spot.previewImage = "No image"
    } else {
      spot.previewImage = spot.previewImage[0].url
    }
  }
  res.json({ Spots: spotList })
})

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findOne({ where: { id: req.params.spotId } })
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })

  const spotDetails = await Spot.findOne({
    attributes: {
      include: [
        [Sequelize.fn("COUNT", sequelize.col("spotId")), "numReviews"],
        //  [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating'],
        [
          sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
          "avgRating",
        ],
      ],
    },
    include: [
      { model: Review, attributes: [] },
      { model: Image, as: "SpotImages", attributes: ["id", "url", "preview"] },
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
    ],
    group: ["Spot.id", "SpotImages.id", "Owner.id"],
    where: { id: req.params.spotId },
  })

  const spotres = spotDetails.toJSON()
  spotres.avgRating = parseInt(spotres.avgRating)
  spotres.numReviews = parseInt(spotres.numReviews)

  res.json(spotres)
})

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body
  const { user } = req
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
    price: price,
  })
  res.statusCode = 201
  res.json(newSpot)
})

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findOne({ where: { id: req.params.spotId } })
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })

  if (req.user) {
    if (req.user.id !== spot.ownerId)
      return res.status(403).json({ message: "Forbidden" })
    const { url, preview } = req.body
    const newImg = await Image.create({
      imageableId: req.params.spotId,
      imageableType: "Spot",
      url: url,
      preview: preview,
    })

    res.json({ id: newImg.id, url: newImg.url, preview: newImg.preview })
  }
})

// Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const { user } = req
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
  if (user.id !== spot.ownerId)
    return res.status(403).json({ message: "Forbidden" })

  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body
    await Spot.update(
      {
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
      },
      {
        where: {
          id: req.params.spotId,
        },
      }
    )

    const updatedSpot = await Spot.findByPk(req.params.spotId)

    res.json(updatedSpot)
  } catch (err) {
    console.error("Error updating spot")
  }
})

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) res.status(404).json({ message: "Spot couldn't be found" })
  const { user } = req
  if (user) {
    const id = req.params.spotId
    if (user.id !== spot.ownerId)
      return res.status(403).json({ message: "Forbidden" })
    await Spot.destroy({ where: { id: id } })
    res.json({ message: "Successfully deleted" })
  }
})

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params
  const spot = await Spot.findOne({ where: { id: spotId } })
  const review = await Review.findAll({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Image, as: "ReviewImages", attributes: ["id", "url"] },
    ],
    where: { spotId: spotId },
  })

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
  res.json({ Reviews: review })
})

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const { spotId } = req.params
    const { user } = req
    const spot = await Spot.findOne({ where: { id: spotId } })
    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" })
    const review = await Review.findOne({
      where: { spotId: spotId, userId: user.id },
    })

    if (review)
      return res
        .status(500)
        .json({ message: "User already has a review for this spot" })
    const newReview = await Review.create({
      userId: user.id,
      spotId: spotId,
      review: req.body.review,
      stars: req.body.stars,
    })
    return res.status(201).json(newReview)
  }
)

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req
  const spot = await Spot.findByPk(parseInt(req.params.spotId))
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })
  const ownerBookings = await Booking.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
    where: { spotId: req.params.spotId },
  })

  const bookings = await Booking.findAll({
    attributes: ["spotId", "startDate", "endDate"],
    where: { spotId: req.params.spotId },
  })

  if (spot.ownerId !== user.id) {
    return res.json({ Bookings: bookings })
  }
  if (spot.ownerId === user.id) {
    return res.json({ Bookings: ownerBookings })
  }
})

// Create a Booking from a Spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  validateBooking,
  requireAuth,
  async (req, res) => {
    const { spotId } = req.params
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId)

    if (!spot)
      return res.status(404).json({ message: "Spot couldn't be found" })
    if (spot.ownerId === req.user.id)
      return res.status(404).json({ message: "Forbidden" })
    if (startDate === endDate)
      return res
        .status(403)
        .json({ message: "Start date cannot be the same as the end date" })

    // conflicting dates
    const conflictingDates = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          // Avoid dates within existing booking
          {
            startDate: { [Op.gt]: new Date(startDate) },
            endDate: { [Op.lt]: new Date(endDate) },
          },
          // Avoid dates surround existing booking
          {
            startDate: { [Op.lt]: new Date(startDate) },
            endDate: { [Op.gt]: new Date(endDate) },
          },
          // Avoid same start/end date
          {
            startDate: { [Op.eq]: new Date(startDate) },
            endDate: { [Op.eq]: new Date(endDate) },
          },
        ],
      },
    })

    if (conflictingDates.length > 0)
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      })

    // conflicting booking start date
    const conflictingStartDate = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          // Avoid start date on existing start date
          { startDate: { [Op.eq]: new Date(startDate) } },
          // Avoid start date on existing end date
          { endDate: { [Op.eq]: new Date(startDate) } },
          // Avoid start date during existing booking
          {
            startDate: { [Op.lt]: new Date(startDate) },
            endDate: { [Op.gt]: new Date(startDate) },
          },
        ],
      },
    })

    if (conflictingStartDate.length > 0)
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      })

    // conflicting booking end date
    const conflictingEndDate = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          // Avoid end date on existing start date
          { startDate: { [Op.eq]: new Date(endDate) } },
          // Avoid end date on existing end date
          { endDate: { [Op.eq]: new Date(endDate) } },
          // Avoid end date during existing booking
          {
            startDate: { [Op.lt]: new Date(endDate) },
            endDate: { [Op.gt]: new Date(endDate) },
          },
        ],
      },
    })

    if (conflictingEndDate.length > 0)
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      })

    const newBooking = await Booking.create({
      userId: req.user.id,
      spotId,
      startDate,
      endDate,
    })

    res.json(newBooking)
  }
)

module.exports = router
