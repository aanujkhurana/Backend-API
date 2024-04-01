// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// API endpoint for request header parsing
app.get('/api/whoami', function (req, res) {
  const ipaddress = req.ip; // Get user's IP address from request headers
  const language = req.headers['accept-language']; // Get preferred language from request headers
  const software = req.headers['user-agent']; // Get user's software from request headers
  
  res.json({ ipaddress, language, software });
});

// listen for requests :)
var listener = app.listen( 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
