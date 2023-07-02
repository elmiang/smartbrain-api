const express = require('express');
const cors = require('cors');
const cryptoJS = require('crypto-js');
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'password',
    database : 'smartbrain'
  }
});

const PORT = 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { login.handleLogin(req, res, db, cryptoJS) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, cryptoJS) });

app.get('/profile/:id', (req, res) => { profile.fetchUser(req, res, db) });

app.put('/image', (req, res) => { image.incrementEntries(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiUse(req, res) });

app.listen(PORT, () => {
  console.log('app is running on port ' + PORT);
});