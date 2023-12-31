const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Last Name is required'),
    check('username')
      .custom(async value => {
        const existingUsername = await User.findOne({where: { username: value}});
        if (existingUsername) throw new Error("User already exists")
      })
      .withMessage('User with that username already exists'),
    check('email')
      .custom(async value => {
        const existingEmail = await User.findOne({where: { email: value}});
        if (existingEmail) throw new Error("User already exists")
      })
      .withMessage('User with that email already exists'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName, credential } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const existingUser = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: username,
            email: email
          }
        }
      });

      if (existingUser) return res.status(500).json({
        message: "User already exists"
      })

      const user = await User.create({ email, username, hashedPassword, firstName, lastName });


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



module.exports = router;
