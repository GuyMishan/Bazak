const mongoose = require('mongoose');



const mkabazSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    magad:{type:String},
    index:{type:Number},
});

const Mkabaz = mongoose.model('Mkabaz', mkabazSchema);

module.exports = Mkabaz;

