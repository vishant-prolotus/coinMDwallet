var express = require('express');
var router = express.Router();
var User = require('../models/user');
const config = require('../config/config.example');
const er = require('../models/error_codes')
const util = require('../models/utils')
var bcrypt = require('bcrypt');


var bodyParser = require('body-parser', ({extended:true}));
router.use(bodyParser.json());

wary = config.api_whitelist

// Create User API //
router.put('/', function (req, res, next) {

    var body = "";
    req.on('data', function (chunk) {body += chunk;});
    req.on('end', function () {
    // console.log('Request Body=> ' + body);
    try {
        var jvar = JSON.parse(body);
        if (jvar.email && jvar.username && jvar.password && jvar.access_key) {
            var atkn = jvar.access_key
            // var atkn = 'token12345' ;
            if (wary.indexOf(atkn) != '-1') {
                console.log("Valid Access Key "+atkn);
                var userData = {
                    email: jvar.email.toLowerCase(),
                    username: jvar.username+'_'+jvar.email.toLowerCase(),
                    password: jvar.password,
                    passwordConf: jvar.password
                }
                User.create(userData, function (error, user) {
                    if (error) {
                        res.json({ Error: error.errmsg});
                    } else {
                        res.json({ Success: jvar.email.toLowerCase()+' Created '});
                        console.log('Added '+jvar.email.toLowerCase())
                    }
                }) 
            } else { res.json({ Error: er.badtkn}); }

        } else {
            var err = new Error(er.badfld);
            err.status = 400;
            res.json({ Error: er.badfld});
        }
    } catch (e) { res.json({ Error: er.badjson}); }
    })
})


// Delete User API
router.delete('/', function (req, res, next) {
    // var aip = util.getip(req.headers,req.connection)
    var body = "";
    req.on('data', function (chunk) {body += chunk;});
    req.on('end', function () {
    // console.log('body: ' + body);
    try {
        var jvar = JSON.parse(body);
        if (jvar.email && jvar.access_key) {
            var atkn = jvar.access_key
            // var atkn = 'token12345' ;
            if (wary.indexOf(atkn) != '-1') {
                console.log("Valid Access Key "+atkn);
                var userData = {
                    email: jvar.email,
                }
                User.remove(userData, function (error, user) {
                    if (error) {
                        res.json({ Error: error.errmsg});
                    } else {
                        res.json({ Success: jvar.email+' Removed '});
                    }
                }) 
            } else { res.json({ Error: er.badtkn}); }
        } else {
            var err = new Error(er.badfld);
            err.status = 400;
            res.json({ Error: er.badfld});
        }
    } catch (e) { res.json({ Error: er.badjson}); }
    })
});


// Update Users //
router.patch('/', function (req, res, next) {

    var body = "";
    req.on('data', function (chunk) {body += chunk;});
    req.on('end', function () {
    // console.log('Request Body=> ' + body);
    try {
        var jvar = JSON.parse(body);
        if (jvar.email && jvar.password && jvar.access_key) {
            var atkn = jvar.access_key
            // var atkn = 'token12345' ;
            if (wary.indexOf(atkn) != '-1') {
                console.log("Valid Access Key "+atkn);
                var email = jvar.email.toLowerCase()
                var userdata = { email: email };
                var pass = jvar.password
                bcrypt.hash(pass, 10, function (err, hash) {
                    if (err) {return next(err);}
                    pass = hash;
                    var newvalues = { password: pass, passwordConf: pass}
                    User.updateOne(userdata, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("Updated = "+jvar.password)
                        })
                res.json({ Success: email+':'+jvar.password+' (Password Updated)'})
                })
            } else { res.json({ Error: er.badtkn}); }

        } else {
            var err = new Error(er.badfld);
            err.status = 400;
            res.json({ Error: er.badfld});
        }
    } catch (e) { res.json({ Error: er.badjson}); }
    })
})





router.get('/', function (req, res, next) {
    res.redirect('/login')
});

//
module.exports = router;