/*** IMPORTATIONS ****/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*** SCHEMA ****/
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Vérifie que l'email est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);