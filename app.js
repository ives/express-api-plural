const express = require('express');

// Elegant mongodb object modeling for node.js
const mongoose = require('mongoose');

const app = express();
// because db created with import: 'mongo bookAPI < booksJson.js' :
const db = mongoose.connect('mongodb://localhost/bookAPI');
// Middleware to add the body to the Request:
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000; // will pass in later from nodemon in package.json

// book model

const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book); // passing the model

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.listen(port, () => {
  console.log(`Port is ${port}`);
});
