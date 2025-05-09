const Score = require('../models/Score');
const Player = require('../models/Player');

// Create a new score
exports.createScore = async (req, res) => {
    try {
        const score = new Score(req.body);
        await score.save();
        
        // Update player stats
        await updatePlayerStats(score);
        
        res.status(201).json(score);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all scores
exports.getAllScores = async (req, res) => {
    try {
        const scores = await Score.find()
            .populate('match player team');
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get score by ID
exports.getScoreById = async (req, res) => {
    try {
        const score = await Score.findById(req.params.id)
            .populate('match player team');
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }
        res.status(200).json(score);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update score
exports.updateScore = async (req, res) => {
    try {
        const oldScore = await Score.findById(req.params.id);
        if (!oldScore) {
            return res.status(404).json({ message: 'Score not found' });
        }
        
        const score = await Score.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('match player team');
        
        // Update player stats
        await updatePlayerStats(score, oldScore);
        
        res.status(200).json(score);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete score
exports.deleteScore = async (req, res) => {
    try {
        const score = await Score.findById(req.params.id);
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }
        
        // Revert player stats
        await revertPlayerStats(score);
        
        await score.remove();
        res.status(200).json({ message: 'Score deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get scores by match
exports.getScoresByMatch = async (req, res) => {
    try {
        const scores = await Score.find({ match: req.params.matchId })
            .populate('player team');
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get scores by player
exports.getScoresByPlayer = async (req, res) => {
    try {
        const scores = await Score.find({ player: req.params.playerId })
            .populate('match team');
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update player stats
async function updatePlayerStats(score, oldScore = null) {
    const player = await Player.findById(score.player);
    if (!player) return;
    
    // If updating existing score, subtract old stats first
    if (oldScore) {
        player.stats.matches--;
        player.stats.runs -= oldScore.batting.runs;
        player.stats.wickets -= oldScore.bowling.wickets;
        player.stats.catches -= oldScore.fielding.catches;
        player.stats.stumpings -= oldScore.fielding.stumpings;
    }
    
    // Add new stats
    player.stats.matches++;
    player.stats.runs += score.batting.runs;
    player.stats.wickets += score.bowling.wickets;
    player.stats.catches += score.fielding.catches;
    player.stats.stumpings += score.fielding.stumpings;
    
    await player.save();
}

// Helper function to revert player stats
async function revertPlayerStats(score) {
    const player = await Player.findById(score.player);
    if (!player) return;
    
    player.stats.matches--;
    player.stats.runs -= score.batting.runs;
    player.stats.wickets -= score.bowling.wickets;
    player.stats.catches -= score.fielding.catches;
    player.stats.stumpings -= score.fielding.stumpings;
    
    await player.save();
} 