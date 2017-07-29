'use strict';

const path = process.cwd();
const SearchHandler = require(path + '/app/controllers/searchHandler.server.js');
module.exports = function (app, passport) {

  const searchHandler = new SearchHandler();

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  app.route('/login')
    .get(function (req, res) {
      res.render('login');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.twitter);
    });

  app.route('/auth/twitter')
    .get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/')
    .get(searchHandler.getNightLife);

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
      res.render('profile');
    });
};
