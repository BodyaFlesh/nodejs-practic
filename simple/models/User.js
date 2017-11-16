const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema

const UserSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

mongoose.model('user', UserSchema);