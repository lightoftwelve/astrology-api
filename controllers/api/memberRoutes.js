const router = require('express').Router();
const { Member } = require('../../models');

router.post('/login', async (req, res) => {
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

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      return res.status(204).end();
    });
  } else {
    return res.status(404).end();
  }
});

module.exports = router;