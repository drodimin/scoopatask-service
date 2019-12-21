const jwt = require('jsonwebtoken');

module.exports.createJWT = function (id) {
    return jwt.sign({ _id: id.toString(), isGuest: true },process.env.JWT_SECRET);
}