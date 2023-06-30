const handleLogin = (req, res, db, cryptoJS) => {
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
}

module.exports = {
  handleLogin: handleLogin
}