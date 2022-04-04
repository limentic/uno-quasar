module.exports = (io, socket) => {

  const joinGame = async (payload) => {
    if (payload.gameUUID !== '' && payload.playerUUID !== '') {
      // verify payload consistency and disconnect users with the wrong payload

      socket.playerUUID = payload.playerUUID
      let currentGameObject = JSON.parse(await socket.redis.get(`game-${payload.gameUUID}`))
      io.emit(`game-${payload.gameUUID}`, {
        action: 'PLAYER_CONNECTED',
        payload: currentGameObject.playersCount
      })
    }
  }

  const disconnect = async () => {
    let connectedPlayers = await socket.redis.lrange('connectedPlayers', 0, -1)
    let trigger = false
    let object = ''

    if (connectedPlayers.length === 0) {
      trigger = true
    } else {
      for (let i = 0; connectedPlayers.length > i; i++) {
        connectedPlayers[i] = JSON.parse(connectedPlayers[i])
        if (socket.playerUUID === connectedPlayers[i].uuid) {
          if (connectedPlayers[i].gameUUID === "") {
            trigger = true
            break
          } else {
            object = {
              uuid: connectedPlayers[i].uuid,
              username: connectedPlayers[i].username,
              gameUUID: connectedPlayers[i].gameUUID
            }
          }
        }
      }
    }

    if (trigger === false) {
      await socket.redis.lrem('connectedPlayers', 1, JSON.stringify(object))
      let currentGameObject = JSON.parse(await socket.redis.get(`game-${object.gameUUID}`))

      let temp = []
      for (let i = 0; currentGameObject.players.length > i; i++) {
        if (socket.playerUUID !== currentGameObject.players[i].uuid) {
          temp.push(currentGameObject.players[i])
        }
      }

      currentGameObject.players = temp
      currentGameObject.playersCount--
      await socket.redis.set(`game-${object.gameUUID}`, JSON.stringify(currentGameObject))

      io.emit(`game-${object.gameUUID}`, {
        action: 'PLAYER_DISCONNECTED',
        payload: currentGameObject.playersCount
      })
    }
  }

  socket.on('disconnect', disconnect)
  socket.on('joinGame', joinGame)
}
