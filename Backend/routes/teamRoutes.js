const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamController');

// Team CRUD routes
router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team player management routes
router.post('/:id/players', teamController.addPlayerToTeam);
router.delete('/:id/players', teamController.removePlayerFromTeam);

module.exports = router; 