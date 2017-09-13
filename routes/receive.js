var express = require('express');
var router = express.Router();
var User = require('../models/user');
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
          if(! user.cryp_address){
            return res.render("receive.ejs",{
            qrsvg:util.genqr('Loading'),
            address:'Loading',
            trim_address:'Loading',
            username:user.username});
          }
          else{
            var trim_add = util.trim(0,6,user.cryp_address)
            return res.render("receive.ejs",{
            qrsvg:util.genqr(user.cryp_address),
            address:user.cryp_address,
            trim_address:trim_add,
            username:user.username
          });
          }
        }
      }
    });
});


module.exports=router;