// signAccessToken
// signRefreshToken

const jwt = require('jsonwebtoken');
const config = require('../config');

/* 
{
  userData: {
    _id: '69228d4c050bd464b7f4e032',
    name: 'test2',
    email: 'test3@gmail.com',
    password: '$2b$10$PuLF60/z9Zo5OEN2uyziAOMzIzWCdgOxvJ9LyXV2tq9UuFjw8wR8a',    
    createdAt: '2025-11-23T04:27:56.965Z',
    updatedAt: '2025-11-23T04:40:27.425Z',
    __v: 0
  },
  iat: 1763873844,
  exp: 1763874744
}
*/

const signAccessToken = (userData) => {
    // yehan hum pura ke object banega aur osme object banega 
    const token = jwt.sign({ userData }, config.jwt.acessSecret, {
        expiresIn: config.jwt.acessExpire,
    },);

    // 1.Method=================
    // jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function (err, token) {
    //     console.log(token);
    // });
    // 2.Method ========
    // jwt.sign({
    //     exp: Math.floor(Date.now() / 1000) + (60 * 60),
    //     data: 'foobar'
    // }, 'secret');

    return token;
}

// ==========congiguration--->env ======== me expiry hai 
const signRefreshToken = (userData) => {
    const token = jwt.sign({ userData }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire
    },);

    return token;
}

module.exports = {
    signAccessToken,
    signRefreshToken
}

