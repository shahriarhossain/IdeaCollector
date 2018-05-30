const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.CreateUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.ValidatePassword = function(hash, password, callback){
    bcrypt.compare(password, hash, function(err, res) {
        if(err){
            console.log('error inside validate password ')
            callback(err, null);
        }
        if(res != undefined){
            callback(null, res);
        }
    });
}