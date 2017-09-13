'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = "xei1rae1eeGogh9engoogahsaitooche" ; // 256 Bytes / 32 Chars
const IV_LENGTH = 16 ;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH) ;
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text) ;

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':') ;
    let iv = new Buffer(textParts.shift(), 'hex') ;
    let encryptedText = new Buffer(textParts.join(':'), 'hex') ;
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]) ;

    return decrypted.toString();
}

module.exports = { decrypt, encrypt };

/* USAGE

const cryp = require("./modules/cryptosalt.js");

str = "GENESIS_TX_HEX=gcg4rhefudhaxnruiehwcdnxzuirehdn";

abc = cryp.encrypt(str);

def = cryp.decrypt(abc);
console.log(`${def} => ${abc}`);

*/