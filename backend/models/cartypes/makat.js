const mongoose = require('mongoose');



const makatSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    description:{type:String},
    mkabaz:{type:String},
    index:{type:Number},
});

const Makat = mongoose.model('Makat', makatSchema);

module.exports = Makat;

