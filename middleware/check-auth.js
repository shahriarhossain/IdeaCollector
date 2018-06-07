const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const redis = require('redis');
const {promisify} = require('util');

const client = redis.createClient(process.env.redisPort, process.env.redisHost, {no_ready_check: true});
client.auth(process.env.redisPw, (err, res)=>{
    if(err){
        console.log(err);
    }
    console.log(`redis connected ${res}`);   
})

const isMemberAsync = promisify(client.sismember).bind(client);
const hGetAsync = promisify(client.hget).bind(client);

module.exports.GenerateJWT = function(newUser, callback){
    const user = {
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

module.exports.tokenSaver = function(email, callback){
    const refreshToken = randtoken.generate(16);
    client.hset("RefreshTokens", refreshToken, email, redis.print);
    client.sadd("RefreshTokenList", refreshToken);
    callback(null, refreshToken);
}

module.exports.tokenTracker = async function(refreshToken, userInfo, callback){
    const refreshTokenStatus = await isMemberAsync("RefreshTokenList", refreshToken);
    const isRefreshTokenExist = refreshTokenStatus? true: false;
    
    const getEmailByToken = await hGetAsync("RefreshTokens", refreshToken);
    const isValidTokenRequestor = (getEmailByToken==userInfo.email)? true: false;

    console.log(`isRefreshTokenExist: ${isRefreshTokenExist}    isValidTokenRequestor: ${isValidTokenRequestor}`)
    if((isRefreshTokenExist) && (isValidTokenRequestor)) {
        var user = {
            email: userInfo.email
        }
        jwt.sign({ user }, process.env.jwtRefreshSecret, { expiresIn: process.env.refreshTokenLife }, (err, token)=> {
            callback(err, token);
        });
    }
    else {
        callback('Token not found', null);
    }
}