const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const ogdaSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    pikod:{type:String},
    index:{type:Number},
});

const Ogda = mongoose.model('Ogda', ogdaSchema);

module.exports = Ogda;