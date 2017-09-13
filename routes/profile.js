var express = require('express');
var router = express.Router();
var User = require('../models/user');
var express = require('express');
var gravatar = require('gravatar');
var bcrypt = require('bcrypt');
var util = require('../models/utils')

router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.render('partials/404.ejs');
          err.status = 400;
          return next(err);
        } else {
            var secureUrl = gravatar.url(user.email, {s: '200', protocol: 'https' , d:'retro'}, true);
            return res.render("profile.ejs",{
              dps:secureUrl,
              num:user.contact,
              name:user.username
          });

        }
      }
    });
});

   
router.post('/', function (req, res, next) {

    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.render('partials/404.ejs');
          err.status = 400;
          return next(err);
        } else {

          if (req.body.e_num) {
            var userdata = { email: user.email };
            var newvalues = { contact: req.body.e_num}
            User.updateOne(userdata, newvalues, function(err, res) {
              if (err) throw err;
                console.log("Updated = "+req.body.e_num); 
              });
            }

          if (req.body.e_name) {
            var userdata = { email: user.email };
            var newvalues = { username: req.body.e_name}
            User.updateOne(userdata, newvalues, function(err, res) {
              if (err) throw err;
                console.log("Updated = "+req.body.e_name); 
              });
            }

          if (req.body.e_pass) {
            var userdata = { email: user.email };
            var pass = req.body.e_pass
            bcrypt.hash(pass, 10, function (err, hash) {
              if (err) {return next(err);}
              pass = hash;
              var newvalues = { password: pass, passwordConf: pass}
              User.updateOne(userdata, newvalues, function(err, res) {
                if (err) throw err;
                 console.log("Updated = "+req.body.e_pass); 
                });
              next(); 
            })
          }
            return res.redirect("/profile")
        
        }}      
    })
})



module.exports=router;