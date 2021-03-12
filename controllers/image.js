const Clarifai = require('clarifai');

// This is my own api key
const app = new Clarifai.App({
    apiKey: 'de0373b3e78b45f88765b4a36ec18e4b'
});

const handleApiCall = (req, res) => [
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('Unable to work with your API'))
]

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id', '=', id) // where the id equals to the id that we received in the body
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
          res.json(entries[0]);
      })
      .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}