require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Initialize an array to store URLs and their corresponding short URLs
const urlDatabase = {};

// Generate short URL using hashing algorithm
function generateShortUrl(url) {
  const hash = url.split('').reduce((acc, char) => (acc * 397) ^ char.charCodeAt(0), 0);
  return Math.abs(hash).toString(36);
}

// API endpoint for URL shortening
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Validate the URL domain
  const urlParts = originalUrl.split('//');
  dns.lookup(urlParts[1], (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Check if the URL already exists in the database
    if (urlDatabase[originalUrl]) {
      return res.json({ original_url: originalUrl, short_url: urlDatabase[originalUrl] });
    }

    // Generate short URL and save the mapping
    const shortUrl = generateShortUrl(originalUrl);
    urlDatabase[originalUrl] = shortUrl;

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// Redirect route for short URLs
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const foundEntry = Object.entries(urlDatabase).find(([_, value]) => value === shortUrl);
  if (foundEntry) {
    res.redirect(foundEntry[0]);
  } else {
    res.json({ error: 'invalid short url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
