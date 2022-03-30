const express = require('express');
const router = express.Router();

const helloWorld = require('../controllers/helloworld.controller')

router.get('/helloWorld', helloWorld.helloWorld)

module.exports = router;
