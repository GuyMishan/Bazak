const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const unitpreferencerankingSchema = new mongoose.Schema({
    candidate:{type:ObjectId,ref:'Candidate'},
    rank:{type:Number},
});

const Unitpreferenceranking = mongoose.model('Unitpreferenceranking', unitpreferencerankingSchema);

module.exports = Unitpreferenceranking;

