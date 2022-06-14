const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const mahzorSchema = new mongoose.Schema({
    season:{type:String},
    numberofjobpicks:{type:Number},
    status:{type:Number},
    population:{type:ObjectId,ref:'Population'},
});

const Mahzor = mongoose.model('Mahzor', mahzorSchema);

module.exports = Mahzor;

