var mongo = require('mongodb');
var mongoose = require('mongoose');

const { Schema } = mongoose;
var UserShema = new Schema({login: String, password: String});
mongoose.model('user', UserShema);