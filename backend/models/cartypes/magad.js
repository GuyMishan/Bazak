const mongoose = require('mongoose');



const magadSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    magadal:{type:String},
    index:{type:Number},
});

const Magad = mongoose.model('Magad', magadSchema);

module.exports = Magad;

