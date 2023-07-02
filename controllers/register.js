const handleRegister = (req, res, db, cryptoJS) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("Invalid form submission");
  }

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

}

module.exports = {
  handleRegister
}