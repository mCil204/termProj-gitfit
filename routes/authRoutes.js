const express  = require('express');
const passport = require('passport');
const router   = express.Router();

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/');
  res.render('login');
});

router.get('/google', passport.authenticate('google', {
  keepSessionInfo: true,
  scope: ['profile', 'email'],
}));

router.get('/google/callback',
  passport.authenticate('google', {
    keepSessionInfo: true,
    failureRedirect: '/auth/login',
  }),
  (req, res) => {
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/auth/login'));
  });
});

module.exports = router;
