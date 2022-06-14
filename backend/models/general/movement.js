const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const movementSchema = new mongoose.Schema({
    name:{type:String},// שחרור/ממשיך/רוחב/פרישה  ..
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;

