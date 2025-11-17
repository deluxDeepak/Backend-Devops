// signAccessToken
// signRefreshToken

const jwt = require('jsonwebtoken');
const config = require('../config');

const signAccessToken = (userData) => {
    jwt.sign({ userData }, config.jwt.acessSecret, {
        expiresIn: config.jwt.acessExpire,
    })

    // 1.Method=================
    // jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function (err, token) {
    //     console.log(token);
    // });
    // 2.Method ========
    // jwt.sign({
    //     exp: Math.floor(Date.now() / 1000) + (60 * 60),
    //     data: 'foobar'
    // }, 'secret');
}

const signRefreshToken = (userData) => {
    jwt.sign({ userData }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken
}

