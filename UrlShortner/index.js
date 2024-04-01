const express = require('express');

const cors = require('cors');
const dns = require('dns');


const app = express();
const port = 3000;

app.use(cors());

// Body parsing middleware to handle POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//  API endpoint
// Initialize an array to store URLs and their corresponding short URLs
const urlDatabase = [];
let currentId = 1;

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Parse the URL to extract the hostname
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  // Verify the hostname using dns.lookup()
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'Invalid URL' }); // Respond with an error if the hostname does not resolve
    }
    // Generate short URL and save the mapping
    const shortUrl = currentId++;
    urlDatabase.push({ original_url: url, short_url: shortUrl });

    res.json({ original_url: url, short_url: shortUrl }); // Placeholder response
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
