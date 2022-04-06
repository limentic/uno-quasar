const GameServices = require('../services/game.service')
const PlayerServices = require('../services/player.service')

module.exports = (io, socket) => {
  const disconnect = async () => {
    console.log(socket.playerUUID)
    let object = await PlayerServices.findPlayer(socket.redis, socket.playerUUID)


    if (object !== false) {
      console.log(object)
      let currentGameObject = await GameServices.leaveGame(socket.redis, object)

      io.emit(`game-${object.gameUUID}`, {
        action: 'PLAYER_DISCONNECTED',
        payload: currentGameObject.playersCount
      })
    }
  }
  socket.on('disconnect', disconnect)
}
