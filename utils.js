const jwt = require('jsonwebtoken');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

module.exports.createJWT = function (id, isGuest = false) {
    return jwt.sign({ _id: id.toString(), isGuest: isGuest }, process.env.JWT_SECRET);
}

module.exports.generateId = function () {
	return nanoid();
}

module.exports.pick = function (obj, props) {

	'use strict';

	// Make sure object and properties are provided
	if (!obj || !props) return;

	// Create new object
	var picked = {};

	// Loop through props and push to new object
	props.forEach(function(prop) {
		picked[prop] = obj[prop];
	});

	// Return new object
	return picked;

};