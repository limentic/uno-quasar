<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center column">
      <h1 class="q-my-lg text-bold text-white">En attente d'autres joueurs... {{ Number.isInteger(playerStore.playersInQueue) ? playerStore.playersInQueue : 0 }}/3</h1>
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
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
    },

    mounted () {
      this.$socket.on(`game-${this.playerStore.gameUUID}`, (el) => {
        if (el.action === 'PLAYER_CONNECTED') {
          this.playerStore.playersInQueue = el.payload
        } else if (el.action === 'PLAYER_DISCONNECTED') {
          this.playerStore.playersInQueue = el.payload
        }
      })
      this.$socket.emit('joinGame', {
        gameUUID: this.playerStore.gameUUID,
        playerUUID: this.playerStore.player.uuid
      })
    }
  })
</script>

<style scoped language="css">

</style>
