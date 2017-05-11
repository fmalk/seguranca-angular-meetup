const cluster = require('cluster');

if (cluster.isMaster) {
	// Fork workers.
    const numCPUs = require('os').cpus().length;
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
} else {
	// Workers can share any TCP connection
	// In this case it is an HTTP server
    const app = require('./app.js');
}