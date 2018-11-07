var mongo = require('mongodb');
var mongoose = require('mongoose');

const { Schema } = mongoose;
var UserShema = new Schema({
    fullName: String,
    login: String,
    password: String,
    email: String,
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }

});

UserShema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'email': profile.emails[0].value
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};
mongoose.model('user', UserShema);