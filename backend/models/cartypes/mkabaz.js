const mongoose = require('mongoose');



const mkabazSchema = new mongoose.Schema({
    _id:{type:String},
    name:{type:String},
    magad:{type:String},
    index:{type:Number},
    main_group:{type:String},
});

const Mkabaz = mongoose.model('Mkabaz', mkabazSchema);

module.exports = Mkabaz;

