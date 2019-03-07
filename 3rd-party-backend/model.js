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

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(token) {

	return tokenModel.findOne({
		accessToken: token
	});
};

var getAuthCode = function(code) {
	return codeModel.findOne({
		authCode: code
	})
}

var saveAuthCode = function(code, client, user) {
	console.log(code, client, user);
	var codeInstance = new codeModel();
	const expiresAt = 1;
	codeInstance.authCodeExpiresAt = expiresAt;
	codeInstance.authCode = code;
	codeInstance.client = client;
	codeInstance.user = user;

	return codeInstance.save();
}

var getClient = function(clientId, clientSecret) {

	return clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	});
};

var saveToken = function(token, client, user) {

	token.client = {
		id: client.clientId
	};

	token.user = {
		id: user.username || user.clientId
	};

	var tokenInstance = new tokenModel(token);

	tokenInstance.save();

	return token;
};

/*
 * Method used only by password grant type.
 */

var getUser = function(username, password) {

	return userModel.findOne({
		username: username,
		password: password
	});
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function(client) {

	return clientModel.findOne({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		grants: 'client_credentials'
	});
};

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
	getUserFromClient: getUserFromClient,
	loadExampleData: loadExampleData,
	dump: dump
};
