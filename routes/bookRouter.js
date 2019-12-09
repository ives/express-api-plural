/* eslint-disable no-param-reassign */
const express = require('express');
const booksController = require('../controllers/booksController');

function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);

  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);

  // Use middleware just for this route
  // For repetitive stuff
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      // add that Book ID to the request obj
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      returnBook.links = {};
      returnBook.links.FilterByThisGebre = `http://${req.headers.host}/api/books/?genre=${req.book.genre}`;
      res.json(returnBook);
    })
    /*
      Book.findById(req.params.bookId, (err, book) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      })
    }) */

    // replace entire item
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      // saving is async:
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
      return res.json(book);
    })

    // partial replace / update
    .patch((req, res) => {
      const { book } = req;
      // eslint-disable-next-line no-underscore-dangle
      if (req.body._id) {
        // eslint-disable-next-line no-underscore-dangle
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        console.log('ITEM', item);
        console.log('book 2', book);
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      // saving is async:
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })

    .delete((req, res) => {
      req.book.deleteOne((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
