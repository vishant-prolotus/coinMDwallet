var express = require('express');
var User = require('./user');
var rp = require('request-promise');

// Store balance to database
function store_crypto_balance(address,slot,email){

    var bodyreq = {
        "jsonrpc": "2.0", 
        "method": "getbalance", 
        "params": {}
    }

    // Base Post Format
    var  baserequest = {
        url: 'http://'+slot+'/json_rpc',
        // url: 'http://localhost:2231/json_api',
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyreq,
        json: true
    }

    rp(baserequest)
    .then(function (body) {
        curlout = body.result
        lockbal = curlout.locked_amount / 100
        mainbal = curlout.available_balance / 100
        // Store it to DB //
        var userdata = { email: email };
        var newvalues = { cryp_main_bal: mainbal, cryp_lock_bal : lockbal };
        User.updateOne(userdata, newvalues, function(err, res) {
          if (err) throw err;
              // console.log(email+" Balance Stored = "+mainbal , lockbal); 
            });    })
    .catch(function (err) {
        // POST failed...
        console.log("Balance Not Saved  , "+slot)
    });

}


function send_transaction(amount,to_address,fees,slot,email){

var bodyreq = {
	"jsonrpc":"2.0",
	"method":"transfer",
	"params":{
		"destinations":[{"amount":amount,"address":to_address}],
		"payment_id":"", 
		"fee":fees,
		"mixin":0,
		"unlock_time":0
	}
}

console.log(bodyreq)
    // Base Post Format
    var  baserequest = {
        url: 'http://'+slot+'/json_rpc',
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyreq,
        json:true
    }
    rp(baserequest)
    // Try Post
    .then(function (body) {
        curlout = body.result
        tx_hash = curlout.tx_hash
        console.log(tx_hash)
        // Store it to DB //
        var userdata = { email: email };
        var newvalues = { cryp_last_hash: tx_hash };
        User.updateOne(userdata, newvalues, function(err, res) {
          if (err) throw err;
              // console.log("Tx Stored = "+tx_hash ); 
            });    })
    .catch(function (err) {
        // POST failed...
        console.log("Tx Not Saved  , "+slot)
    });
    
}


// Get Previous Transactions //

function get_previous_transactions(slot,email){

bodyreq =    {
	"jsonrpc": "2.0", 
	"method": "get_transfers", 
	"params": {}
}
    var  baserequest = {
        url: 'http://'+slot+'/json_rpc',
        // url: 'http://localhost:2231/json_api',
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyreq,
        json: true
    }

    rp(baserequest)
    .then(function (body) {
        var thash = ""
        curlout = body.result.transfers
        // console.log('Hashes = '+curlout.length)
        if (curlout.length < 5)
            {
                max = curlout.length
            } else {
                max = 5
        }
        for (i=0; i<max; i++){    
        if(! thash){ 
            thash=curlout[i].transactionHash+':'+curlout[i].amount/100+':'+curlout[i].fee/100+':'+curlout[i].time+':'+curlout[i].output
         } else { 
            thash=curlout[i].transactionHash+':'+curlout[i].amount/100+':'+curlout[i].fee/100+':'+curlout[i].time+':'+curlout[i].output+','+thash
            }
        } 
  // Store it to DB //
        var userdata = { email: email };
        var newvalues = { cryp_recent_hashes: thash};
        User.updateOne(userdata, newvalues, function(err, res) {
          if (err) throw err;
          // console.log("Hashes Saved")
            });    
        
        })
    .catch(function (err) {
        // POST failed...
        console.log("Hashes Not Saved  , "+slot)
    }
);





}
///

module.exports = { 
    store_crypto_balance ,
    get_previous_transactions ,
    send_transaction 

}

