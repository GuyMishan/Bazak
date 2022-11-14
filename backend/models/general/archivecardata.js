const mongoose = require('mongoose');



const archivecardataSchema = new mongoose.Schema({
    carnumber: { type: String },
    //cartype
    makat: { type: String }, //object
    //
    family: { type: String },
    //units
    gdod: { type: String }, //object
    //
    pluga: { type: String },
    shabzak: { type: String },
    mikum_bimh: { type: String },
    stand: { type: String },
    status: { type: String },
    //
    zminot: { type: String },
    kshirot: { type: String },
    tipuls: { type: Array },
    takala_info: { type: String },
    //
    mikum: { type: String },
    expected_repair: { type: String },
    latest_recalibration_date: { type: Date },
    updatedBy: { type: String },
}, { timestamps: true });

const ArchiveCardata = mongoose.model('ArchiveCardata', archivecardataSchema);

module.exports = ArchiveCardata;

