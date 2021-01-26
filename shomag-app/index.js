require('dotenv').config();

const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./model/User');

const app = express();
app.use(bodyParser.json());

const port = 4100;

mongoose
  .connect('mongodb://mongo:27017/shomag-app', {useNewUrlParser: true})
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err));


app.get('/', authenticateToken, (req, res) => {
  res.json({'shomag-app': 'version 1.0.0'})
});

//Authentication
app.post('/register', (req, response) => {
  User.findOne({
    username: req.body.username,
  }).then(user => {
    if (user == null) {
      let salt = bcrypt.genSaltSync();
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({
          username: req.body.username,
          password: req.body.password
        }
      );
      newUser.save(response.json({ authToken: getToken(newUser) }));
    } else {
      response.status(400).json({msg: 'Username already exists!'});
    }
  })
});

app.post('/login', (req, response) => {
  User.findOne({
    username: req.body.username
  }).then(user => {
    if (!(user && bcrypt.compareSync(req.body.password, user.password))) {
      return response.status(400).json({ msg: 'Invalid credentials!' })
    }

    return response.json({ authToken: getToken(user) })
  })
});

// Products API
app.post('/products', authenticateToken, (req, response) => {
  request.get('http://shomag-search:4101/products', {json: req.body}, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    response.json(body);
  });
});


// Cart API
app.get('/cart', authenticateToken, (req, response) => {

  const options = {
    json: true,
    auth: {
      bearer: req.jwt
    }
  };

  request.get('http://shomag-cart:4102/cart', options, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    response.json(body);
  });
});

app.delete('/cart/:id', authenticateToken, (req, response) => {
  const id = req.params.id;
  const options = {
    json: true,
    auth: {
      bearer: req.jwt
    }
  };

  request.delete(`http://shomag-cart:4102/cart/${id}`, options, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    response.json(body);
  });
});

app.post('/cart', authenticateToken, (req, response) => {
  const options = {
    json: req.body,
    auth: {
      bearer: req.jwt
    }
  };

  request.post('http://shomag-cart:4102/cart', options, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    response.json(body);
  });
});

// JWT
function authenticateToken(req, response, next) {
  if (!req.headers.cookie) {
      return response.sendStatus(401);
  }

  const regex = /JWT=[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/;
  const jwtCookie = req.headers.cookie.match(regex);

  if (jwtCookie == null) {
    return response.sendStatus(401);
  }

  const token = jwtCookie[0].split('=')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return response.sendStatus(403);
    }
    req.user = user;
    req.jwt = token;
    next();
  });
}

function getToken(user) {
  return jwt.sign({username: user.username, passowrd: user.password}, process.env.ACCESS_TOKEN_SECRET);
}

app.listen(port, () => {
  console.log(`Shomag App is up and running, listening at http://localhost:${port}`);
});