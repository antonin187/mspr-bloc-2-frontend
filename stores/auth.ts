export const useAuth = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as { id: number; username: string; registered_on: string; expired: boolean } | null,
    status: null as string | null
  }),
  actions: {
    async fetchUser() {
      if (!this.token) return

      try {
        const config = useRuntimeConfig()
        const res = await fetch(`${config.public.apiBase}/profile`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })

        if (!res.ok) {
          throw new Error('Failed to fetch user info')
        }

        this.user = await res.json()
      } catch (err) {
        console.error(err)
        this.logout()
      }
    },

    login(token: string, status: string) {
      this.token = token
      localStorage.setItem('token', token)
      this.fetchUser()
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      navigateTo('/login')
    },

    loadToken() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.fetchUser()
      }
    }
  }
})
