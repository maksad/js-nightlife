'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bar = new Schema({
  id: String,
  visitors: [String]
});

module.exports = mongoose.model('Bar', Bar);
