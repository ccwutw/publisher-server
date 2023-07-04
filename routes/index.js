var express = require('express');
var router = express.Router();
// include axios
const axios = require('axios');
const path = require('path');

const isbns = [];

router.get('/books', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

router.get('/books/new', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'new.html'));
})

router.get('/books/detail', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'detail.html'));
})


// POST /books
router.post('/api/books', function (req, res) {
  const isbn = req.body;
  isbns.push(isbn);
  res.json(isbns);
});

// GET /books
router.get('/api/books', function (req, res) {
  res.json(isbns);
})

// GET /books/:isbn
router.get('/api/books/:isbn', function(req, res, next) {
  const isbn = req.params.isbn;
  axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn)
  .then(function (elResultado) {
    
    const data = elResultado.data;
    if (data.totalItems > 0 ){
      
    const book = {
      title: data.items[0].volumeInfo.title,
      subtitle: data.items[0].volumeInfo.subtitle,
      description: data.items[0].volumeInfo.description,
      authors: data.items[0].volumeInfo.authors,
      cover: data.items[0].volumeInfo.imageLinks.thumbnail,
      isbn: isbn
    }
    res.json(book);
  }
  else {
    res.json({
      error: 'no existe isbn'
    })
  }
  })
});

module.exports = router;