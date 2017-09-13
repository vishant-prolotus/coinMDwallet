'use strict' ;

const config = require('../config/config.example');
var User = require('./user');
var rp = require('request-promise');

var slotkey = config.slot_keys[0]
var slotip = config.slot_hosts[0]

function store_slot_vars(email){
    // Query Slot for port
    var sendvars = '{ "email" : "'+email+'" , "access_key" : "'+slotkey+'" , "query" : "port" }'
    // Base Post Format
    var reqs = {
        method: 'POST',
        url: 'http://'+slotip+'/slotapi',
        body: sendvars , 
        headers: {
            "Content-Type": "text/plain"
        },
    }
    // Hit a post to Slot
    rp(reqs)
    .then(function (body) {
        // Post Success
            var port = JSON.parse(body).port;
            var cryp_slot_var = slotip+':'+port
            // console.log("Port = "+cryp_slot_var); 
            // Store it to DB //
            var userdata = { email: email };
            var newvalues = { cryp_slot: cryp_slot_var };

            User.updateOne(userdata, newvalues, function(err, res) {
                if (err) throw err;
                    // console.log("Slot Saved for = "+email); 
                });
    })
    .catch(function (err) {
        // POST failed...
        console.log("Slot Not Saved  , "+email)
    });

}


function store_slot_cryp_address(email){
    // Query Slot for port
    var sendvars = '{ "email" : "'+email+'" , "access_key" : "'+slotkey+'" , "query" : "address" }'
    // Base Post Format
    var reqs = {
        method: 'POST',
        url: 'http://'+slotip+'/slotapi',
        body: sendvars , 
        headers: {
            "Content-Type": "text/plain"
        },
    }
    // Hit a post to Slot
    rp(reqs)
    .then(function (body) {
        // Post Success
           var address = JSON.parse(body).address;
            // console.log("Port = "+cryp_slot_var); 
            // Store it to DB //
            var userdata = { email: email };
            var newvalues = { cryp_address: address };
            User.updateOne(userdata, newvalues, function(err, res) {
                if (err) throw err;
                    // console.log("Address Updated for = "+email); 
                });
    })
    .catch(function (err) {
        // POST failed...
        console.log("Address Not Saved  , "+slot)
    });
}

module.exports = { store_slot_vars , store_slot_cryp_address }