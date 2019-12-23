const jwt = require('jsonwebtoken');

module.exports.createJWT = function (id, isGuest = false) {
    return jwt.sign({ _id: id.toString(), isGuest: isGuest }, process.env.JWT_SECRET);
}