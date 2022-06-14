const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const jobinmahzorSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    job:{type:ObjectId,ref:'Job'},
    certain:{type:String},
});

const Jobinmahzor = mongoose.model('Jobinmahzor', jobinmahzorSchema);

module.exports = Jobinmahzor;

