const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const pikodSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    index:{type:Number},
});

const Pikod = mongoose.model('Pikod', pikodSchema);


module.exports = Pikod;