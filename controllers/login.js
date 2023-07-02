const handleLogin = (req, res, db, cryptoJS) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Invalid form submission");
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = JSON.stringify(cryptoJS.SHA256(password).words) === data[0].hash;
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
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
  handleLogin
}