const getRankingsEntries = (req, res, db) => {
  db.select('name', 'entries', 'faces').from('users').orderBy('entries', 'desc')
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json("Failed to get rankings");
    })
}

const getRankingsFaces = (req, res, db) => {
  db.select('name', 'entries', 'faces').from('users').orderBy('faces', 'desc')
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json("Failed to get rankings");
    })
}

module.exports = {
  getRankingsEntries,
  getRankingsFaces
}