<template>
  <q-page class="flex flex-center bg-grey-10">
    <div class="flex flex-center column">
      <img
        alt="Table"
        src='~assets/table-texture.png'
        class="playing-table"
      >
    </div>

    <div v-if="opponents.length > 0 && opponents[0].numberOfCards > 0" class="flex flex-center column fixed-top-left" style="rotate: -45deg; padding-top: 220px; padding-left: 140px;">
      <div class="text-white text-bold text-h4"> {{ opponents[0].username }}</div>
      <div class="opponent-hand">
        <div v-for="n in opponents[0].numberOfCards" class="opponent-card shadow-2"></div>
      </div>
    </div>
    <div v-if="opponents.length > 1 && opponents[1].numberOfCards > 0" class="flex flex-center column fixed-top-right" style="rotate: 45deg; padding-top: 200px; padding-right: 180px;">
      <div class="text-white text-bold text-h4"> {{ opponents[1].username }}</div>
      <div class="opponent-hand">
        <div v-for="n in opponents[1].numberOfCards" class="opponent-card shadow-2"></div>
      </div>
    </div>

    <div v-if="deck.length > 0" class="fixed-bottom player-hand">
      <div v-for="el in deck" :key="el.id" class="player-card text-white text-h4 text-bold" :style="backgroundCard(el.color)">
        <q-icon v-if="el.type === 'skip'" name="block" />
        <q-icon v-else-if="el.type === 'reverse'" name="refresh" />
        <div v-else-if="el.type === 'plus_two'">+2</div>
        <div v-else-if="el.type === 'joker'">JK</div>
        <div v-else-if="el.type === 'super_joker'">SJK</div>
        <div v-else>{{ el.type }}</div>
      </div>
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
        locked: true,
        deck: [],
        opponents: []
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
    },

    mounted () {
      this.opponents = this.playerStore.opponents

      this.$socket.on(`game-${this.playerStore.gameUUID}`, (el) => {
        switch (el.action) {
          case 'GET_CARD':
            this.deck = el.payload
            break
          case 'GET_NUMBER_OF_CARDS':
            this.opponents.forEach((opponent) => {
              if (opponent.uuid === el.payload.playerUUID) {
                opponent.numberOfCards = el.payload.numberOfCards
              }
            })
            break
        }
      })
      // TODO : Trigger this draw card event when all people are connected
      setTimeout(() => {
        this.$socket.emit('drawCard', {
          gameUUID: this.playerStore.gameUUID,
          numberOfCards: 7
        })
      },1000)
    },

    methods: {
      backgroundCard: function (color) {
        let code = ''
        switch (color) {
          case 'red':
            code = '#f44336'
            break
          case 'blue':
            code = '#2196f3'
            break
          case 'green':
            code = "#4caf50"
            break
          case 'yellow':
            code = "#ffc107"
            break
          default:
            code = 'black'
            break
        }
        return {
          backgroundColor: code
        }
      }
    }
  })
</script>

<style scoped language="css">
.playing-table {
  height: 70vh;
  width: 70vw;
  object-fit: contain;
}

.player-hand {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 40px;
}

.player-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 80px;
  margin: 4px 4px 4px 4px;
  border-radius: 4px;
  border: white solid 8px;
}

.opponent-hand {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.opponent-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 80px;
  background-color: black;
  margin: 4px -54px 4px 4px;
  border-radius: 4px;
  border: white solid 8px;
}

</style>
