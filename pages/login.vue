<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
      <nav class="flex justify-between items-center text-sm text-blue-600 font-medium">
        <NuxtLink to="/login" class="hover:underline">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="hover:underline">Créer un compte</NuxtLink>
      </nav>

      <form @submit.prevent="submitLogin" class="space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">Connexion</h1>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
          <input
            id="username"
            v-model="username"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="mfa_code" class="block text-sm font-medium text-gray-700 mb-1">Code MFA</label>
          <input
            id="mfa_code"
            v-model="mfa_code"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
      </form>

      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useRuntimeConfig, navigateTo } from '#imports'
import axios from "axios";

const username = ref('')
const password = ref('')
const mfa_code = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuth()
const config = useRuntimeConfig()

async function submitLogin() {
  error.value = ''
  loading.value = true


  try {
    const response = await axios.post(`${config.public.apiBase}/login`, {
      username: username.value,
      password: password.value,
      mfa_code: mfa_code.value
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status !== 200) {
      error.value = response.data.message || 'Erreur lors de la connexion'
      loading.value = false
      return
    }

    auth.login(response.data.token)
    loading.value = false
    navigateTo('/profile')
  } catch (e) {
    error.value = 'Erreur réseau, réessayez.'
    loading.value = false
  }
}
</script>
