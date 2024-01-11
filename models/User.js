const mongoose = require('mongoose');

// TODO: User schema

const Schema = mongoose.Schema({
    name: String,
    fitbit_auth_token: String
    // TODO: add data fields
});

module.exports = mongoose.model('User', Schema);