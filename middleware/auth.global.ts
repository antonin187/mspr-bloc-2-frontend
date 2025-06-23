import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuth } from "./../stores/auth"

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth()
    if (!auth.token && to.path === '/profile') {
      return navigateTo('/login')
    }
  })