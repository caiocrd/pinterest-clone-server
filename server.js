
require('dotenv').config();
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var parser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


var Schema = mongoose.Schema;

var cors = require('cors');
var app = express();    
mongoose.connect(process.env.MONGO_URI);


app.use(parser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(cors());

//Schemas
require('./model/User');
require('./model/Pin');

var User = mongoose.model('user');
var Pin = mongoose.model('pin');
//End of Schemas

var port = process.env.PORT || 3000;

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});
 

//Create Pin
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

//Gel all pins
app.get("/api/pin", function(req, res){
    Pin.find({}, function(err, data){
        res.json(data);
    })
});
//Get pin by user id
app.get("/api/pin/:user_id", function(req, res){
    Pin.find({user_id: req.params.user_id}, function(err, data){
        res.json(data);
    })
})

//Delete Pin
app.delete("/api/pin/:id", function(req, res){
    Pin.deleteOne({_id: req.params.id}, function(err){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send();
        }
        
    });
});



//Add a admin user
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