const express = require('express');
const router = express.Router();

const playerController = require('../controllers/player.controller')

// I know this route dosen't follow the REST principals, but we are going WebSocket anyway.
router.get('/join/:username', playerController.join)

module.exports = router;
