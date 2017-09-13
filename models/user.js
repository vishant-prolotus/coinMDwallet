var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema(
  {
  email:    {type: String,unique: true,required: true,trim: true},
  username: {type: String,required: false,unique: false},
  password: {type: String,required: true},
  passwordConf: {type: String,required: true},
  contact: {type: Number,required: false},
  tax_payer_id: {type: String,required: false},
  cryp_address: {type: String,required: false},
  cryp_main_bal : {type: String,required: false},
  cryp_lock_bal : {type: String,required: false},
  cryp_slot : {type: String,required: false},
  cryp_last_hash : {type: String,required: false},
  cryp_recent_hashes : {type: String, required:false}
  }
);

// Authenticate Input Against Database //

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }  
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

// Hashing a password before saving it to the database //
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;
