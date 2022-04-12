const uuid = require('uuid')

class Game {
  constructor() {
    this.players = []
    this.playersCount = 0
    this.game = {
      status: 'waiting_player',
      deck: baseDeck,
      discard_pile: []
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
    // TODO : Implement RedisJSON Syntax

    /* I set player into redis here, to lock this username. It could be
    simplified if I had redisJSON.
    I could just add the gameUUID key, when a game has been found without the
    need to delete and push the player back. */

    await redis.lPush('connectedPlayers', JSON.stringify(player))

    let currentGameUUID = await redis.get('currentUUID')
    let currentGameObject = JSON.parse(await redis.get(`game-${currentGameUUID}`))

    if (currentGameObject.playersCount === 3) {
      currentGameUUID = await this.initializeGame(redis)
      currentGameObject = new Game()
    }

    player.gameUUID = currentGameUUID

    currentGameObject.players.push(player)
    currentGameObject.playersCount++
    await redis.set(`game-${currentGameUUID}`, JSON.stringify(currentGameObject))

    await redis.lRem('connectedPlayers', 1, JSON.stringify({
      uuid: player.uuid,
      username: player.username,
      gameUUID: "",
      hand: []
    }))
    await redis.lPush('connectedPlayers', JSON.stringify(player))
    return player
  },

  leaveGame: async function (redis, player) {
    await redis.lRem('connectedPlayers', 1, JSON.stringify(player))
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
    currentGameObject.game.deck = shuffle(currentGameObject.game.deck)

    await redis.set(`game-${gameUUID}`, JSON.stringify(currentGameObject))
  },

  drawCard: async function (redis, gameUUID, numberOfCards, playerUUID) {
    let currentGameObject = JSON.parse(await redis.get(`game-${gameUUID}`))

    let cards = []
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(currentGameObject.game.deck.pop())
      await redis.set(`game-${gameUUID}`, JSON.stringify(currentGameObject))
      // To avoid the last card to be drawn twice
    }

    for (let i = 0; currentGameObject.players.length > i; i++) {
      if (currentGameObject.players[i].uuid === playerUUID) {
        currentGameObject.players[i].hand = currentGameObject.players[i].hand.concat(cards)
        await redis.set(`game-${gameUUID}`, JSON.stringify(currentGameObject))
        break
      }
    }
    return cards
  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

let baseDeck = [
  {
    "id": 0,
    "type": "skip",
    "color": "blue"
  },
  {
    "id": 1,
    "type": "skip",
    "color": "blue"
  },
  {
    "id": 2,
    "type": "reverse",
    "color": "blue"
  },
  {
    "id": 3,
    "type": "reverse",
    "color": "blue"
  },
  {
    "id": 4,
    "type": "plus_two",
    "color": "blue"
  },
  {
    "id": 5,
    "type": "plus_two",
    "color": "blue"
  },
  {
    "id": 6,
    "type": "0",
    "color": "blue"
  },
  {
    "id": 7,
    "type": "1",
    "color": "blue"
  },
  {
    "id": 8,
    "type": "1",
    "color": "blue"
  },
  {
    "id": 9,
    "type": "2",
    "color": "blue"
  },
  {
    "id": 10,
    "type": "2",
    "color": "blue"
  },
  {
    "id": 11,
    "type": "3",
    "color": "blue"
  },
  {
    "id": 12,
    "type": "3",
    "color": "blue"
  },
  {
    "id": 13,
    "type": "4",
    "color": "blue"
  },
  {
    "id": 14,
    "type": "4",
    "color": "blue"
  },
  {
    "id": 15,
    "type": "5",
    "color": "blue"
  },
  {
    "id": 16,
    "type": "5",
    "color": "blue"
  },
  {
    "id": 17,
    "type": "6",
    "color": "blue"
  },
  {
    "id": 18,
    "type": "6",
    "color": "blue"
  },
  {
    "id": 19,
    "type": "7",
    "color": "blue"
  },
  {
    "id": 20,
    "type": "7",
    "color": "blue"
  },
  {
    "id": 21,
    "type": "8",
    "color": "blue"
  },
  {
    "id": 22,
    "type": "8",
    "color": "blue"
  },
  {
    "id": 23,
    "type": "9",
    "color": "blue"
  },
  {
    "id": 24,
    "type": "9",
    "color": "blue"
  },
  {
    "id": 25,
    "type": "skip",
    "color": "yellow"
  },
  {
    "id": 26,
    "type": "skip",
    "color": "yellow"
  },
  {
    "id": 27,
    "type": "reverse",
    "color": "yellow"
  },
  {
    "id": 28,
    "type": "reverse",
    "color": "yellow"
  },
  {
    "id": 29,
    "type": "plus_two",
    "color": "yellow"
  },
  {
    "id": 30,
    "type": "plus_two",
    "color": "yellow"
  },
  {
    "id": 31,
    "type": "0",
    "color": "yellow"
  },
  {
    "id": 32,
    "type": "1",
    "color": "yellow"
  },
  {
    "id": 33,
    "type": "1",
    "color": "yellow"
  },
  {
    "id": 34,
    "type": "2",
    "color": "yellow"
  },
  {
    "id": 35,
    "type": "2",
    "color": "yellow"
  },
  {
    "id": 36,
    "type": "3",
    "color": "yellow"
  },
  {
    "id": 37,
    "type": "3",
    "color": "yellow"
  },
  {
    "id": 38,
    "type": "4",
    "color": "yellow"
  },
  {
    "id": 39,
    "type": "4",
    "color": "yellow"
  },
  {
    "id": 40,
    "type": "5",
    "color": "yellow"
  },
  {
    "id": 41,
    "type": "5",
    "color": "yellow"
  },
  {
    "id": 42,
    "type": "6",
    "color": "yellow"
  },
  {
    "id": 43,
    "type": "6",
    "color": "yellow"
  },
  {
    "id": 44,
    "type": "7",
    "color": "yellow"
  },
  {
    "id": 45,
    "type": "7",
    "color": "yellow"
  },
  {
    "id": 46,
    "type": "8",
    "color": "yellow"
  },
  {
    "id": 47,
    "type": "8",
    "color": "yellow"
  },
  {
    "id": 48,
    "type": "9",
    "color": "yellow"
  },
  {
    "id": 49,
    "type": "9",
    "color": "yellow"
  },
  {
    "id": 50,
    "type": "skip",
    "color": "red"
  },
  {
    "id": 51,
    "type": "skip",
    "color": "red"
  },
  {
    "id": 52,
    "type": "reverse",
    "color": "red"
  },
  {
    "id": 53,
    "type": "reverse",
    "color": "red"
  },
  {
    "id": 54,
    "type": "plus_two",
    "color": "red"
  },
  {
    "id": 55,
    "type": "plus_two",
    "color": "red"
  },
  {
    "id": 56,
    "type": "0",
    "color": "red"
  },
  {
    "id": 57,
    "type": "1",
    "color": "red"
  },
  {
    "id": 58,
    "type": "1",
    "color": "red"
  },
  {
    "id": 59,
    "type": "2",
    "color": "red"
  },
  {
    "id": 60,
    "type": "2",
    "color": "red"
  },
  {
    "id": 61,
    "type": "3",
    "color": "red"
  },
  {
    "id": 62,
    "type": "3",
    "color": "red"
  },
  {
    "id": 63,
    "type": "4",
    "color": "red"
  },
  {
    "id": 64,
    "type": "4",
    "color": "red"
  },
  {
    "id": 65,
    "type": "5",
    "color": "red"
  },
  {
    "id": 66,
    "type": "5",
    "color": "red"
  },
  {
    "id": 67,
    "type": "6",
    "color": "red"
  },
  {
    "id": 68,
    "type": "6",
    "color": "red"
  },
  {
    "id": 69,
    "type": "7",
    "color": "red"
  },
  {
    "id": 70,
    "type": "7",
    "color": "red"
  },
  {
    "id": 71,
    "type": "8",
    "color": "red"
  },
  {
    "id": 72,
    "type": "8",
    "color": "red"
  },
  {
    "id": 73,
    "type": "9",
    "color": "red"
  },
  {
    "id": 74,
    "type": "9",
    "color": "red"
  },
  {
    "id": 75,
    "type": "skip",
    "color": "green"
  },
  {
    "id": 76,
    "type": "skip",
    "color": "green"
  },
  {
    "id": 77,
    "type": "reverse",
    "color": "green"
  },
  {
    "id": 78,
    "type": "reverse",
    "color": "green"
  },
  {
    "id": 79,
    "type": "plus_two",
    "color": "green"
  },
  {
    "id": 80,
    "type": "plus_two",
    "color": "green"
  },
  {
    "id": 81,
    "type": "0",
    "color": "green"
  },
  {
    "id": 82,
    "type": "1",
    "color": "green"
  },
  {
    "id": 83,
    "type": "1",
    "color": "green"
  },
  {
    "id": 84,
    "type": "2",
    "color": "green"
  },
  {
    "id": 85,
    "type": "2",
    "color": "green"
  },
  {
    "id": 86,
    "type": "3",
    "color": "green"
  },
  {
    "id": 87,
    "type": "3",
    "color": "green"
  },
  {
    "id": 88,
    "type": "4",
    "color": "green"
  },
  {
    "id": 89,
    "type": "4",
    "color": "green"
  },
  {
    "id": 90,
    "type": "5",
    "color": "green"
  },
  {
    "id": 91,
    "type": "5",
    "color": "green"
  },
  {
    "id": 92,
    "type": "6",
    "color": "green"
  },
  {
    "id": 93,
    "type": "6",
    "color": "green"
  },
  {
    "id": 94,
    "type": "7",
    "color": "green"
  },
  {
    "id": 95,
    "type": "7",
    "color": "green"
  },
  {
    "id": 96,
    "type": "8",
    "color": "green"
  },
  {
    "id": 97,
    "type": "8",
    "color": "green"
  },
  {
    "id": 98,
    "type": "9",
    "color": "green"
  },
  {
    "id": 99,
    "type": "9",
    "color": "green"
  },
  {
    "id": 100,
    "type": "joker",
    "color": null
  },
  {
    "id": 101,
    "type": "joker",
    "color": null
  },
  {
    "id": 102,
    "type": "joker",
    "color": null
  },
  {
    "id": 103,
    "type": "joker",
    "color": null
  },
  {
    "id": 104,
    "type": "super_joker",
    "color": null
  },
  {
    "id": 105,
    "type": "super_joker",
    "color": null
  },
  {
    "id": 106,
    "type": "super_joker",
    "color": null
  },
  {
    "id": 107,
    "type": "super_joker",
    "color": null
  }
]
