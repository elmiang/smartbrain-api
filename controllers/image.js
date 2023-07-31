const MODEL_ID = 'face-detection';   

const returnClarifaiRequestOptions = (inputLink) => {
  const PAT = '15be52e14b484b9db71bda8b6f070bee';
  const USER_ID = 'elmiang';       
  const APP_ID = 'smartbrain';
  const IMAGE_URL = inputLink;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
}

const handleApiUse = (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(req.body.input))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    else {
      res.status(400).json("Image invalid");
    }
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => res.status(400).json("Failed to use API"));
}

const incrementEntries = (req, res, db) => {
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
}

const incrementFaces = (req, res, db) => {
  const { id, faces } = req.body;
  db('users').where({
    id: id
  })
  .increment('entries', faces)
  .returning('entries')
  .then(entries => {
    res.json(faces[0].faces);
  })
  .catch(err => res.status(400).json("Unable to get faces"));
}

module.exports = {
  incrementEntries,
  incrementFaces,
  handleApiUse
}