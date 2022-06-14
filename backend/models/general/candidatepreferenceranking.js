const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const candidatepreferenceranking = new mongoose.Schema({
    jobinmahzor:{type:ObjectId,ref:'Jobinmahzor'},
    rank:{type:Number},
});

const Candidatepreferenceranking = mongoose.model('Candidatepreferenceranking', candidatepreferenceranking);

module.exports = Candidatepreferenceranking;

