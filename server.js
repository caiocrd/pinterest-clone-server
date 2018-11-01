
require('dotenv').config();
var express = require('express');

var mongoose = require('mongoose');
var parser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var GitHubTokenStrategy = require('passport-github-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var { generateToken, sendToken } = require('./utils/tokenUtil');


var Schema = mongoose.Schema;

var cors = require('cors');
var app = express();    
mongoose.connect(process.env.MONGO_URI);


app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

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


passport.use(new GitHubTokenStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    passReqToCallback: true
},
function (accessToken, refreshToken, profile, done) {
    console.log('PROFILE ' + profile);
    User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    });
}));


passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
function (accessToken, refreshToken, profile, done) {
    console.log('eita', profile);
    User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    });
}));

app.route('/auth/github')
.post(passport.authenticate('github-token', {session: false}), function(req, res, next) {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
        id: req.user.id
    };

    res.status(200).send(JSON.stringify(req.user));
});

/*app.get('/auth/google', function(req, res, next) {
    console.log('entrei aqui');
  passport.authenticate('google-token', function(err, user, info) {
    console.log('erro ', err);  
    console.log('user ', user);  
    console.log('info ', info);  
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});*/


app.route('/auth/google')
    .get(passport.authenticate('google-token', {session: false}), function(req, res, next) {
        console.log('usuario ', req.user);
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
}, generateToken, sendToken);

/*app.route('/auth/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
        console.log('entrou aqui no google')
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };
        console.log(req.user);
res.status(200).send(JSON.stringify(req.user));
        
    });
*/


app.listen(port, function () {
    console.log('Node.js listening ...');
});