<template>
  <q-page class="flex flex-center background-gradient">
    <div class="flex flex-center column">
      <h1 class="q-my-lg text-bold text-white">JOUEZ AU UNO EN LIGNE</h1>
      <div class="flex flex-center column player-div">
        <q-input v-model="username" dark borderless  input-class="text-center text-h4 text-bold" color="white" placeholder="Saisissez votre pseudo..." class="q-pb-md username-qinput" />
        <q-btn color="white" label="Jouer !" text-color="black" @click="sendTest()"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue'
  import { io } from 'socket.io-client'

  export default defineComponent({
    name: 'IndexPage',
    data () {
      return {
        websocket: null,
        helloWorldVar: 'helloWorld',
        username: ''
      }
    },

    mounted () {
      this.websocket = io('http://localhost:4000/')
      this.helloWorld()
    },

    methods: {
      helloWorld: function () {
        this.$axios.get('http://localhost:4000/api/helloWorld')
          .then((res) => {
            console.log('test')
          })
          .catch((err) => {
            console.log(err)
          })
      },
      sendTest: function () {
        this.websocket.emit('helloworld', 'test')
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

  .background-gradient {
    background: linear-gradient(45deg, #21d4fd, #b721ff);
    background-size: 400% 400%;

    -webkit-animation: MovingGradient 20s ease infinite;
    -moz-animation: MovingGradient 20s ease infinite;
    animation: MovingGradient 20s ease infinite;
  }

  @-webkit-keyframes MovingGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes MovingGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes MovingGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
