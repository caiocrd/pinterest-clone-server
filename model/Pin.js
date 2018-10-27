var mongo = require('mongodb');
var mongoose = require('mongoose');

const { Schema } = mongoose;
const PinSchema = new Schema({user_id: String, description: String, image_link: String});
mongoose.model('pin', PinSchema);