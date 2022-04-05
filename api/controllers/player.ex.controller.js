const GameServices = require('../services/game.service')
const PlayerServices = require('../services/player.service')


module.exports = {
  connect: async function (req, res) {
    const trigger = await PlayerServices.isConnected(req.redis, req.params.username)
    if (trigger === false) {
      const player = new PlayerServices.Player(req.params.username)
      res.send(await GameServices.joinGame(req.redis, player))
    } else {
      res.send('USERNAME_TAKEN')
    }
  }
}
