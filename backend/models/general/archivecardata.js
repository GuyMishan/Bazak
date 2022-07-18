const mongoose = require('mongoose');



const archivecardataSchema = new mongoose.Schema({
    carnumber: { type: String },
    //cartype
    mkabaz: { type: String }, //object
    magad: { type: String }, //object
    magadal: { type: String }, //object
    makat: { type: String }, //object
    makat_description: { type: String }, //unused
    //
    family: { type: String },
    //units
    gdod: { type: String }, //object
    hativa: { type: String }, //object
    ogda: { type: String }, //object
    pikod: { type: String }, //object
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
}, { timestamps: true });

const ArchiveCardata = mongoose.model('ArchiveCardata', archivecardataSchema);

module.exports = ArchiveCardata;

