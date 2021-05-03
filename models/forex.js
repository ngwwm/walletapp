const fs = require('fs');

class Forex 
{	
	constructor(base, quote, rate)
	{
		this.base  = base;	/* base currency */
		this.quote = quote;	/* quote currency */
		this.rate  = rate;	/* exchange rate */

	}

}

let rawdata = fs.readFileSync('./data/forexs.json');
let Forexs = JSON.parse(rawdata);

exports.Forexs = Forexs;
