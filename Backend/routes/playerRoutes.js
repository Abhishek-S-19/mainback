const express = require('express');
const router = express.Router();
const playerController = require('../controller/playerController');

// Player CRUD routes
router.post('/', playerController.createPlayer);
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

// Player stats routes
router.put('/:id/stats', playerController.updatePlayerStats);

// Team-specific player routes
router.get('/team/:teamId', playerController.getPlayersByTeam);

module.exports = router; 