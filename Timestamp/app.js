// app.js

const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Homepage route
app.get('/', (req, res) => {
  res.send('Welcome to the Timestamp Microservice! Please provide a date string in the URL.');
});

// Date route
app.get('/api/timestamp/:date_string?', (req, res) => {
  const dateString = req.params.date_string || Date.now().toString();
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    res.json({ error: 'Invalid Date' });
  } else {
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
