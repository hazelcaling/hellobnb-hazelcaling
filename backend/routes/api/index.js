// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const bookingRouter = require('./bookings.js');
const spotRouter = require('./spots.js');
const spotImageRouter = require('./spot-images.js');
const reviewImageRouter = require('./review-images.js');
const reviewRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/bookings', bookingRouter);

router.use('/spots', spotRouter);

router.use('/spot-images', spotImageRouter);

router.use('/review-images', reviewImageRouter)

router.use('/reviews', reviewRouter)

// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });


module.exports = router;
