'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    rp = require('request-promise');

// const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
// const utils = require('./utils/');

var app = express();
const model = require('./model.js');
app.use(cors({ origin: 'http://localhost:4200' }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var mongoUri = 'mongodb://localhost/third-party';

mongoose.connect(mongoUri, {
    useCreateIndex: true,
    useNewUrlParser: true
}, function (err, res) {

    if (err) {
        return console.error('Error connecting to "%s":', mongoUri, err);
    }
    console.log('Connected successfully to "%s"', mongoUri);
    model.dump();
});

app.post('/accesstoken', (req, res) => {
    const code = req.body.code;
    const scope = req.body.scope;
    // const code = req.body.code;
    const redirect_uri = 'http://localhost:4200/callback';
    const client_id = 'application';
    const client_secret = 'secret';

    var options = {
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
