const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const gdodSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    hativa:{type:String},
    index:{type:Number},
    sadir:{type:String},
});

const Gdod = mongoose.model('Gdod', gdodSchema);

module.exports = Gdod;

