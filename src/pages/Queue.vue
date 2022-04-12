<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center">
      <h1 v-if="started === false" class="q-my-lg text-bold text-white">En attente d'autres joueurs... {{ queue }}/3</h1>
      <h1 v-else class="q-my-lg text-bold text-white">Démarrage dans {{ timerCount }} secondes...</h1>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapStores } from 'pinia'
  import { usePlayerStore } from 'stores/player-store'

  export default defineComponent( {
    name: 'QueuePage',
    data () {
      return {
        queue: 0,
        started: false,
        timerCount: 0
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
    },

    watch: {
      timerCount: {
        handler(value) {
          if (value > 0 && this.started === true) {
            setTimeout(() => {
              this.timerCount--;
            }, 1000);
          }
        },
        immediate: true
      }
    },

    mounted () {
      this.$socket.on(`game-${this.playerStore.gameUUID}`, (el) => {

        switch (el.action) {
          case 'PLAYER_CONNECTED':
            this.queue = el.payload
            break
          case 'PLAYER_DISCONNECTED':
            this.queue = el.payload
            break
          case 'START_GAME':
            this.setOpponents(el.payload.players)
            this.started = true
            this.timerCount = el.payload.timer

            setTimeout(() => {
              this.$router.push('/game')
            },el.payload.timer * 1000)
        }
      })
      this.$socket.emit('connectToGame', {
        gameUUID: this.playerStore.gameUUID,
        playerUUID: this.playerStore.player.uuid
      })
    },

    methods: {
      setOpponents (players) {
        let tempArray = []
        players.forEach((player) => {
          if (player.uuid !== this.playerStore.player.uuid) {
            tempArray.push({
              uuid: player.uuid,
              username: player.username,
              numberOfCards: -1
            })
          }
        })

        this.playerStore.opponents = tempArray
      }
    }
  })
</script>

<style scoped language="css">

</style>
