const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const candidateSchema = new mongoose.Schema({
    mahzor:{type:ObjectId,ref:'Mahzor'},
    user:{type:ObjectId,ref:'User'},
    movement:{type:ObjectId,ref:'Movement'}
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;

