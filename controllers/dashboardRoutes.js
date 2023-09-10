const router = require('express').Router();
const { Member } = require('../models');
const isAuthenticated = require('../utils/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const memberData = await Member.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });

        const members = memberData.map((info) => info.get({ plain: true }));

        res.render('dashboard', {
            members,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;