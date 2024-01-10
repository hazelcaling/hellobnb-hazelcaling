const express = require('express');
const { Image, Spot } = require('../../db/models');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');



// Delete a Spot Image
router.delete('/:spotimageId', requireAuth,async (req, res) => {

    const img = await Image.findByPk(req.params.spotimageId, {include: [{ model: Spot}]})
    if (!img) return res.status(404).json({ message: "Spot Image couldn't be found"})
    if (req.user.id !== img.Spot.ownerId) return res.status(403).json({message: 'Forbidden'});
    await Image.destroy({where: {id: req.params.spotimageId}});
    res.json({ message: "Successfully deleted"})
    // const img = await Image.findByPk(req.params.spotimageId);
    // const spot = await Spot.findOne({where: {ownerId: req.user.id}})
    // if (!img) return res.status(404).json({message: "Spot Image couldn't be found"});
    // if (req.user.id !== spot.ownerId) return res.status(403).json({message: "Forbidden"})

    // if (img) {
    //     if (req.user.id === spot.ownerId) {
    //         await Image.destroy({where: {id: req.params.spotimageId}});
    //         return res.json({ message: "Successfully deleted"})
    //     }
    // }

});


module.exports = router
