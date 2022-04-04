import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {

  state: () => ({
    player: {},
    gameUUID: '',
    playersInQueue: 0
  }),

  getters: {},

  actions: {
    setGame(payload) {
      this.gameUUID = payload;
    },
    setPlayer(payload) {
      this.player = payload
    },
    playersInQueue(payload) {
      this.playersInQueue = payload
    }
  },
});
