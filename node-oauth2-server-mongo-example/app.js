'use strict';

const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	OAuth2Server = require('oauth2-server'),
	cors = require('cors'),
	Q = require('q');

const jwt = require('jsonwebtoken');
const utils = require('./utils/');
const model = require('./model.js');

const app = express();
app.use(cors({ origin: 'http://localhost:4444' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoUri = 'mongodb://localhost/oauth';

const appSecret = 'secretCode';

/**
 * Allow cors access for all requests
 */
app.all('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

// Connect to auth service database
mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true
}, function (err, res) {

	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
});

/* ---------------AUTHENTICATION WITH JWT------------------------- */

/**
 * Authenticate a user
 * If user details are correct returns a new JWT token.
 */
app.post('/api/auth', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	const body = req.body;
	console.log(body);
	model.getUser(body.username, body.password).exec().then(user => {
		console.log(user);
		if (!user) return res.sendStatus(401);

		var token = jwt.sign({ userID: user.id }, appSecret, { expiresIn: '2hr' });
		res.send({ token });
	});

});

/**
 * Verifies a JWT token
 */
app.post('/session', (req, res) => {
	const token = req.body.token;
	try {
		jwt.verify(token, appSecret);
		res.status(200).json({ success: true, err_message: '', err: '' }).end();
	} catch (err) {
		res.status(400).json({ success: false, err_message: 'JWT token is invalid', err: err }).end();
	}
})

/** ----------------------------------------------------------------- */

/** ---------------- Authorisation with OAuth ------------------------- */


/**
 * Returns an auth code 
 */
app.post('/code', (req, res) => {

	const token = req.body.token;
	const clientId = req.body.clientId;
	const scope = req.body.scope;

	// Create Auth Token
	try {
		const verifiedJWT = jwt.verify(token, appSecret);
		// Generate random 16 digit string for the auth code
		const code = utils.getUid(16);
		// Save auth code
		model.saveAuthCode(code, clientId, verifiedJWT.userID, scope).then(function (code, err) {
			if (code) { 
				// Once saved return auth code
				res.status(200).json(code.authCode).end();
			}
			res.status(401).json({ err: err }).end();
		});
	}
	catch (err) {
		res.status(400).json({ err: err, msg: "Invalid JWT token" }).end();
	}
});

/**
 * Provided a valid auth code returns a new access token.
 */
app.post('/token', async (req, res) => {
	const code = req.body.code;
	const redirect_uri = req.body.redirect_uri;
	const client_id = req.body.client_id;
	const client_secret = req.body.client_secret;
	const user_id = req.body.user_id;
	const scope = req.body.scope;

	

	try {

		// First check to see if there is a matching auth code in the database
		await model.getAuthCode(code).then((authCode, err) => {
			if (err) { throw err }
			if (!authCode) {
				throw new Error('Auth Code Not Found');
			} 
			return authCode;
		}).catch(error => {
			throw error;
		});

		// Generate a random 16 digit string for the access token
		const access_token = utils.getUid(16);

		// If an auth code has been found then save the new access token
		let token = await model.saveToken(code, access_token, client_id, user_id, scope).then((result, err) => {
			if (err) {
				throw new Error('Error Saving Access Token');
			}
			return access_token;
		}).catch(error => {
			throw error;
		});

		// Remove old auth code. This stops a client from authorising multiple times with the same code.
		await model.removeAuthCode(code).then( (code, err) => {
			if (err) { throw err}
			if (!code) { throw new Error('Could Not Find Auth Code'); }
			return code;
		}).catch(error => {
			throw error;
		});

		// Return access token
		res.status(200).json({access_token: token}).end();

	} catch (err) {
		console.log(err);
		res.status(500).json({err: err.message}).end();
	}
});

/**
 * Verify an access token.
 * Checks to see if a valid token is on the database with matching credentials.
 * Also checks to see if the requested scope has permission.
 */
app.post('/verify-token', (req, res) => {
	const token = req.body.token;
	const client_id = req.body.client_id;
	const user_id = req.body.user_id;
	const client_secret = req.body.client_secret;
	const scope_request = req.body.scope_request;

	model.verifyToken(client_id, client_secret, user_id, token).exec().then(result => {
		if (result !== null) {
			console.log(result);
			// Check if scope request valid
			if (result.scope.includes(scope_request)) {
				res.status(200).json({ success: true }).end();
			} else {
				res.status(400).json({ success: false, msg: "You do not have permission to perform that action." }).end();
			}
		};
		res.status(400).json({ success: false, msg: 'You do not have permission to perform that action.' }).end();
	})
});

/**
 * Remove authorisation from a client. This will remove their access token, forcing them to re-authorise
 * to gain access again.
 */
app.delete('/authorized/:client', async (req, res) => {
	const client = req.params.client;
	const token = req.header('Authorization');

	try {
		// Verify the user's JWT
		jwt.verify(token, appSecret);
		// Remove clients token
		await model.removeToken(client).then( (token, err) => {
			if (err) { throw err; }
			if (token.n === 0) { throw new Error('Could Not Find Access Token'); }
			res.status(200).json({msg: 'Token Deleted'}).end();
		}).catch( error => {
			throw error;
		});
	} catch (error) {
		res.status(500).json({msg: error.message}).end();
	}

})

app.get('/authfitness', (req, res) => {

	const access_token = 'fitnessapp';
	const code = '';
	const client_id = 'fitnessApp';
	const user_id= '';
	const scope = 'health-write';
	
	
	model.saveToken(code, access_token, client_id, user_id, scope).then((result, err) => {
		if (err) {
			throw new Error();
		} else {
			console.log("Finished saving token");
			res.status(200).end();
		}
	}).catch(error => {
		res.status(500).end();
	});

});

/**
 * Returns a list of all authorised clients. This is to be displayed on the pod.
 */
app.get('/authorized', (req, res) => {
	model.getAuthorizedApps().exec().then(result => {
		res.status(200).json(result).end();
	})
});

app.listen(3000);
