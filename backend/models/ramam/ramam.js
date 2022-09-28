const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const ramamSchema = new mongoose.Schema({
    see: { type: String },
    estimate: { type: String },
    suggest: { type: String },

    userid: { type: ObjectId, ref: 'User' },
    unitid: { type: String },
}, { timestamps: true });

const Ramam = mongoose.model('Ramam', ramamSchema);

module.exports = Ramam;

