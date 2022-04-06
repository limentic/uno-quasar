// TODO : Implement redis as a module
const uuid = require('uuid')

class Player {
  constructor(username = '') {
    this.uuid = uuid.v4()
    this.username = username
    this.gameUUID = ''
  }
}

module.exports = {
  Player,

  isConnected: async function (redis, username) {
    // TODO : Replace this with proper auth in v2
    let connectedPlayers = await redis.lrange('connectedPlayers', 0, -1)

    /* I know, I use a "for" instead of "forEach()", because there is no way to
    stop or break a "forEach()" loop other than by throwing an exception.
     */
    for (const el of connectedPlayers) {
      if (JSON.parse(el).username === username) return true
    }
    return false
  },

  findPlayer: async function (redis, playerUUID) {
    let connectedPlayers = await redis.lrange('connectedPlayers', 0, -1)

    if (connectedPlayers.length > 0) {
      for(let el of connectedPlayers) {
        el = JSON.parse(el)
        if (el.uuid === playerUUID && el.gameUUID !== "") {
          return {
            uuid: el.uuid,
            username: el.username,
            gameUUID: el.gameUUID
          }
        }
      }
    }
    return false
  }
}
