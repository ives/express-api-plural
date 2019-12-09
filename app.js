const express = require('express');

// Elegant mongodb object modeling for node.js
const mongoose = require('mongoose');

const app = express();
// because db created with import: 'mongo bookAPI < booksJson.js' :
const db = mongoose.connect('mongodb://localhost/bookAPI');
const bookRouter = express.Router();
const port = process.env.PORT || 3000; // will pass in later from nodemon in package.json

// book model

const Book = require('./models/bookModel');

bookRouter.route('/books')
  .get((req, res) => {
    const query = {};
    query.genre = req.query.genre || '';

    // Look in Book API database, Book collection
    Book.find(query, (err, books) => {
      if (err) {
        // handle error
        // return to avoid two returns
        return res.send(err);
      }
      // else send JSON
      return res.json(books);
    });
  });

bookRouter.route('/books/:bookId')
  .get((req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.listen(port, () => {
  console.log(`Port is ${port}`);
});
