const GameServices = require('../services/game.service')
const PlayerServices = require('../services/player.service')

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
        let playerArray = await PlayerServices.getPlayers(socket.redis, payload.gameUUID)
        await GameServices.startGame(socket.redis, payload.gameUUID)
        io.emit(`game-${payload.gameUUID}`, {
          action: 'START_GAME',
          payload: {
            players: playerArray,
            timer: 10
          }
        })
      }
    }
  }

  const drawCard = async (payload) => {
    let cardArray = await GameServices.drawCard(socket.redis, payload.gameUUID, payload.numberOfCards, socket.playerUUID)
    io.to(socket.id).emit(`game-${payload.gameUUID}`, {
      action: 'GET_CARD',
      payload: cardArray
    })

    io.emit(`game-${payload.gameUUID}`, {
      action: 'GET_NUMBER_OF_CARDS',
      payload: {
        playerUUID: socket.playerUUID,
        numberOfCards: cardArray.length
      }
    })
  }

  socket.on('connectToGame', connectToGame)
  socket.on('drawCard', drawCard)
}
