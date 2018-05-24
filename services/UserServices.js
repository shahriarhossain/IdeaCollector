
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

module.exports.GenerateJWT = function(newUser, callback){
    const user = {
        name: newUser.name,
        email: newUser.email
    }
    jwt.sign({ user }, process.env.jwtSecret, { expiresIn: process.env.tokenLife }, function(err, token) {
        callback(err, token);
    });
}