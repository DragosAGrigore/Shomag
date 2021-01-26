const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 4101;

app.get('/', (req, res) => {
  res.json({'shomag-search': 'version 1.0.0'});
});

app.get('/products', (req, response) => {
  if (req.body.searchQuery == null) {
    response.json([]);
  }

  request.get(`https://api.spoonacular.com/food/products/search?query=${req.body.searchQuery}&apiKey=bf52b3a280954eb5a129e988ef3e57e1`, { json: true }, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    response.json(body.products);
  });
});

app.listen(port, () => {
  console.log(`Shomag Search is listening at http://localhost:${port}`);
});