const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const candidatepreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    candidate:{type:ObjectId,ref:'Candidate'},
    certjobpreferences:[{type:ObjectId,ref:'Candidatepreferenceranking'}],
    noncertjobpreferences:[{type:ObjectId,ref:'Candidatepreferenceranking'}],
    remarks:{type:String},
});

const Candidatepreference = mongoose.model('Candidatepreference', candidatepreferenceSchema);

module.exports = Candidatepreference;

