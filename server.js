'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3002;

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

const User = require('./models/User');

// const peter = new User({
//   email: 'peterjast@gmail.com',
//   books: [{name: 'The Life You Can Save', description: 'It\'s a book', status: 'definitely a book'}, {name: 'A Critique of Pure Reason', description: 'It\'s a book', status: 'definitely a book'}, {name: 'The Great Gatsby', description: 'It\'s a book', status: 'definitely a book'}]
// });
// peter.save();

// const chris = new User({
//   email: 'gantt.art@gmail.com',
//   books: [{name: 'The Alchemist', description: 'It\'s a book', status: 'definitely a book'}, {name: 'The Giver', description: 'It\'s a book', status: 'definitely a book'}, {name: 'Life of Pi', description: 'It\'s a book', status: 'definitely a book'}]
// });
// chris.save();

app.get('/books', getBooks);

app.post('/books', addABook);

app.delete('/books/:index', deleteABook);

function getBooks(request, response) {
  const email = request.query.email;
  console.log({email});
  User.find({email: email}, function (err, items) {
    if (err) return console.error(err);
    console.log(items[0].books);
    response.status(200).send(items[0].books);
  });
}

function addABook(request, response) {
  console.log('request body', request.body);
  const email = request.body.email;
  console.log(email);
  const book = { name: request.body.name, description: request.body.description, status: request.body.status};
  User.findOne({ email }, (err, entry) => {
    if(err) return console.log(err.message);
    entry.books.push(book);
    entry.save();
    response.status(200).send(entry.books);
  });
}

function deleteABook(request, response) {
  const index = parseInt(request.params.index);
  const email = request.query.email;
  User.findOne({ email }, (err, entry) => {
    if(err) return console.log(err.message);
    const newBookArr = entry.books.filter((book, i) => i !== index);
    entry.books = newBookArr;
    entry.save();
    response.status(200).send('Destroyed!');
  });
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
