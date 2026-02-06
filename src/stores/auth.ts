import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    user: null as any,
    hero: null as any,
    accessToken: null as string | null,
    refreshToken: null as string | null
  }),

  getters: {
    getUser: (state) => state.user,
    getHero: (state) => state.hero,
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
  },

  actions: {
    setUser(user: any) {
      this.user = user;
    },

    setHero(hero: any) {
      this.hero = hero;
    },

    setAccessToken(token: string | null) {
      this.accessToken = token;
    },

    setRefreshToken(token: string | null) {
      this.refreshToken = token;
    },

    clearAuth() {
      this.user = null;
      this.hero = null;
      this.accessToken = null;
      this.refreshToken = null;
    },
  },
});
