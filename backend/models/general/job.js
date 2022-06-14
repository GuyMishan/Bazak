const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const jobSchema = new mongoose.Schema({
    jobname:{type:String},
    jobcode:{type:Number},
    unit:{type:ObjectId , ref:'Unit'},
    mahlaka:{type:String},
    migzar:{type:String},
    // certain:{type:String},
    commander: {type:ObjectId,ref:'User'},
    // commander:{type:String},
    // commander_phone:{type:String},
    meaish: {type:ObjectId,ref:'User'},
    // meaish:{type:String},
    // meaish_phone:{type:String},
    rank:{type:String},
    jobremarks:{type:String},
    damah:{type:String},
    pikodi_or_mikzoi:{type:String},
    saf1:{type:String},
    saf2:{type:String},
    saf3:{type:String},
    saf4:{type:String},
    location:{type:String},
    ptoha_or_sgora:{type:String},
    peilut_level:{type:String},
    description:{type:String},
    job_contribution:{type:String},
    thinking_ability:{type:String},
    realtionship_ability:{type:String},
    management_ability:{type:String},
    leadership_ability:{type:String},
    sivug:{type:String},
    //10/4
    population:{type:ObjectId,ref:'Population'},
    grade_handasi:{type:Number},
    grade_nihuli:{type:Number},
    grade_pikudi:{type:Number},
    //8/5
    status:{type:String,default:"פעיל"},// פעיל/לא פעיל/חיצוני
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

