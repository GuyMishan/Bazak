const mongoose = require('mongoose');



const assessmentSchema = new mongoose.Schema({
    pikod: { type: String },
    name: { type: String },
    englishname:{type:String},
    index:{type:Number},
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;

