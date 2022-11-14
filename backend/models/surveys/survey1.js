const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const survey1Schema = new mongoose.Schema({
    question1: { type: String },
    question2: { type: String },
    question3: { type: String },
    question4: { type: String },
    question5: { type: String },

    userid: { type: ObjectId, ref: 'User' },
}, { timestamps: true });

const Survey1 = mongoose.model('Survey1', survey1Schema);

module.exports = Survey1;

