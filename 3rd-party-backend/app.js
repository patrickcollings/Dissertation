'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    rp = require('request-promise');

const app = express();
// Allow cors access to third-party front-end
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Unique identifiers for the third-party
const client_secret = 'secret';
const client_id = 'application';
const redirect_uri = 'http://localhost:4200/callback';

/**
 * Exchanges an auth code for an access token from the auth service.
 * This has to be performed server side as a client secret is required.
 * Returns the new access token to the front-end.
 */
app.post('/accesstoken', (req, res) => {
    const code = req.body.code;
    const scope = req.body.scope;

    // Set up http request to the auth service to retrieve a new access token
    const options = {
        method: 'POST',
        uri: 'http://localhost:3000/token',
        body: {
            code,
            redirect_uri,
            client_id,
            client_secret,
            scope
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            // POST succeeded...
            res.status(200).json(parsedBody).end();
        })
        .catch(function (err) {
            // POST failed...
            res.status(400).json(err).end();
        });
});

app.listen(3001);
