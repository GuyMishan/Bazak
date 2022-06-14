const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const ogdaSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    pikod:{type:String},
});

const Ogda = mongoose.model('Ogda', ogdaSchema);

module.exports = Ogda;