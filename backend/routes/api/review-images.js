const express = require('express');
const { Image, Review } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');


// Delete a Review Image
router.delete('/:reviewImageId', requireAuth, async(req, res) => {
    const img = await Image.findByPk(req.params.reviewImageId);
    const review = await Review.findOne({where: {userId: req.user.id}})
    if (!img) return res.status(404).json({message: "Review Image couldn't be found"});
    if (req.user.id !== review.userId) return res.status(403).json({message: "Forbidden"})

    if (img) {
        if (req.user.id === review.userId) {
            await Image.destroy({where: {id: req.params.reviewImageId}});
            return res.json({ message: "Successfully deleted"})
        }
    }
})

module.exports = router
