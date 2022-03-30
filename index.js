const express = require('express')
const cors = require('cors')
const app = express()

const PORT = 4000

const corsOptions = {
  origin: 'http://localhost:8080',
  originsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Express server started on ${PORT} port`)
})
