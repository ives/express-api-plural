function booksController(Book) {
  function post(req, res) {
    // req.body containing JSON added as payload
    // is available thanks to body-parser
    const book = new Book(req.body); // create new Mongoose book obj
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    book.save();
    res.status(201);
    return res.json(book);
  }

  function get(req, res) {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre || '';
    }

    // Look in Book API database, Book collection
    Book.find(query, (err, books) => {
      if (err) {
        // handle error
        // return to avoid two returns
        return res.send(err);
      }

      // Hypermedia
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      })
      // else send JSON
      return res.json(returnBooks);
    });
  }
  return { post, get };
}

module.exports = booksController;