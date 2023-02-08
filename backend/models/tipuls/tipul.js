const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const tipulSchema = new mongoose.Schema({
    name:{type:String},
});

const Tipul = mongoose.model('Tipul', tipulSchema);

module.exports = Tipul;

