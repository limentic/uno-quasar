module.exports = (io, socket) => {

  const connectToGame = async (payload) => {
    if (payload.gameUUID !== '' && payload.playerUUID !== '') {
      // verify payload consistency and disconnect users with the wrong payload

      socket.playerUUID = payload.playerUUID
      let currentGameObject = JSON.parse(await socket.redis.get(`game-${payload.gameUUID}`))

      io.emit(`game-${payload.gameUUID}`, {
        action: 'PLAYER_CONNECTED',
        payload: currentGameObject.playersCount
      })

      if (currentGameObject.playersCount === 3) {
        io.emit(`game-${payload.gameUUID}`, {
          action: 'START_GAME',
          payload: 10
        })
      }
    }
  }
  socket.on('connectToGame', connectToGame)
}
