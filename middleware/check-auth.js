const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
var refreshTokens = {};

module.exports.GenerateJWT = function(newUser, callback){
    const user = {
        email: newUser.email
    }
    jwt.sign({ user }, process.env.jwtSecret, { expiresIn: process.env.tokenLife }, (err, token)=> {
        const refreshToken = randtoken.uid(256) 
        callback(err, token);
    });
}

module.exports.verifyToken = function(req, res, callback){
    jwt.verify(req.token, process.env.jwtSecret, (err, authData)=>{
        if(err){
            callback(err, null);
        }
        else
        {
            callback(null, authData);
        }
    })
}

module.exports.tokenSaver = function(email, callback){
    const refreshToken = randtoken.generate(16);
    refreshTokens[refreshToken] = email;
    callback(null, refreshToken);
}

module.exports.tokenTracker = function(refreshToken, userInfo, callback){
    if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == userInfo.email)) {
        var user = {
            email: userInfo.email
        }
        jwt.sign({ user }, process.env.jwtRefreshSecret, { expiresIn: process.env.refreshTokenLife }, (err, token)=> {
            const refreshToken = randtoken.uid(256) 
            callback(err, token);
        });
    }
}