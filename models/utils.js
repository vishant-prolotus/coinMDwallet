'use strict';


// Date Function
function date(){
    var dateTime = require('date-and-time');
    date = dateTime.format(new Date(), 'DD-MMM-YYYY hh.mm.ss A');
    return date
}


/* Usage 
const util = require("./utils.js");
console.log(util.date());
*/



// Trimming Function
function trim(start,end,string){
    var trimmedString = string.substring(start, end);
    return trimmedString ;
}

/* Usage 
str = "GENESIS_TX_HEX=gcg4rhefudhaxnruiehwcdnxzuirehdn";
const util = require("./modules/utils.js");
newstr = util.trim(2,6,text);
console.log("str"+"=>"+"newstr");
*/

// getIP Function
var ip;
function getip(a,b){
if (a['x-forwarded-for']) {
    ip = a['x-forwarded-for'].split(",")[0];
} else if (b && b.remoteAddress) {
    ip = b.remoteAddress;
} else {
    ip = req.ip;
}return ip;
}

/* Usage 
const util = require("./modules/utils.js");
ip = util.getip(req.headers,req.connection,)
console.log("ip");
*/


// Get QR Function
function genqr(data){
    var rqr = require('qr-image');
    var iurl = rqr.imageSync(data, { type: 'svg' });
    return iurl
}


// Export all of em//

module.exports = { date, trim , ip , genqr };
