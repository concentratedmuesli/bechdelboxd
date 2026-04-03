const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'pass',
  port: 5432,
});

async function addNewMovie(id, imdbid, rating, title, year) {
  try {
    await pool.connect();
    await pool.query(
      'INSERT INTO Films(id, imdbid, rating, title, year) VALUES($1, $2, $3, $4, $5)',
      [id, imdbid, rating, title, year],
    );
    console.log('Film inserted successfully');
  } catch (err) {
    console.error('Error inserting film:', err);
  } finally {
    await pool.end();
  }
}

addNewMovie(12006, '24950660', 3, "Eternity", 2025);
