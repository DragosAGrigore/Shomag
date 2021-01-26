require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const Product = require('./model/Product');

const app = express();
app.use(bodyParser.json());

const port = 4102;

mongoose
  .connect('mongodb://mongo:27017/shomag-app', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.json({'shomag-cart': 'version 1.0.0'});
});

app.get('/cart', authenticateToken, (req, res) => {
  const filter = {
    user: req.user.username
  };

  Product.find(filter)
    .then(products => res.json(products))
    .catch(err => res.status(404).json({ msg: 'No products have been found!' }));
});

app.post('/cart', authenticateToken, (req, res) => {
  const newProduct = new Product({
      user: req.user.username,
      title: req.body.title,
      image: req.body.image,
    }
  );

  newProduct.save(() => {
    res.json(newProduct)
  });
});

app.delete('/cart/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  console.log(id);
  Product.deleteOne({_id: id})
    .then(deleteResponse => res.json(deleteResponse))
});

// JWT
function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const regex = /Bearer [a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/;
  const jwtHeader = req.headers.authorization.match(regex);

  if (jwtHeader == null) {
    return res.sendStatus(401);
  }

  const token = jwtHeader[0].split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    req.jwt = token;
    next();
  });
}

app.listen(port, () => {
  console.log(`Shomag cart is up and running, listening at http://localhost:${port}`);
});