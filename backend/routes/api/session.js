// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Sequelize, Review, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
  ];


// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );


// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

// Restore session user
router.get(
    '/',
    (req, res) => {
      const { user } = req;

      if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

  // Get all Spots owned by the Current User
  router.get(
    '/spots', requireAuth,
    async (req, res) => {
      const { user } = req;

      if (user) {
        const spots = await Spot.findAll({
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
            // [Sequelize.fn('AVG',Sequelize.col('reviews.stars')), 'avgRating']
            [Sequelize.literal('ROUND(AVG(reviews.stars), 1)'), 'avgRating']
          ],
          include: [
            {model: Review, attributes: []},
            // {model: Image, as: 'previewImage', attributes: ['url'], limit: 1}
          ],
          group: ['Spot.id'],
        },
          {where:{ownerId: user.id}});

          const spotList = [];
          for (let i = 0; i < spots.length; i++) {
              const images = await Image.findAll({where: {imageableType: 'Spot'}, attributes: ['url']})
              const spot = spots[i].toJSON()
              spotList.push(spot)
              spot.previewImage = images[0].url
          }

        return res.json({
          Spots: spotList
        });
      }
    }
  );






module.exports = router;
