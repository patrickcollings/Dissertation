'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    rp = require('request-promise');

const model = require('./model');

var app = express();
app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var mongoUri = 'mongodb://localhost/pod';

// Connect to the pod database
mongoose.connect(mongoUri, {
    useCreateIndex: true,
    useNewUrlParser: true
}, function (err, res) {

    if (err) {
        return console.error('Error connecting to "%s":', mongoUri, err);
    }
    console.log('Connected successfully to "%s"', mongoUri);
});

/**
 * Validates an access token through the Auth Service.
 * This validation will also ensure that the requested scope matches the access tokens permissions.
 * 
 * @param {*} token 
 * @param {*} scope_request 
 * @param {*} callback 
 */
function validateToken(token, scope_request, callback) {
    // Setup options for http request
    var options = {
        method: 'POST',
        uri: 'http://localhost:3000/verify-token',
        body: {
            token,
            scope_request
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            // POST succeeded...
            if (parsedBody.success) {
                return callback(null, true);
            } else {
                console.log(parsedBody);
                return callback(parsedBody.err, null);
            }
        })
        .catch(function (err) {
            // POST failed...
            console.log(err.response.body);
            return callback(err.response.body, null);
        });
}

/**
 * Returns a list of all health data. No auth checks are used for this end-point as it will be 
 * used for the demonstration temporarily.
 */
app.get('/health', async (req, res) => {
    model.getAllData('health').exec().then(result => {
        if (res) { res.status(200).send(result).end() }
        res.status(404).json({msg: 'Could not find collection'});
    })
});

/**
 * Returns a value from a specific collection.
 * Requires a valid token to be passed with the request.
 */
app.get('/:collection/:key', async (req, res) => {
    console.log(req.body.key);
    console.log(req.params.scope);
    const key = req.params.key;
    const token = req.header('Authorization');
    const collection = req.params.collection;
    // Create the scope value that the request requires. This will be checked against the permissions of the access token by the auth service.
    const scope = collection + '-read';
    console.log(token);

    await validateToken(token, scope, async (err, result) => {
        if (!err) {
            console.log(result);
            // Get key-value pair and return
            model.getPair(key, collection).exec().then(pair => {
                if (pair) { res.status(200).send(pair).end() }
                res.status(404).json({ msg: 'Resource does not exist' }).end();
            });
        } else {
            res.status(403).json(err).end();
        }
    })
});

/**
 * Add a list of values to a specific collection.
 * Requires a valid token to be passed with the request.
 */
app.post('/:collection', async (req, res) => {
    console.log(req.body);
    console.log(req.header('Authorization'));
    // Get value pair
    const pair = req.body;
    // Check that users token is valid - should return available scopes for user
    const token = req.header('Authorization');
    // If valid then check scopes against endpoint requested - check using authentication server whether users scope matches
    const collection = req.params.collection;
    // Create the scope value that the request requires. This will be checked against the permissions of the access token by the auth service.
    const scope = collection + '-write';
    await validateToken(token, scope, async (err, result) => {
        if (!err) {
            console.log(result);
            // Once user validated and scopes checked then save the value(s) to the pod using the scope as the collection to save to
            await model.savePair(pair, collection);
            res.status(200).json({ success: true, pair}).end();
        } else {
            res.status(400).json({ err }).end();
        }
    });
});

/**
 * Remove a value from a collection by key.
 * Requires a valid access token to be passed with the request.
 */
app.delete('/:collection/:key', async (req, res) => {
    // Get value pair
    // Check that users token is valid - should return available scopes for user
    const token = req.header('Authorization');
    // If valid then check scopes against endpoint requested - check using authentication server whether users scope matches
    const collection = req.params.collection;
    const key = req.params.key;
    // Create the scope value that the request requires. This will be checked against the permissions of the access token by the auth service.
    const scope = collection + '-delete';

    await validateToken(token, scope, async (err, result) => {
        if (!err) {
            console.log(result);
            // Delete key-value pair.
            model.deletePair(key, collection).exec().then(result => {
                if (result.ok === 1) {
                    // If no documents deleted then resource not found
                    if (result.deletedCount === 0) {
                        res.status(404).send({ msg: 'Resource does not exist', result: result }).end();
                    }
                    // Return result
                    res.status(200).send({ msg: 'Successfully deleted', result: result }).end();
                } else {
                    res.status(500).json({ result, msg: 'Could not delete' }).end();
                }
            });
        } else {
            res.status(403).json(err).end();
        }
    });
});

app.listen(3002);
