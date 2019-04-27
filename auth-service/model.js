var mongoose = require('mongoose');

/**
 * Configuration.
 */

var clientModel = require('./mongo/model/client'),
	tokenModel = require('./mongo/model/token'),
	userModel = require('./mongo/model/user');
	codeModel = require('./mongo/model/code');

/**
 * Add example client and user to the database (for debug).
 */
var loadExampleData = function() {

	var client1 = new clientModel({
		clientId: 'application',
		clientSecret: 'secret',
		grants: [
			'password'
		],
		redirectUris: []
	});

	var client2 = new clientModel({
		clientId: 'confidentialApplication',
		clientSecret: 'topSecret',
		grants: [
			'password',
			'client_credentials'
		],
		redirectUris: []
	});

	var user = new userModel({
		id: '123',
		username: 'pedroetb',
		password: 'password'
	});

	var authCode = new codeModel({
		authCode: 'r34rrfr',
		authCodeExpiresAt: 1,
		client: "wefefwe",
		user: "wwddadw"
	});

	client1.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	user.save(function(err, user) {

		if (err) {
			return console.error(err);
		}
		console.log('Created user', user);
	});

	client2.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	authCode.save( (err, code) => {
		if (err) {
			return console.error(err);
		}
	});
};


/**
 * Dump the database content (for debug).
 */

var dump = function() {

	clientModel.find(function(err, clients) {

		if (err) {
			return console.error(err);
		}
		console.log('clients', clients);
	});

	tokenModel.find(function(err, tokens) {

		if (err) {
			return console.error(err);
		}
		console.log('tokens', tokens);
	});

	userModel.find(function(err, users) {

		if (err) {
			return console.error(err);
		}
		console.log('users', users);
	});
};

// Find an access token
var getAccessToken = function(token) {

	return tokenModel.findOne({
		accessToken: token
	});
};

// Find an auth code
var getAuthCode = function(code) {
	return codeModel.findOne({
		authCode: code
	})
}

// Remove auth code
var removeAuthCode = function(code) {
    return codeModel.deleteOne({ authCode: code });
}

// Save an auth code along with identifying credentials
var saveAuthCode = function(code, client, user, scope) {

	var codeInstance = new codeModel();
	const expiresAt = 1;
	codeInstance.authCodeExpiresAt = expiresAt;
	codeInstance.authCode = code;
	codeInstance.client = client;
	codeInstance.user = user;
	codeInstance.scope = scope;
	return codeInstance.save();
}

// Find client details
var getClient = function(clientId, clientSecret) {
	return clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	});
};

// Save access token
var saveToken = function(code, token, client, user, scope) {

	var tokenInstance = {};
	tokenInstance.accessToken = token;
	tokenInstance.user = user;
	tokenInstance.client = client;
	tokenInstance.scope = scope;

	return tokenModel.findOneAndUpdate({ client }, tokenInstance, { upsert: true });
};

// Remove access token by client
var removeToken = function(client) {
    return tokenModel.deleteOne({ client });
}

// Find a user by username and password
var getUser = function(username, password) {

	return userModel.findOne({
		username: username,
		password: password
	});
};

// Find an access token and verify it.
var verifyToken = function(client, secret, user, token) {
	return tokenModel.findOne({
		// client: client,
		// user: user,
		accessToken: token
	})
}

// Return all authorised apps
var getAuthorizedApps = function() {
	return tokenModel.find({});
}

// Run this file in the command line to fill the database with initial data.
loadExampleData();

/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getAuthCode: getAuthCode,
	getClient: getClient,
	saveAuthCode: saveAuthCode,
	saveToken: saveToken,
	getUser: getUser,
	loadExampleData: loadExampleData,
	dump: dump,
	verifyToken: verifyToken,
	getAuthorizedApps: getAuthorizedApps,
	removeAuthCode: removeAuthCode,
	removeToken: removeToken
};
