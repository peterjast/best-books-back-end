'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {type: String},
  description: {type: String},
  stats: {type: String}
});

const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  books: [bookSchema]
});

const User = mongoose.model('Reader', userSchema);

module.exports = User;