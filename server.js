var app   = require('./app');
var fs    = require('fs');
var http  = require('http');
var https = require('https');

const hostname = global.__config.server.bindhost;
const port     = global.__config.server.port;
const ssl_port = global.__config.server.ssl_port;

const options = {
  key: fs.readFileSync(global.__config.tls.key),
  cert: fs.readFileSync(global.__config.tls.cert)
};

https.createServer(options, app).listen(ssl_port, hostname, function() {
  console.log(`\nServer running at https://${hostname}:${ssl_port}`);
});

http.createServer(app).listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}`);

	console.log(`\n\nEndpoint Examples:\n
Check Balance:\n
  curl -X GET -sk http://${hostname}:${port}/api/v1/wallet/balance \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001}' | jpp

Transaction History:\n
  curl -X GET -sk http://${hostname}:${port}/api/v1/wallet/txn \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001}' | jpp

Deposit:\n
  curl -X POST -sk http://${hostname}:${port}/api/v1/wallet/deposit \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001, "amount":10, "currency": "hkd"}' | jpp

Withdraw:\n
  curl -X POST -sk http://${hostname}:${port}/api/v1/wallet/withdraw \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001, "amount":10, "currency": "hkd"}' | jpp

Transfer:\n
  curl -X POST -sk http://${hostname}:${port}/api/v1/wallet/transfer \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001, "amount":10, "currency": "hkd", "touser_id": 1002}' | jpp

Convert:\n
  curl -X POST -sk http://${hostname}:${port}/api/v1/wallet/convert \\
    -H 'Content-Type: application/json' \\
    --data '{"user_id":1001, "amount":10, "base_currency": "usd", "quote_currency": "hkd"}' | jpp

Enjoy!
`
	);
});
