const jwt = require('jsonwebtoken');

module.exports.GenerateJWT = function(newUser, callback){
    const user = {
        name: newUser.name,
        email: newUser.email
    }
    jwt.sign({ user }, process.env.jwtSecret, { expiresIn: process.env.tokenLife }, (err, token)=> {
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