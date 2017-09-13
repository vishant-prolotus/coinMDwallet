var express = require('express');
var router = express.Router();
const config = require('../config/config.example');
var User = require('../models/user');
const slotify = require('../models/slotquery');
var curl = require('../models/curlingslot')

router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.redirect('/');
          err.status = 400;
          return next(err);
        } else {
          // console.log("Logged in => "+user.email)
          var email = user.email ;

          //slotify.store_slot_vars(email)

          var slot = user.cryp_slot
          // console.log("Slot from DB => "+slot)
          if (! slot){
          return res.render("dashboard.ejs",{username:user.username,mainbal:"Loading",lockbal:"Loading"});
          console.log("Value of slot is empty")
          } else {
          if ( ! user.cryp_address) { slotify.store_slot_cryp_address(email) }
          curl.get_previous_transactions(slot,email)
          var address = user.crypto_address
          curl.store_crypto_balance(address,slot,email)
          var hashes=user.cryp_recent_hashes
          if (hashes){
          return res.render("dashboard.ejs",{username:user.username,mainbal:user.cryp_main_bal,lockbal:user.cryp_lock_bal,hashes:hashes});
          } else {
          return res.render("dashboard.ejs",{username:user.username,mainbal:user.cryp_main_bal,lockbal:user.cryp_lock_bal,hashes:''});

          }
        }
        } 
      }
    });
});


module.exports = router;