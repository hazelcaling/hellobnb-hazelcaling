const express = require('express');
const { Image, Review } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');


// Delete a Review Image
router.delete('/:reviewimageId', requireAuth, async(req, res) => {
    const reviewId = parseInt(req.params.reviewimageId)
    const img = await Image.findByPk(reviewId, {include: [{model: Review}]})
    if (!img) return res.status(404).json({ message: "Review Image couldn't be found"})
    if (req.user.id !== img.Review.userId) return res.status(403).json({message: 'Forbidden'});
    await Image.destroy({where: {id: reviewId}});
    res.json({ message: "Successfully deleted"})

    // // const img = await Image.findByPk(req.params.reviewImageId);
    // const review = await Review.findOne({where: {userId: req.user.id}})
    // // if (!img) return res.status(404).json({message: "Review Image couldn't be found"});
    // if (req.user.id !== review.userId) return res.status(403).json({message: "Forbidden"})

    // if (img) {
    //     if (req.user.id === review.userId) {
    //         await Image.destroy({where: {id: req.params.reviewImageId}});
    //         return res.json({ message: "Successfully deleted"})
    //     }
    // }
})

module.exports = router
