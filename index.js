const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const path = require('path')

const PORT = 4000

// CORS setup is only for development, because the quasar dev server is not on the
// same port as the API.
const corsOptions = {
  origin: 'http://localhost:8080',
  originsSuccessStatus: 200,
}

const router = require('./api/routes/routes')
const websocketController = require('./api/controllers/websocket.controller')

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

// Initialize static server
app.use('/', express.static(path.join(__dirname, 'dist', 'spa')))

// Initialize API router
app.use('/api', router)

const onConnection = (socket) => {
  websocketController(io, socket)
}
io.on("connection", onConnection)

const server = app.listen(PORT, () => {
  console.log(`Express server started on ${PORT} port`)
})
io.attach(server)

