const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const hativaSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    ogda:{type:String},
});

const Hativa = mongoose.model('Hativa', hativaSchema);

module.exports = Hativa;