var http = require("http");

var cb = function (req, res) { // req -> request object; res -> response object
	   res.writeHead(200, {'Content-Type': 'text/plain'}); // send response header
	   res.end("hello world"); // send response body
	}

var server = http.createServer( cb ); // create an http server


server.listen(1234, "68.2.208.233");
console.log("Server running at: "+ "http://68.2.208.233:1234");

