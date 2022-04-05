import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {

  state: () => ({
    player: {},
    gameUUID: ''
  }),

  getters: {},

  actions: {
    setGame(payload) {
      this.gameUUID = payload;
    },
    setPlayer(payload) {
      this.player = payload
    }
  },
});
