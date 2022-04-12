require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const path = require('path')

const { initializeRedis } = require('./api/config/redis')
const { initializeGame } = require('./api/services/game.service')

// I do this this way because node-redis cannot be initialized in a sync way.
// And I need to use the official redis client to use JSON module.
initializeRedis()
  .then((redis) => {
    initializeGame(redis).then().catch()

    // CORS setup is only for development, because the quasar dev server is not on the
    // same port as the API.
    const corsOptions = {
      origin: process.env.CLIENT_URL,
      originsSuccessStatus: 200,
    }

    const app = express()
    const io = new Server({
      cors: {
        origin: corsOptions.origin,
        credentials: true
      }
    })

    // Setup all middlewares
    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // Custom middleware to pass Redis to Express
    app.use(function(req, res, next) {
      req.redis = redis
      next()
    })

    const router = require('./api/routes/routes')
    // Initialize static server
    app.use('/', express.static(path.join(__dirname, 'dist', 'spa')))
    // Initialize API router
    app.use('/api', router)

    // TODO : Properly implement router
    const GameWsController = require('./api/controllers/game.ws.controller')
    const PlayerWsController = require('./api/controllers/player.ws.controller')
    const onConnection = (socket) => {
      GameWsController(io, socket)
      PlayerWsController(io, socket)
    }
    io.on("connection", onConnection)

    // Custom middleware to pass Redis to Socket.io
    io.use(function(socket, next) {
      socket.redis = redis
      next()
    })

    // Start Express server
    const server = app.listen(process.env.PORT, process.env.IP, () => {
      console.log(`Express server listening on "${process.env.IP}:${process.env.PORT}"`)
    })
    // Bind Socket.io to express instance
    io.attach(server)
  })
  .catch(() => {
    process.exit(1)
  })
