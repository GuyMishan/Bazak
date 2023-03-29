const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const CarDataFilerSchema = new mongoose.Schema({
    name: { type: String },
    userpersonalnumber: { type: String },
    filterid: {type: String, unique: true},

    zminot: { type: String },
    kshirot: { type: String },
    stand: { type: String },

    units: { type: Array },
    tenetree: { type: Array },
    allColumns: { type: Array },

}, { timestamps: true });

const CarDataFilter = mongoose.model('CarDataFilter', CarDataFilerSchema);

module.exports = CarDataFilter;