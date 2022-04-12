const uuid = require('uuid')

class Player {
  constructor(username = '') {
    this.uuid = uuid.v4()
    this.username = username
    this.gameUUID = ''
    this.hand = []
  }
}

module.exports = {
  Player,

  isConnected: async function (redis, username) {
    // TODO : Replace this with proper auth in v2
    let connectedPlayers = await redis.lRange('connectedPlayers', 0, -1)

    /* I know, I use a "for" instead of "forEach()", because there is no way to
    stop or break a "forEach()" loop other than by throwing an exception.
     */
    for (const el of connectedPlayers) {
      if (JSON.parse(el).username === username) return true
    }
    return false
  },

  findPlayer: async function (redis, playerUUID) {
    let connectedPlayers = await redis.lRange('connectedPlayers', 0, -1)

    if (connectedPlayers.length > 0) {
      for(let el of connectedPlayers) {
        el = JSON.parse(el)
        if (el.uuid === playerUUID && el.gameUUID !== "") {
          return {
            uuid: el.uuid,
            username: el.username,
            gameUUID: el.gameUUID,
            hand: el.hand
          }
        }
      }
    }
    return false
  },

  getPlayers: async function (redis, gameUUID) {
    let currentGameObject = JSON.parse(await redis.get(`game-${gameUUID}`))

    let tempArray = []
    currentGameObject.players.forEach((player) => {
      tempArray.push({
        uuid: player.uuid,
        username: player.username
      })
    })

    return tempArray
  },
}
