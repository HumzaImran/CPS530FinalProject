var mongoose = require('mongoose');
const mongo = require('mongodb')

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/users';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    name: String,
    email: String,
    password: String
});

// Compile model from schema
var User = mongoose.model('User', UserSchema );

module.exports = {
    db : db,
    User: User
};