const express = require('express');
const router = express.Router();
const trainerController = require('../controller/trainerController');

// Trainer CRUD routes
router.post('/', trainerController.createTrainer);
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);
router.put('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);

// Team assignment routes
router.post('/:trainerId/teams/:teamId', trainerController.assignToTeam);
router.delete('/:trainerId/teams/:teamId', trainerController.removeFromTeam);

// Player assignment routes
router.post('/:trainerId/players/:playerId', trainerController.assignToPlayer);
router.delete('/:trainerId/players/:playerId', trainerController.removeFromPlayer);

// Specialization routes
router.get('/specialization/:specialization', trainerController.getTrainersBySpecialization);

module.exports = router; 