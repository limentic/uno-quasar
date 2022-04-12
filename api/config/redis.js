const { createClient } = require('redis')

module.exports = {
  initializeRedis: async function () {
    const client = createClient({
      url: process.env.REDIS_URL
    })
    client.on('error', (err) => console.log('Connected to Redis.', err));
    await client.connect()

    await client.sendCommand(['FLUSHALL'])

    return client
  }
}
