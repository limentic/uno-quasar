<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center">
      <h1 v-if="started === false" class="q-my-lg text-bold text-white">En attente d'autres joueurs... {{ queue }}/3</h1>
      <h1 v-else class="q-my-lg text-bold text-white">Démarrage dans 10 secondes...</h1>
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
        started: false
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
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
            this.started = true
            setTimeout(() => {
              this.$router.push('/game')
            },el.payload * 1000)
        }
      })
      this.$socket.emit('connectToGame', {
        gameUUID: this.playerStore.gameUUID,
        playerUUID: this.playerStore.player.uuid
      })
    },

    methods: {
    }
  })
</script>

<style scoped language="css">

</style>
