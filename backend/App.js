const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');
const Parser = require('rss-parser');

console.log('Starting Bechdelboxd backend');

let ssl = null;

if (process.env.DB_HOST.includes('aiven')) {
  ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./aiven/ca.pem').toString(),
  };
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: ssl,
});

async function checkConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Connected to', process.env.DB_HOST);
  } catch (err) {
    console.error('Connection to database failed:', err.message);
    process.exit(1);
  }
}

checkConnection();

app.use(cors());
app.use(express.json());

const parser = new Parser();

const proxies = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
];

async function fetchRSSFeed(url) {
  try {
    console.log(`Attempting direct fetch: ${url}`);
    const response = await fetch(url, {
      timeout: 5000,
      headers: { 'User-Agent': 'RSS Reader App' },
    });

    if (response.ok) {
      console.log('direct fetch worked');
      const data = await response.text();
      const feed = await parser.parseString(data);
      // console.log(data);
      return { success: true, data };
    } else if (response.status === 404) {
      return { success: false, reason: 404 };
    }
  } catch (error) {
    console.log(`Direct fetch failed: ${error.message}`);
  }

  let response;
  for (const proxy of proxies) {
    try {
      console.log(`Trying proxy: ${proxy}${url}`);
      response = await fetch(proxy + encodeURIComponent(url), {
        timeout: 10000,
      });

      if (response.ok) {
        const data = await response.text();
        const feed = await parser.parseString(data);
        return { success: true, data };
      } else if (response.status === 404) {
        return { success: false, reason: 404 };
      }
    } catch (error) {
      console.log(`Proxy failed (${proxy}): ${error.message}`);
      continue;
    }
  }

  return {
    success: false,
    error: 'All fetch attempts failed',
    reason: response.status,
  };
}

app.get('/rss-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  try {
    const response = await fetchRSSFeed(url);
    if (response.success) {
      res.type('application/xml');
      res.send(response.data);
    } else if (response.reason === 404) {
      res.status(404).json({});
    } else {
      res.status(500).json({ error: res.error });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const allMovies = await pool.query('SELECT * FROM Films f');
    res.status(200).send(allMovies.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
