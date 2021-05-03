const _ = require('lodash');
const bodyParser = require('body-parser');

const config = require('./config');
const express = require('express');
const app = express() 

/* disable caching */
app.disable('etag');

global.__root     = __dirname + '/'; 
global.__config   = config; 

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Access-Token');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
};

//app.use(allowCrossDomain);	

app.use(bodyParser.json());	// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));	// for parsing application/x-www-form-urlencoded


/* handle any request thats ends in /api/v1/wallet */
var WalletController = require(__root + 'controllers/WalletController');
app.use('/api/v1/wallet', WalletController);

/*
var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'Controllers/AuthController');
app.use('/api/auth', AuthController);
*/

module.exports = app;
