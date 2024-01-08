const express = require('express');
const { Image, Spot } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');



// Delete a Spot Image
router.delete('/:imageId', requireAuth,async (req, res) => {
    const img = await Image.findByPk(req.params.imageId, {include: [{ model: Spot}]});
    if (!img) return res.status(404).json({ message: "Spot Image couldn't be found"})

    if (req.user.id !== Spot.ownerId) return res.status(403).json({message: 'Forbidden'});
    await Image.destroy({where: {id: req.params.imageId}});
    res.json({ message: "Successfully deleted"})

});


module.exports = router
