<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">

      <div class="space-y-4">
        <h1 class="text-2xl font-bold text-gray-800 text-center">Bienvenue</h1>


      <nav class="flex flex-row items-center text-sm text-white font-semibold">
        <NuxtLink to="/login" class="w-full bg-blue-600 p-3 text-center rounded-lg mr-4 hover:underline">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="w-full bg-blue-600 p-3 text-center rounded-lg ml-4 hover:underline">Créer un compte</NuxtLink>
      </nav>
      
        <div v-if="auth.token" class="text-sm text-gray-700 space-y-4">
          <p class="text-center">
            Bonjour, <span class="font-semibold text-gray-900">{{ auth.user?.username }}</span> 👋
          </p>

          <NuxtLink
            to="/profile"
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Voir mon profil
          </NuxtLink>

          <button
            @click="logout"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>

        <div v-else class="text-center text-sm text-gray-500">
          <p>Connecte-toi ou crée un compte pour accéder à ton profil.</p>
        </div>
      </div>
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
