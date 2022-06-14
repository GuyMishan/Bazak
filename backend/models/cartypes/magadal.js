const mongoose = require('mongoose');



const magadalSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
});

const Magadal = mongoose.model('Magadal', magadalSchema);

module.exports = Magadal;

