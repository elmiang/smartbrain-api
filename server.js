const express = require('express');
const cors = require('cors');
const cryptoJS = require('crypto-js');
const knex = require('knex')

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

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = JSON.stringify(cryptoJS.SHA256(req.body.password).words) === data[0].hash;
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json("Unable to get user"))
      } else {
        res.status(400).json("Invalid Credentials");
      }
    })
    .catch(err => {
      res.status(400).json("Login failed");
    })
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = JSON.stringify(cryptoJS.SHA256(password).words);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Registration failed'));

});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db.select().from('users').where({
    id: id
  })
    .then(user => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(400).json("User not found");
      }
      
    })
    .catch(err => {
      res.status(400).json("Error getting user");
    })
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where({
    id: id
  })
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json("Unable to get entries"));
});

app.listen(PORT, () => {
  console.log('app is running on port ' + PORT);
});