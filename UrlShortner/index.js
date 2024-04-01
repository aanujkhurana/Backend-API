const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Initialize an array to store URLs and their corresponding short URLs
const urlDatabase = [];
let currentId = 1;

// Function to validate URL format
function isValidUrl(url) {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

// Function to verify URL using DNS lookup
function verifyUrl(url, callback) {
  const urlParts = url.split('//')[1];
  dns.lookup(urlParts, (err) => {
    callback(err === null);
  });
}

// API endpoint for URL shortening
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Validate URL format
  if (!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Verify URL using DNS lookup
  verifyUrl(url, (isValid) => {
    if (!isValid) {
      return res.json({ error: 'invalid url' });
    }

    // Generate short URL and save the mapping
    const shortUrl = currentId++;
    urlDatabase.push({ original_url: url, short_url: shortUrl });

    res.json({ original_url: url, short_url: shortUrl });
  });
});

// Redirect route for short URLs
app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const entry = urlDatabase.find((item) => item.short_url == short_url);
  if (!entry) {
    return res.json({ error: 'invalid short url' });
  }
  res.redirect(entry.original_url);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
