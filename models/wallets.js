const fs = require('fs');
const LINQ = require('node-linq').LINQ;
const Forexs = require('./forex').Forexs;

const dbf = './data/wallets.json';

class Wallet 
{	
	constructor(wallet)
	{
		this.wallet_id = wallet.wallet_id;
		this.user_id = wallet.user_id;
		this.balances = wallet.balances;
	}

	/* display total balance in other currency */	
	balanceIn(currency) {
		let total = 0;
		for (var i=0; i<Object.keys(this.balances).length; i++) {
			var curr = Object.keys(this.balances)[i];

			if (currency == curr)
				total += (this.balances[curr].amt * 1);
			else {
				var forex = Forexs[0][currency + curr];
				if (forex) {
					total += (this.balances[curr].amt * forex.rate);
				}
			}
		}
		return total;
	}

}

function Update(wallet) {
	try {
 		let rawdata = fs.readFileSync(dbf, 'utf-8');
		if (rawdata)
			var data = JSON.parse(rawdata);
    else
    	return JSON.parse('[{}]');

		/* search and replace */
		for (var i=0; i<data.length; i++) {
			if (data[i].user_id == wallet.user_id) {
				data[i] = wallet;
				break;
			}
		}

    fs.writeFileSync(dbf, JSON.stringify(data, null, 4));
	} catch (err) {
 		console.error(err);
		return null;
 	}
 	return wallet;
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
module.exports.Wallet = Wallet;
module.exports.Update = Update;
