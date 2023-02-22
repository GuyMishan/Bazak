const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const chartSchema = new mongoose.Schema({
    name: { type: String },
    screenid: { type: String },
    chartid: {type: String, unique: true},
    description: { type: String },

    yellowcolor: { type: Number },
    redcolor: { type: Number },

    units: { type: Array },
    tenetree: { type: Array },

    stand: { type: Array },
    status: { type: Array },
    index: { type: Number },
}, { timestamps: true });

const Chart = mongoose.model('Chart', chartSchema);

module.exports = Chart;

