// TODO : Implement redis as a module
const uuid = require('uuid')

class Game {
  constructor() {
    this.players = []
    this.playersCount = 0
    this.game = {
      status: 'waiting_player',
      deck: []
    }
  }
}

module.exports = {
  initializeGame: async function (redis) {
    const currentGameUUID = uuid.v4()
    redis.set(`game-${currentGameUUID}`, JSON.stringify(new Game()))
    redis.set('currentUUID', currentGameUUID)

    return currentGameUUID
  },

  joinGame: async function (redis, player) {
    // TODO : Add redisJSON, this controller could be simplified.

    /* I set player into redis here, to lock this username. It could be
    simplified if I had redisJSON.
    I could just add the gameUUID key, when a game has been found without the
    need to delete and push the player back. */
    await redis.lpush('connectedPlayers', JSON.stringify(player))

    let currentGameUUID = await redis.get('currentUUID')
    let currentGameObject = JSON.parse(await redis.get(`game-${currentGameUUID}`))

    if (currentGameObject.playersCount === 3) {
      currentGameUUID = await this.initializeGame(redis)
      currentGameObject = new Game()
    }

    currentGameObject.players.push(player)
    currentGameObject.playersCount++
    await redis.set(`game-${currentGameUUID}`, JSON.stringify(currentGameObject))

    player.gameUUID = currentGameUUID
    await redis.lrem('connectedPlayers', 1, JSON.stringify({
      uuid: player.uuid,
      username: player.username,
      gameUUID: ""
    }))
    await redis.lpush('connectedPlayers', JSON.stringify(player))

    return {
      username: player.username,
      playerUUID: player.uuid,
      gameUUID: player.gameUUID
    }
  },

  leaveGame: async function (redis, player) {
    console.log(player)
    await redis.lrem('connectedPlayers', 1, JSON.stringify(player))
    let currentGameObject = JSON.parse(await redis.get(`game-${player.gameUUID}`))

    currentGameObject.players = currentGameObject.players.filter((el) => {
      if (player.uuid !== el.uuid) return el
    })

    currentGameObject.playersCount--
    await redis.set(`game-${player.gameUUID}`, JSON.stringify(currentGameObject))
    return currentGameObject
    // TODO : If 3 player, and in queue, remove the starting status
  },

  startGame: async function (redis, gameUUID) {
    let currentGameObject = JSON.parse(await redis.get(`game-${gameUUID}`))
    currentGameObject.game.status = 'started'
    await redis.set(`game-${gameUUID}`, JSON.stringify(currentGameObject))

    // TODO : Inititialize properly the game here. Create card deck, etc...
  }
}
