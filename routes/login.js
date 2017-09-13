var express = require('express');
var router = express.Router();
var User = require('../models/user');
const slotify = require('../models/slotquery');

// Session
router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.render("login.ejs",{loginerr:"FAST, SECURE AND EASY"});
          err.status = 400;
          return next(err);
        } else {
 //         return res.render("dashboard.ejs",{username:user.username});
            slotify.store_slot_vars(user.email)
            slotify.store_slot_cryp_address(user.email)
            return res.redirect('/dashboard');
}
        console.log("User was "+user.username);
      }
    });
});

router.post('/', function (req, res, next) {

// Login //
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail.toLowerCase(), req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return res.render("login.ejs",{loginerr:"LOGIN FAILED. TRY AGAIN."});
        return next(err);
      } else {
        req.session.userId = user._id;
                return res.redirect('/dashboard');
        }
    });
  } 



  /* 
  // Sign up //
  else if (
    req.body.sigupemail &&
    req.body.sigupusername &&
    req.body.sigupassword &&
    req.body.siguppasswordConf
    ) {

    if (req.body.siguppassword !== req.body.siguppasswordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    } else {    var userData = {
      email: req.body.sigupemail,
      username: req.body.sigupusername,
      password: req.body.siguppassword,
      passwordConf: req.body.siguppasswordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });
    }
  } 
  
  */

  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return res.render("login.ejs",{loginerr:"LOGIN FAILED. TRY AGAIN."});
    return next(err);
  }
})










// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
