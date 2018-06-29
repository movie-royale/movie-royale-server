

'use strict';

// Application  Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application Setup

const app = express();
const PORT = process.env.PORT;

// Database Setup

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Add this to the server terminal: 

// FOR Paul and Brandon (i think):
// export DATABASE_URL=postgres://localhost:5432/movie_royale

// FOR Chi and Amanda (i think):
// export DATABASE_URL=postgres://postgres:1234@localhost:5432/movie_royale





// ignore the below. This is where I built our tables:
// ======================
// CREATE TABLE users(
// users_id SERIAL PRIMARY KEY,
// username varchar (255),
// password varchar (255),
// email varchar (255),
// UNIQUE (username, email)
// );

// CREATE TABLE movies(
// movies_id SERIAL PRIMARY KEY,
// title varchar (255),
// release_date varchar (255),
// description text,
// poster_path varchar (255),
// user_number varchar (255),
// UNIQUE (poster_path, description)
// );
// 
// INSERT INTO users (username, password, email) VALUES ('paulsuarez', 'movieroyale', 'paulsblogging.com@gmail.com');
// 
// ======================


const client = new pg.Client(process.env.DATABASE_URL);


client.connect();
client.on('error', err => console.log(err));

// Application Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API Endpoints

// This .get pulls all the users from our user database
app.get('/api/v1/users', (req, res) => {
    console.log('One small step for man. One giant step for computer-kind (handling a GET request by a client for users)')
    let SQL = `SELECT * FROM users;`;
    client.query(SQL)
        .then(results => res.send(results.rows))
        .catch(console.error);
});

// this .get pulls all the movies from our user database
app.get('/api/v1/movies', (req, res) => {
    console.log('One small step for man. One giant step for computer-kind (handling a GET request by a client for movies)')
    let SQL = `SELECT * FROM movies;`;
    client.query(SQL)
        .then(results => res.send(results.rows))
        .catch(console.error);
});

// this .post adds a new user to our user database
app.post('/api/v1/users', (req, res) => {
    // console.log(req.body);
    let SQL = `INSERT INTO users(username, password, email)
    VALUES ($1, $2, $3);`;

    let values = [
        req.body.username,
        req.body.password,
        req.body.email
    ];

    client.query(SQL, values)
        .then(() => {
            let SQL = `SELECT users_id FROM users WHERE username=$1;`;
            let values = [req.body.username];
            client.query(SQL, values,
                function (err, result) {
                    if (err) console.error(err);
                    console.log(result);
                    res.send(result.rows[0]);
            })
                
        
        
        })

        // res.send('inserted new user into users table completed')

        .catch(function (err) {
            console.error(err);
        })
});

// this .post adds a new movie to our movies data base. 
// we'll need to pull this information off a form when the user tries to add a movie for the first time.
// this forum will somehow populate from the api.
// once the user confirms that, that's the movie they wanted, they can added it and it'll post the this table:
app.post('/api/v1/movies', (req, res) => {
    let SQL = `INSERT INTO movies(title, release_date, description, poster_path, user_number)
    VALUES ($1, $2, $3, $4, $5);`;

    // console.log(req);

    let values = [
        req.body.title,
        req.body.release_date,
        req.body.description,
        req.body.poster_path,
        req.body.user_number
    ];


    client.query(SQL, values)
        .then(function () {
            res.send('inserted new movie into movies table completed')
        })
        .catch(function (err) {
            console.error(err);
        })
});

// this returns a single, specific user from the users database
app.get('/api/v1/users/:id', (req, res) => {

    let SQL = `
        SELECT * FROM users WHERE users_id= ${req.params.id};
        `;

    client.query(SQL)

        .then(results => res.send(results.rows))
        .catch(console.error);
});

// this returns a single, specific movie from the movies database
app.get('/api/v1/movies/:id', (req, res) => {

    let SQL = `
        SELECT * FROM movies WHERE movies_id= ${req.params.id};
        `;

    client.query(SQL)

        .then(results => res.send(results.rows))
        .catch(console.error);
});

// this deletes a single, specific user from the users database
app.delete('/api/v1/users/:id', (req, res) => {

    let SQL = `
        DELETE FROM users WHERE users_id= ${req.params.id};
        `;

    client.query(SQL)

        .then(results => res.send(results.rows))
        .catch(console.error);
});

// this deletes a single, specific movie from the movies database
app.delete('/api/v1/movies/:id', (req, res) => {

    let SQL = `
        DELETE FROM movies WHERE movies_id= ${req.params.id};
        `;

    client.query(SQL)

        .then(results => res.send(results.rows))
        .catch(console.error);
});

app.get('*', (req, res) => res.status(404).send(`<h1>rip scrub</h1>`));

app.listen(PORT, () => console.log(`The server is alive ITS ALIVE. It is listening on port: ${PORT}`));