const uuid = require('uuid')

module.exports = {
  join: async function (req, res) {
    // I know this is not the proper way to do it, it's going to be replaced in v2 with the support for proper auth.
    let connectedPlayers = await req.redis.lrange('connectedPlayers', 0, -1)
    let trigger = false

    for (let i = 0; connectedPlayers.length > i; i++ ) {
      connectedPlayers[i] = JSON.parse(connectedPlayers[i])
      if (connectedPlayers[i].username === req.params.username) {
        trigger = true
        break
      }
    }

    if (trigger === false) {
      let player = {
        uuid: uuid.v4(),
        username: req.params.username,
        gameUUID: ''
      }

      await req.redis.lpush('connectedPlayers', JSON.stringify(player))

      let currentUUID = await req.redis.get('currentUUID')
      let currentGame = await req.redis.get(`game-${currentUUID}`)

      currentGame = JSON.parse(currentGame)


      // Need to change logic here
      if (currentGame.playersCount === 3) {
        // Setup next game
        const nextUUID = uuid.v4()
        await req.redis.set('currentUUID', nextUUID)
        await req.redis.set(`game-${nextUUID}`, JSON.stringify({
          players: [player],
          playersCount: 1,
          game: {
            status: 'waiting_players'
          }
        }))

        player.gameUUID = nextUUID
        await req.redis.lrem('connectedPlayers', 1, JSON.stringify({
          uuid: player.uuid,
          username: player.username,
          gameUUID: ""
        }))
        await req.redis.lpush('connectedPlayers', JSON.stringify(player))

        res.send({
          username: player.username,
          playerUUID: player.uuid,
          gameUUID: player.gameUUID
        })

      } else {
        currentGame.players.push(player)
        currentGame.playersCount++
        await req.redis.set(`game-${currentUUID}`, JSON.stringify(currentGame))

        player.gameUUID = currentUUID
        await req.redis.lrem('connectedPlayers', 1, JSON.stringify({
          uuid: player.uuid,
          username: player.username,
          gameUUID: ""
        }))
        await req.redis.lpush('connectedPlayers', JSON.stringify(player))

        res.send({
          username: player.username,
          playerUUID: player.uuid,
          gameUUID: player.gameUUID
        })
      }
    } else {
      res.send('USERNAME_TAKEN')
    }
  }
}
