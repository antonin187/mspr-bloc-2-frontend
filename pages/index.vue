<template>
  <div>
    <h1>Accueil</h1>

    <div v-if="auth.token">
      <p>Bienvenue, {{ auth.user?.username }} !</p>
      <NuxtLink to="/profile">Voir mon profil</NuxtLink> |
      <button @click="logout">Déconnexion</button>
    </div>

    <div v-else>
      <NuxtLink to="/login">Se connecter</NuxtLink> |
      <NuxtLink to="/register">Créer un compte</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/stores/auth'
const auth = useAuth()

function logout() {
  auth.logout()
  navigateTo('/')
}
</script>
