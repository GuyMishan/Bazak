const mongoose = require('mongoose');



const magadSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    magadal:{type:String},
});

const Magad = mongoose.model('Magad', magadSchema);

module.exports = Magad;

