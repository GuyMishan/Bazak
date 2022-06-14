const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const unitSchema = new mongoose.Schema({
    name:{type:String},
    englishname:{type:String}
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;

