import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080/')

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})

export { socket }
