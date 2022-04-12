import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {

  state: () => ({
    player: {},
    gameUUID: '',
    opponents: []
  }),

  getters: {},

  actions: {
    setGame(payload) {
      this.gameUUID = payload;
    },
    setPlayer(payload) {
      this.player = payload
    },
    setOpponents(payload) {
      this.opponents = payload
    }
  },
});
