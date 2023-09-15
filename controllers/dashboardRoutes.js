const router = require('express').Router();
const { isAuthenticatedView } = require('../utils/isAuthenticated');

// Renders Dashboard
router.get('/', isAuthenticatedView, async (req, res) => {
    try {
        res.render(req.session.logged_in ? 'dashboard' : 'login', {
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Renders Login Page
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// Renders Birthchart form
router.get('/new-natal-chart', isAuthenticatedView, (req, res) => {
    try {
        res.render("birthchart", {
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;