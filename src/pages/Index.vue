<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center column">
      <h1 class="q-my-lg text-bold text-white">JOUEZ AU UNO EN LIGNE</h1>
      <div class="flex flex-center column player-div">
        <q-input v-model="username" dark borderless input-class="text-center text-h4 text-bold" color="white" placeholder="Saisissez votre pseudo..." class="q-pb-md username-qinput" />
        <q-btn color="white" label="Jouer !" :disabled="username === ''" text-color="black" @click="joinQueue()"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapStores } from 'pinia'
  import { usePlayerStore } from 'stores/player-store'

  export default defineComponent({
    name: 'IndexPage',
    data () {
      return {
        username: ''
      }
    },

    computed: {
      ...mapStores(usePlayerStore)
    },

    methods: {
      joinQueue: function() {
        if (this.username !== '') {
          this.$api.get(`/api/connect/${this.username}`)
            .then((res) => {
              if (res.data !== 'USERNAME_TAKEN') {
                this.playerStore.player = {
                  username: res.data.username,
                  uuid: res.data.uuid
                }
                this.playerStore.gameUUID = res.data.gameUUID
                this.$router.push('/queue')
              } else {
                this.$q.notify({
                  message: "Ce nom d'utilisateur est déjà pris",
                  color: 'yellow'
                })
              }
            })
            .catch(() => {
              this.$q.notify({
                message: 'Something went wrong',
                color: 'red'
              })
            })
        }
      }
    }
  })
</script>

<style scoped language="css">
  .player-div {
    min-width: 30vw;
  }

  .username-qinput {
    width: 100%;
  }
</style>
