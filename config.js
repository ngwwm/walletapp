module.exports = {
	server: {
		bindhost: '0.0.0.0',
		port: 15000,
		ssl_port: 15001
	},
  tls: {
  	key: './selfsigned.key',
  	cert: './selfsigned.crt'
	}
};
