const express = require('express');
const { Review, User, Spot, Image } = require('../../db/models');
const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReviewEdit = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// Get all Reviews of the Current User
router.get('/current', async (req, res) => {
    const reviews = await Review.findAll({include: [{model: User, attributes: ['id', 'firstName', 'lastName']}, {model: Spot}, {model: Image, as: 'ReviewImages'}]},{where: {userId: req.user.id}})
    res.json({
        "Reviews": reviews
    })
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', async (req, res) => {
    const review = await Review.findOne({where: {id: req.params.reviewId}})
    if (!review) return res.status(404).json({message: "Review couldn't be found" });

    if (req.user)
    if (req.user.id !== review.userId) return res.status(403).json({message: 'Forbidden'});

    const newImg = await Image.create({
        imageableId: req.params.reviewId,
        imageableType: 'Review',
        url: req.body.url,
        preview: req.body.preview
    });
    res.json({id: newImg.id, url: newImg.url})
})



// Edit a Review
router.put('/:reviewId', validateReviewEdit , async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) return res.status(404).json({ "message": "Review couldn't be found" })
    if (req.user.id !== review.userId) return res.status(403).json({message: 'Forbidden'});

    try {
        const { review, stars } = req.body;
        await Review.update({
            review: review,
            stars: stars
        }, {
            where: {
                id: req.params.reviewId
            }
        })

        const updatedReview = await Review.findOne({where: {id: req.params.reviewId}})

        res.json(updatedReview)


    } catch(err) {
        next({
            status: "not-found",
            message: 'Could not update new spot',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});

// Delete a Review
router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params
    const review = await Review.findByPk(reviewId);

    if (!review) return res.status(404).json({message: "Review couldn't be found"});
    if (review.userId !== req.user.id) return res.status(403).json({message: 'Forbidden'});

    await Review.destroy({where: {id: reviewId}});
    res.json({message: "Successfully deleted"})
})




module.exports = router
