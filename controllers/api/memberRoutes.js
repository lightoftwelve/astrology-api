const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { Member } = require('../../models');

// api/members/login
// router.post('/login', async (req, res) => {
router.post('/login',
  [
    check('email').isEmail(),
    check('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const memberData = await Member.findOne({ where: { email: req.body.email } });
      if (!memberData) {
        return res.status(400).json({ message: 'Incorrect username or password combination, please try again' });
      }

      const validPassword = await memberData.checkPassword(req.body.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Incorrect username or password combination, please try again' });
      }

      req.session.save(() => {
        req.session.member_id = memberData.id;
        req.session.logged_in = true;

        return res.json({ user: memberData, message: 'Success!' });
      });

    } catch (err) {
      return res.status(400).json(err);
    }
  });

// api/members/status
router.get('/status', (req, res) => {
  if (req.session.logged_in) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// api/members/register
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

    Member.bulkCreate(memberData)

    res.status(200).json({ message: 'User registered successfully!' });
  }
);

// api/members/logout
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

module.exports = router;