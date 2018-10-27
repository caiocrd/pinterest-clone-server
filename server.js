require('dotenv').config();
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');


var cors = require('cors');



var app = express();
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

var port = process.env.PORT || 3000;

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});
  

app.listen(port, function () {
console.log('Node.js listening ...');
});