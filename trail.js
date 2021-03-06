const _ = require('lodash');
const express = require('express');
const request = require("request");
const router = express.Router();

const fs = require('fs');
const moment = require('moment');

const LINQ = require('node-linq').LINQ;

const wallets = require('./models/wallets');
const forexs = require('./models/forex');

const Wallet = wallets.Wallet

var model = wallets.model()
		.Where(function(m) { return m.user_id === 1001; })
		.ToArray()[0];

console.log(model);

var m = new Wallet(model)
console.log('balance:', m.balanceIn('usd'));


const txns = require('./models/txns');
const Txn = txns.Txn;

var txn = new Txn({"user_id": 1001, "amount": 1, "currency": "hkd", "timestamp": "2021-05-01 11:11:11", "type": "d"}); 

console.log(txn);

console.log(forexs.Forexs[0]['usdhkd']);

console.log('_.now():', _.now());
