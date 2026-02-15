const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
        required: true
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1 // duration is in minutes
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Combo = mongoose.model('Combo', comboSchema);

module.exports = Combo;