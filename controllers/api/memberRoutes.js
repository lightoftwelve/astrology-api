const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { Op } = require("sequelize");
const { Member } = require('../../models');
const { isAuthenticatedAPI } = require('../../utils/isAuthenticated');

// User login with username or password | api/members/login
router.post('/login',
  [
    check('identifier', 'Username or Email is required').notEmpty(),
    check('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!req.body.identifier) {
        return res.status(400).json({ message: 'Username or Email is required.' });
      }

      // checks for username or email
      const memberData = await Member.findOne({
        where: {
          [Op.or]: [
            { email: req.body.identifier },
            { username: req.body.identifier }
          ]
        }
      });

      if (!memberData) {
        return res.status(400).json({ message: 'Incorrect username or password combination, please try again' });
      }

      const validPassword = await memberData.validatePassword(req.body.password);

      if (!validPassword) {
        return res.status(400).json({ message: 'Incorrect username or password combination, please try again' });
      }

      req.session.save(() => {
        req.session.member_id = memberData.id;
        req.session.logged_in = true;

        return res.json({ user: memberData, message: 'Success!' });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Login failed. Please try again later.' });
    }
  });

// Checks sign in status of user for header signin/out button | api/members/status
router.get('/status', (req, res) => {
  if (req.session.logged_in) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Allows members to sign up for an account | api/members/register
router.post('/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('first_name', 'First name is required').notEmpty(),
    check('last_name', 'Last name is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase character.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase character.')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number.')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least one special character.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const member = await Member.create(req.body);

      // Start session after registering
      req.session.save(() => {
        req.session.member_id = member.id;
        req.session.logged_in = true;

        return res.json({ user: member, message: 'User registered and logged in successfully!' });
      });

    } catch (err) {
      res.status(400).json(err);
    }
  });

// Destroys session when member logs out | api/members/logout
router.post('/logout', (req, res) => {
  if (req.session && req.session.logged_in) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session.' });
      }
      return res.status(204).end();
    });
  } else {
    return res.status(404).json({ message: 'No session found.' });
  }
});

// api/members/user
router.get('/user', isAuthenticatedAPI, async (req, res) => {
  try {
    const userId = req.session.member_id;

    const user = await Member.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ first_name: user.first_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;