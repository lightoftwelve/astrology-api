const router = require('express').Router();
const { isAuthenticatedView } = require('../utils/isAuthenticated');

// Renders Dashboard
router.get('/', isAuthenticatedView, async (req, res) => {
    try {
        if (req.session.logged_in) {
            // If logged in, render the dashboard
            const data = {
                items: [
                    {
                        imageSrc: '/images/landing_page/birth-chart-natal-chart-astrology-aspects-house-placements-daily-horoscopes-light-of-twelve.png',
                        title: 'Natal Chart Readings',
                        description: 'Dig deep into the details of the sky at your time of birth. Render your birthchart here and explore the planetary positions that mark your unique celestial signature.',
                    },
                    {
                        imageSrc: '/images/landing_page/aspects-natal-chart-astrology-aspects-house-placements-daily-horoscopes-light-of-twelve.png',
                        title: 'Astrology Aspects',
                        description: 'Interactions between planets tell a story. Delve into the different aspects to understand the dynamics and meanings behind each planetary relationship.',
                    },
                    {
                        imageSrc: '/images/landing_page/house-natal-chart-astrology-aspects-house-placements-daily-horoscopes-light-of-twelve.png',
                        title: 'House Placements',
                        description: 'Every house in astrology governs a life area. Browse through the 12 houses to see where each planet resides and the influence it carries in your life.',
                    },
                    {
                        imageSrc: '/images/landing_page/horoscope-natal-chart-astrology-aspects-house-placements-daily-horoscopes-light-of-twelve.png',
                        title: 'Daily Horoscopes',
                        description: 'Coming Soon: The stars shift every day. Check in here for a daily read on the general energy and advice according to your zodiac sign.',
                    },
                ],
            };
            console.log(data);
            res.render('dashboard', {
                logged_in: req.session.logged_in,
                items: data.items,
            });
        } else {
            // If not logged in, render the login page
            res.render('login');
        }
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

// router.get('/', isAuthenticatedView, (req, res) => {
//     try {
//         const data = {
//             items: [
//                 {
//                     imageSrc: 'images/image1.jpg',
//                     title: 'Natal Chart Readings',
//                     description: 'Description 1',
//                 },
//                 {
//                     imageSrc: 'images/image2.jpg',
//                     title: 'Astrology Aspects',
//                     description: 'In-Depth Astrology Aspects',
//                 },
//                 {
//                     imageSrc: 'images/image3.jpg',
//                     title: 'House Placements',
//                     description: 'Description 3',
//                 },
//                 {
//                     imageSrc: 'images/image4.jpg',
//                     title: 'Title 4',
//                     description: 'Description 4',
//                 },
//             ],
//         };
//         console.log(data);
//         res.render("birthchart", {
//             logged_in: req.session.logged_in,
//             items: data.items,
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;