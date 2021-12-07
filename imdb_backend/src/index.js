const express = require('express')
const app = express();
const cors = require('cors');
const port = 8000;
const { Pool } = require('pg');

const pool = new Pool({
  host: 'codd.mines.edu',
  database: 'csci403',
  user: 'jarodclark',
  password: 'Mines--1234',
  port: 5433,
});

app.use(cors());

app.get('/titles', (req, res) => {
  (async () => {
    try {
      const client = await pool.connect();
      const query = `SELECT DISTINCT(title) 
                     FROM titleAkas t JOIN titleRatings r ON (t.titleId = r.tconst)
                          JOIN titlePrincipals p ON (r.tconst = p.tconst)
                          JOIN titleBasics b ON (p.tconst = b.tconst)
                     WHERE region='US' and r.averageRating > '5.0' and p.category = 'director' and b.titletype = 'movie';`
      const data = await client.query(query);

      res.send(data.rows)

    } catch (err) {
      console.error(err);
    }
  })();
})

app.get('/actors', (req, res) => {
  let movieTitle = req.query[0];
  (async () => {
    try {
      const client = await pool.connect();
      const query = `SELECT DISTINCT(n.primaryname)
                     FROM titleAkas t JOIN titleCrew c ON (t.titleid = c.tconst)
                          JOIN titlePrincipals p ON (c.tconst = p.tconst)
                          JOIN nameBasics n ON (p.nconst = n.nconst)
                     WHERE t.title = $1;`
      const data = await client.query(query, [movieTitle]);

      res.send(data.rows)

    } catch (err) {
      console.error(err);
    }
  })();
})
app.get('/rating', (req, res) => {
  let movieTitle = req.query[0];
  (async () => {
    try {
      const client = await pool.connect();
      const query = `SELECT DISTINCT(r.averagerating)
                     FROM titleAkas t JOIN titleRatings r ON (t.titleid = r.tconst)
                     WHERE t.title = $1;`
      const data = await client.query(query, [movieTitle]);

      if (data.rows.length !== 0) {
        res.send(data.rows[0].averagerating)
      }
      else {
        res.send('Bad Request');
      }

    } catch (err) {
      console.error(err);
    }
  })();
})

app.get('/genre', (req, res) => {

  let movieTitle = req.query[0];
  (async () => {
    try {
      const client = await pool.connect();
      const query = `SELECT DISTINCT(b.genres)
                     FROM titleAkas t JOIN titleBasics b ON (t.titleid = b.tconst)
                     WHERE t.title = $1 and b.titletype = 'movie';`
      const data = await client.query(query, [movieTitle]);

      if (data.rows.length !== 0) {
        res.send(data.rows[0].genres)
      }
      else {
        res.send('Bad Request');
      }

    } catch (err) {
      console.error(err);
    }
  })();
})

app.get('/', (req, res) => {
  res.send('IMDB DataBase')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  if (process.send) {
    process.send('online');
  }
});
