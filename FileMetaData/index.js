var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config();

var app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Multer configuration
var storage = multer.memoryStorage(); // Store files in memory
var upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Homepage route
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// File upload route
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  });
});

// Start the server
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
