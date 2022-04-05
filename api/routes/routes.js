const express = require('express');
const router = express.Router();

const playerController = require('../controllers/player.ex.controller')

// I know this route dosen't follow the REST principals, but we are going WebSocket anyway.
router.get('/connect/:username', playerController.connect)

module.exports = router;
