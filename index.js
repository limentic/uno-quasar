require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const Redis = require('ioredis')
const path = require('path')
const uuid = require('uuid')

// CORS setup is only for development, because the quasar dev server is not on the
// same port as the API.
const corsOptions = {
  origin: 'http://localhost:8080',
  originsSuccessStatus: 200,
}

const app = express()
const io = new Server({
  cors: {
    origin: corsOptions.origin,
    credentials: true
  }
})

const redis = new Redis(process.env.REDIS_URL)
redis.flushall()

// Initialize Redis
const currentUUID = uuid.v4()
redis.set(`game-${currentUUID}`, JSON.stringify({
  players: [],
  playersCount: 0,
  game: {
    status: 'waiting_players'
  }
}))
redis.set('currentUUID', currentUUID)


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
const websocketController = require('./api/controllers/websocket.controller')

// Initialize static server
app.use('/', express.static(path.join(__dirname, 'dist', 'spa')))
// Initialize API router
app.use('/api', router)

// Initialize Socket.io router
const onConnection = (socket) => {
  websocketController(io, socket)
}
io.on("connection", onConnection)

// Custom middleware to pass Redis to Socket.io
io.use(function(socket, next) {
  socket.redis = redis
  next()
})

// Start Express server
const server = app.listen(process.env.PORT, () => {
  console.log(`Express server started on ${process.env.PORT} port`)
})
// Bind Socket.io to express instance
io.attach(server)

