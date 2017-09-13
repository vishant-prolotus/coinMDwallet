var express = require('express');
var router = express.Router();
var User = require('../models/user');
var curl = require('../models/curlingslot')

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
          curl.store_crypto_balance(user.cryp_address,user.cryp_slot,user.email)
          var tx_hash = user.cryp_last_hash
          return res.render("send.ejs",{mainbal:user.cryp_main_bal,status:'',tx_hash:tx_hash});
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
          // do the transaction task here///
          var email = user.email
          if (req.body.s_amt && req.body.s_add && req.body.s_fee) {
            curl.send_transaction(req.body.s_amt*100,req.body.s_add,req.body.s_fee*100,user.cryp_slot,user.email)
            curl.store_crypto_balance(user.cryp_address,user.cryp_slot,user.email)
          return res.redirect("/send");
          } 
          else {
            var tx_hash = user.cryp_last_hash
            res.render("send.ejs",{mainbal:user.cryp_main_bal,status:'Incomplete Fields',tx_hash:tx_hash});


          }

          }
    }
  })
})

module.exports=router ;