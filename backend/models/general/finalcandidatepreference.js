const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const finalcandidatepreferenceSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    candidate:{type:ObjectId,ref:'Candidate'},
    certjobpreferences:[{type:ObjectId,ref:'Candidatepreferenceranking'}],
    noncertjobpreferences:[{type:ObjectId,ref:'Candidatepreferenceranking'}],
    remarks:{type:String},
});

const FinalCandidatepreference = mongoose.model('FinalCandidatepreference', finalcandidatepreferenceSchema);

module.exports = FinalCandidatepreference;

