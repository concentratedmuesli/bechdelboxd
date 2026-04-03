const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'pass',
  port: 5432,
});

const movieData = fs.readFileSync('allMovies.json');
const movies = JSON.parse(movieData);

async function insertMovies() {
  try {
    await pool.connect();
    for (const movie of movies) {
      await pool.query(
        'INSERT INTO Films(id, imdbid, rating, title, year) VALUES($1, $2, $3, $4, $5)',
        [movie.id, movie.imdbid, movie.rating, movie.title, movie.year],
      );
    }
    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await pool.end();
  }
}

insertMovies();