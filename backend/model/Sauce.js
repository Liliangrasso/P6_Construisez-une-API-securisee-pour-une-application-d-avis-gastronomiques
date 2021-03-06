/*** IMPORTATIONS ****/
const mongoose = require('mongoose');

/*** SCHEMA ****/
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: false },
    likes: { type: Number, default: 0},
    dislikes: { type: Number},
    imageUrl: { type: String, required: false },
    mainPepper: { type: String, required: false },
    usersLiked: { type: Array, default: [], required: true },
    usersDisliked: { type: Array, default: [], required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);