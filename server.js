
require('dotenv').config();
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var parser = require('body-parser');

var Schema = mongoose.Schema;

var cors = require('cors');
var app = express();
mongoose.connect(process.env.MONGO_URI);


app.use(parser.urlencoded({extended: false}));
app.use(cors());

//Schemas
var UserShema = new Schema({login: String, password: String});
var User = mongoose.model('user', UserShema);

var PinSchema = new Schema({user_id: String, description: String, image_link: String});
var Pin = mongoose.model('pin', PinSchema);
//End of Schemas

var port = process.env.PORT || 3000;

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});
 


app.post("/api/pin", function (req, res) {
    var newPin = new Pin(JSON.parse(req.body.pin));
    newPin.user_id = "5bd45fc5208c3cf3f12d00a0";
    console.log(newPin);
    newPin.save(function(err, data){
        if(err){
            console.log(err);
            res.json(err);
        }
        res.json(data);
    });
});

app.get("/api/pin", function(req, res){
    Pin.find({}, function(err, data){
        res.json(data);

    })
})


app.get("/api/newuser", function (req, res) {
    var newUser = new User({login: "admin", password: "12345"});
    console.log(newUser);
    console.log('teste');
    newUser.save(function(err, data){
        if(err){
            console.log(err);
            res.json(err);
        }
        res.json(newUser);
    });
});


app.listen(port, function () {
    console.log('Node.js listening ...');
});