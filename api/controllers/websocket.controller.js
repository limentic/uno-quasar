module.exports = (io, socket) => {
  const helloWorld = (payload) => {
    console.log(payload)
  }

  socket.on('helloworld', helloWorld)
}
