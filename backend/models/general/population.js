const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const populationSchema = new mongoose.Schema({
    name:{type:String},//רסן הנדסי/נגדים..
    iskidum:{type:Boolean},//קידום או לא
});

const Population = mongoose.model('Population', populationSchema);

module.exports = Population;

