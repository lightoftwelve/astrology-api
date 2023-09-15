// --------------------------------------------
//          FOR FRONT END ROUTES
// --------------------------------------------
const isAuthenticatedView = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

// --------------------------------------------
//           FOR BACK END ROUTES
// --------------------------------------------
const isAuthenticatedAPI = (req, res, next) => {
  if (!req.session.logged_in) {
    res.status(401).json({ message: 'Not authenticated.' });
  } else {
    next();
  }
};

module.exports = {
  isAuthenticatedView,
  isAuthenticatedAPI
};