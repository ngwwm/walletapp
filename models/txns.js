const fs = require('fs');
const LINQ = require('node-linq').LINQ;
const Forexs = require('./forex').Forexs;

const dbf = './data/txns.json';

/* Transaction Class */
class Txn 
{	
	constructor(txn)
	{
		this.txn_id = txn.txn_id;
		this.user_id = txn.user_id;
		this.amount = txn.amount;
		this.currency = txn.currency;
		this.type = txn.type;
		this.timestamp = txn.timestamp;
		this.txnuser_id = txn.txnuser_id;
	}

	/* function to display balance in other currency */	
	balanceIn(currency) {
		let forex = Forexs[0][currency + this.currency];
		if (forex)
			return (this.balance * forex.rate);
		else
			return null;
	}
}

/* add a transaction to the database file */
function Add(txn) {
	{
		let rawdata = fs.readFileSync(dbf, 'utf-8');
		if (rawdata)
			var data = JSON.parse(rawdata);
		else
			var data = JSON.parse('[{}]');
		

		/* get the next id */
		let max_id = new LINQ(data)
										.Select(m => m.txn_id)
										.Max();

		if (max_id) {
			txn.txn_id = max_id + 1;
 	 		data.push(txn); 
		} else {
			txn.txn_id = 1;
			data = [txn];
		}

		try {
			fs.writeFileSync(dbf, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error(err);
    }

		return txn;
	}
}

/* load data from database file */
function model() {
	let rawdata = fs.readFileSync(dbf, 'utf-8');
	if (rawdata) {
		return new LINQ(JSON.parse(rawdata));
	} else
		return new LINQ(JSON.parse('[{}]'));
}


/* module exports */
module.exports.model = model;
module.exports.Txn = Txn;
module.exports.Add = Add;

