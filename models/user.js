const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    // name: {
    //     type: String
    // },
    // email: {
    //     type: String,
    //     required: true
    // },
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    editable: {
        type: Boolean,
        // required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.createUser = function (req, res) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if(err) {res.send(500, err);}
        res.json(200, user);
    });
};

module.exports.getUserByUsername = function(username, callback) {
    const query = {username : username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getUser = function(req, res) {
    User.find(function (err, users) {
        if(err){res.send(500, err);}
        res.json(200, users);
    })
}