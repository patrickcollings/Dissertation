'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response,
	cors = require('cors'),
	Q = require('q');

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const oauth2orize = require('oauth2orize');
const utils = require('./utils/');

var app = express();
const model = require('./model.js');
app.use(cors({ origin: 'http://localhost:4444' }));

const server = oauth2orize.createServer();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var mongoUri = 'mongodb://localhost/oauth';

/* ---------------AUTHENTICATION WITH JWT------------------------- */

app.all('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/api/auth', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	const body = req.body;

	model.getUser(body.username, body.password).exec().then(user => {
		if (!user) return res.sendStatus(401);

		var token = jwt.sign({ userID: user.id }, 'todo-app-super-shared-secret', { expiresIn: '2hr' });
		res.send({ token });
	});

});

/** ---------------END OF AUTHENTICATION--------------------------- */

mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true
}, function (err, res) {

	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
	// model.dump();
});


app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

app.post('/code', (req, res) => {

	console.log('Beginning Code Generation');

	const token = req.body.token;
	const redirect = req.body.redirect;
	const clientId = req.body.clientId;
	const scope = req.body.scope;

	// Authorise Token
	try {
		// console.log("Trying");
		const jwwt = jwt.verify(token, 'todo-app-super-shared-secret');
		// console.log("Trying");
		const code = utils.getUid(16);
		// TODO Check user on database
		// TODO check redirect on database
		// TODO check clientId on database
		// Save auth code
		model.saveAuthCode(code, clientId, jwwt.userID, scope).then(function (code, err) {
			if (code) { 
				console.log('Finished code gen');
				res.status(200).json(code.authCode).end();
			}
			res.status(401).json({ err: err }).end();
		});
	}
	catch (err) {
		res.status(400).json({ err: err, msg: "Invalid JWT token" }).end();
	}
});

app.post('/token', async (req, res) => {
	const code = req.body.code;
	const redirect_uri = req.body.redirect_uri;
	const client_id = req.body.client_id;
	const client_secret = req.body.client_secret;
	const user_id = req.body.user_id;
	const scope = req.body.scope;

	const access_token = utils.getUid(16);

	try {

		console.log('Beginning token creation');

		let authCode = await model.getAuthCode(code).then((authCode, err) => {
			if (err) { throw err }
			if (!authCode) {
				throw new Error('Auth Code Not Found');
			} 
			return authCode;
		}).catch(error => {
			throw error;
		});

		let token = await model.saveToken(code, access_token, client_id, user_id, scope).then((result, err) => {
			if (err) {
				throw new Error('Error Saving Access Token');
			}
			return access_token;
		}).catch(error => {
			throw error;
		});

		let deletedCode = await model.removeAuthCode(code).then( (code, err) => {
			if (err) { throw err}
			if (!code) { throw new Error('Could Not Find Auth Code'); }
			return code;
		}).catch(error => {
			throw error;
		});

		console.log('Finished Creating Token!');

		res.status(200).json({access_token: token}).end();

	} catch (err) {
		console.log(err);
		res.status(500).json({err: err.message}).end();
	}
});

app.post('/verify-token', (req, res) => {
	const token = req.body.token;
	const client_id = req.body.client_id;
	const user_id = req.body.user_id;
	const client_secret = req.body.client_secret;
	const scope_request = req.body.scope_request;

	model.verifyToken(client_id, client_secret, user_id, token).exec().then(result => {
		if (result !== null) {
			console.log(result);
			if (result.scope.includes(scope_request)) {
				res.status(200).json({ success: true }).end();
			} else {
				res.status(400).json({ success: false, msg: "You do not have permission to perform that action." }).end();
			}
		};
		res.status(400).json({ success: false, msg: 'Token not found' }).end();
	})
});

app.post('/session', (req, res) => {
	const token = req.body.token;
	try {
		jwt.verify(token, 'todo-app-super-shared-secret');
		res.status(200).json({ success: true, err_message: '', err: '' }).end();
	} catch (err) {
		res.status(400).json({ success: false, err_message: 'JWT token has expired', err: err }).end();
	}
})

app.delete('/authorized/:client', async (req, res) => {
	const client = req.params.client;
	const token = req.header('Authorization');

	try {
		jwt.verify(token, 'todo-app-super-shared-secret');
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

app.get('/authorized', (req, res) => {
	model.getAuthorizedApps().exec().then(result => {
		res.status(200).json(result).end();
	})
});

app.listen(3000);
