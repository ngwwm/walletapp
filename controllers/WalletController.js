const fs = require('fs');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Forexs = require('../models/forex').Forexs;

/* models */
const _txn = require('../models/txns.js');
const _wallet = require('../models/wallets.js');

const Txn = _txn.Txn;					/* Transaction Class */
const Wallet = _wallet.Wallet; /* Wallet Class */

const config = global.__config;

let access_token;

/* check balance api */
router.get('/balance', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/balance" request received, params', req.query);

  const user_id = req.query.user_id;
  const period_fm = req.query.period_fm;
  const period_to = req.query.period_to;


  res.set('Content-Type', 'application/json');

	let data = _wallet.model()
						.Where(function(m) { return m.user_id == user_id; })
						.ToArray()[0];

  res.set('Content-Type', 'application/json');

	if (data)
  	res.status(200).send(data);
	else
  	res.status(404).send({error: "not found"});
});

/* list transactions api */
router.get('/txn', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/txn" request received, params', req.query);

  const user_id = req.query.user_id;
  const period_fm = req.query.period_fm;
  const period_to = req.query.period_to;
  const lastnrec = req.query.lastnrec;


  res.set('Content-Type', 'application/json');

	let data = _txn.model()
						.Where(function(m) { return m.user_id == user_id; })
						.OrderByDescending(function(m) { return m.timestamp })
						.ToArray();

	if (data)
		if (lastnrec)	
  			res.status(200).send(data.slice(0, Math.min(lastnrec, data.length)));
		else
  			res.status(200).send(data);
	else
  		res.status(404).send({error: "not found"});

});

/* deposit api */
router.post('/deposit', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/deposit" request received, params', req.body);

  const data = 	{
								 	type: "d", 
									user_id: req.body.user_id, 
									amount: req.body.amount, 
									currency: req.body.currency
								};

  res.set('Content-Type', 'application/json');
	
	depositHelper(data, function (result, err) {
		if (err)
  		res.status(400).send(err);
		else
  		res.status(200).send(result);
	});
});

/* withdraw api */
router.post('/withdraw', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/withdraw" request received, params', req.body);

  const data = 	{
								 	type: "w", 
									user_id: req.body.user_id, 
									amount: req.body.amount * -1, 
									currency: req.body.currency
								};

  res.set('Content-Type', 'application/json');

	depositHelper(data, function (result, err) {
		if (err)
  		res.status(400).send(err);
		else
  		res.status(200).send(result);
	});
});

/* transfer api */
router.post('/transfer', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/transfer" request received, params', req.body);

  const data = 	{
								 	type: "w", 
									user_id: req.body.user_id, 
									amount: req.body.amount * -1, 
									currency: req.body.currency
								};

  res.set('Content-Type', 'application/json');

	depositHelper(data, function (result, err) {
		if (err)
  		res.status(400).send(err);
		else {
			data.type = "d"; 
			data.user_id = req.body.touser_id;
			data.amount = data.amount * -1; 
			depositHelper(data, function (result, err) {
				if (err)
  				res.status(400).send(err);
			});
  		res.status(200).send(result);
		}
	});
});

/* convert currency api */
router.post('/convert', function (req, res) {	
	console.debug('[',moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),'] DEBUG: endpoint "/convert" request received, params', req.body);

  const data = 	{
								 	type: "w", 
									user_id: req.body.user_id, 
									amount: req.body.amount * -1, 
									currency: req.body.quote_currency
								};

  res.set('Content-Type', 'application/json');

	var forex = Forexs[0][req.body.base_currency + req.body.quote_currency];
	var amount = data.amount;

	/* withdraw the money in quote_currency */
	data.amount *= forex.rate;

	if (!forex)
		return res.status(400).send({err: "currency pair not available"});

	depositHelper(data, function (result, err) {
		if (err)
  		res.status(400).send(err);
		else {
			/* deposit the money in base_currency */
			data.type = "d"; 
			data.amount = amount * -1; 
			data.currency = req.body.base_currency; 
			depositHelper(data, function (result, err) {
				if (err)
  				res.status(400).send(err);
				else
  				res.status(200).send(result);
			});
		}
	});
});

function depositHelper(param, callback) { 
	/* create an object of class Txn */
  let txn = new Txn({	"user_id": param.user_id, "amount": param.amount, "currency": param.currency, "type": param.type, "timestamp": moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')});

	/* check and update the wallet balance */
	let data = _wallet.model()
						.Where(function(m) { return m.user_id === param.user_id; })
						.ToArray()[0];
	
	if (!data)
  	return callback({status: 404}, {err: "wallet not found"});
	
	/* update the balance of that currency */	
	if (data.balances[param.currency]) {
		data.balances[param.currency].amt += param.amount;
		/* for withdraw, we need to check balance */
		if (param.type == "w" && data.balances[param.currency].amt < 0) {
  		return callback({status: 400}, {err: "insufficient balance"});
		}
	} else {
		data.balances[param.currency] = {amt: param.amount};
	}

	/* insert the record */
  let txn_id = _txn.Add(txn);

	/* create an wallet object and update the balance */
	let wallet = new Wallet(data);
	let result = _wallet.Update(wallet);

	if (result)
		callback({status: 200, data: result});
	else
		callback({status: 400}, {err: "cannot update wallet"});
}

module.exports = router;
