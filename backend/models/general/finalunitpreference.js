const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const finalunitpreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId , ref:'Mahzor'},
    jobinmahzor:{type:ObjectId,ref:'Jobinmahzor'},
    preferencerankings:[{type:ObjectId,ref:'Preferenceranking'}],
    remarks:{type:String},
});

const FinalUnitpreference = mongoose.model('FinalUnitpreference', finalunitpreferenceSchema);

module.exports = FinalUnitpreference;

