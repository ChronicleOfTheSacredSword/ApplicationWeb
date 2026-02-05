import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    persist: true,
    state: () => ({
        user: null as any,
        accessToken: null as string | null,
        refreshToken: null as string | null
    }),

    getters: {
        getUser: (state) => state.user,
        getAccessToken: (state) => state.accessToken,
        getRefreshToken: (state) => state.refreshToken
    },

    actions: {
        setUser(user: any) {
            this.user = user
        },

        setAccessToken(token: string | null) {
            this.accessToken = token
        },

        setRefreshToken(token: string | null) {
            this.refreshToken = token
        },

        clearAuth() {
            this.user = null
            this.accessToken = null
            this.refreshToken = null
        }
    }
})
