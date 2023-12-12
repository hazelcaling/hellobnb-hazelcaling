const express = require('express');
const { Image, Review } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');


// Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const img = await Image.findByPk(req.params.imageId);
    const review = await Review.findOne({where: {userId: req.user.id}});
    if (!img) return res.status(404).json({message: "Review Image couldn't be found"});
    if (req.user) {
        if (req.user.id !== review.userId) return res.status(403).json({message: 'Forbidden'});
        await Image.destroy({where: {id: req.params.imageId}});
        res.json({ message: "Successfully deleted"})
    }
})


module.exports = router
