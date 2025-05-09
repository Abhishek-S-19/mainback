const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    batting: {
        runs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        out: { type: Boolean, default: false },
        dismissalType: {
            type: String,
            enum: ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Not Out']
        }
    },
    bowling: {
        overs: { type: Number, default: 0 },
        maidens: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        economy: { type: Number, default: 0 }
    },
    fielding: {
        catches: { type: Number, default: 0 },
        stumpings: { type: Number, default: 0 },
        runOuts: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', scoreSchema); 