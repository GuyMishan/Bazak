const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const candidateineshkolSchema = new mongoose.Schema({
    candidate:{type:ObjectId,ref:'Candidate'},
    candidaterank:{type:Number},
    unitrank:{type:Number}
});

const Candidateineshkol = mongoose.model('Candidateineshkol', candidateineshkolSchema);

module.exports = Candidateineshkol;

