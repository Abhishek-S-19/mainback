const Trainer = require('../models/Trainer');
const Team = require('../models/Team');
const Player = require('../models/Player');

// Create a new trainer
exports.createTrainer = async (req, res) => {
    try {
        const trainer = new Trainer(req.body);
        await trainer.save();
        res.status(201).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find()
            .populate('teams players');
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id)
            .populate('teams players');
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json(trainer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('teams players');
        
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        // Remove trainer from teams
        await Team.updateMany(
            { trainers: trainer._id },
            { $pull: { trainers: trainer._id } }
        );
        
        // Remove trainer from players
        await Player.updateMany(
            { trainers: trainer._id },
            { $pull: { trainers: trainer._id } }
        );
        
        await trainer.remove();
        res.status(200).json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign trainer to team
exports.assignToTeam = async (req, res) => {
    try {
        const { trainerId, teamId } = req.params;
        
        const trainer = await Trainer.findById(trainerId);
        const team = await Team.findById(teamId);
        
        if (!trainer || !team) {
            return res.status(404).json({ message: 'Trainer or Team not found' });
        }
        
        if (!trainer.teams.includes(teamId)) {
            trainer.teams.push(teamId);
            await trainer.save();
        }
        
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove trainer from team
exports.removeFromTeam = async (req, res) => {
    try {
        const { trainerId, teamId } = req.params;
        
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        trainer.teams = trainer.teams.filter(
            team => team.toString() !== teamId
        );
        
        await trainer.save();
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assign trainer to player
exports.assignToPlayer = async (req, res) => {
    try {
        const { trainerId, playerId } = req.params;
        
        const trainer = await Trainer.findById(trainerId);
        const player = await Player.findById(playerId);
        
        if (!trainer || !player) {
            return res.status(404).json({ message: 'Trainer or Player not found' });
        }
        
        if (!trainer.players.includes(playerId)) {
            trainer.players.push(playerId);
            await trainer.save();
        }
        
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove trainer from player
exports.removeFromPlayer = async (req, res) => {
    try {
        const { trainerId, playerId } = req.params;
        
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        trainer.players = trainer.players.filter(
            player => player.toString() !== playerId
        );
        
        await trainer.save();
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get trainers by specialization
exports.getTrainersBySpecialization = async (req, res) => {
    try {
        const trainers = await Trainer.find({ 
            specialization: req.params.specialization 
        }).populate('teams players');
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 