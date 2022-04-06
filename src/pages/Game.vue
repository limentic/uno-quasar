<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center column">
      <h1 class="q-my-lg text-bold text-white">C'est le jeu</h1>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapStores } from 'pinia'
  import { usePlayerStore } from 'stores/player-store'

  export default defineComponent( {
    name: 'GamePage',
    data () {
      return {
        queue: 0
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
    },

    mounted () {
      this.$socket.on(`game-${this.playerStore.gameUUID}`, (el) => {
        if (el.action === 'PLAYER_CONNECTED') {
          this.queue = el.payload
        } else if (el.action === 'PLAYER_DISCONNECTED') {
          this.queue = el.payload
        }
      })
    },

    methods: {
    }
  })
</script>

<style scoped language="css">

</style>
