<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">Profil</h1>

      <div v-if="auth.token && auth.user" class="space-y-4 border-t pt-4 text-gray-700 text-sm">
        <p>
          <span class="font-semibold text-gray-900">Nom d'utilisateur :</span>
          {{ auth.user.username }}
        </p>
        <p>
          <span class="font-semibold text-gray-900">Créé le :</span>
          {{ formatDate(auth.user.registered_on) }}
        </p>
        <p>
          <span class="font-semibold text-gray-900">Statut : </span>
          <span :class="auth.user.expired ?  newCredentials ? 'text-green-600' : 'text-red-600' : 'text-green-600'">
            {{ auth.user.expired ? newCredentials ? 'Actif' : 'Expiré' : 'Actif' }}
          </span>
        </p>

        <button v-if="auth.user.expired && !newCredentials" @click="regenerateCredentials"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition">
          Régénérer les credentials
        </button>

        <div v-if="newCredentials" class="space-y-2 pt-4 border-t mt-4 text-xs">
          <p class="text-green-700 font-semibold">Nouveaux identifiants générés :</p>
          <p><strong>Mot de passe :</strong> {{ newCredentials.password }}</p>
          <img :src="`data:image/png;base64,${newCredentials.qr_pw}`" alt="QR Password" class="w-32" />
          <p><strong>Secret MFA :</strong> {{ newCredentials.mfa }}</p>
          <img :src="`data:image/png;base64,${newCredentials.qr_mfa}`" alt="QR MFA" class="w-32" />
        </div>

        <button @click="logout"
          class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
          Déconnexion
        </button>
      </div>

      <div v-else class="text-center text-gray-500">Chargement...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRuntimeConfig, navigateTo } from '#imports'

const auth = useAuth()
const newCredentials = ref<null | {
  password: string
  qr_pw: string
  mfa: string
  qr_mfa: string
}>(null)

const config = useRuntimeConfig()

onMounted(() => {
  auth.loadToken()
  if (!auth.token) {
    navigateTo('/login')
  }
})

function logout() {
  auth.logout()
  navigateTo('/login')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

async function regenerateCredentials() {
  try {
    const res = await fetch(`${config.public.apiBase}/regenerate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }

    const data = await res.json()

    newCredentials.value = {
      password: data.new_password,
      qr_pw: data.password_qr_base64,
      mfa: data.mfa_secret,
      qr_mfa: data.mfa_qr_base64
    }

    await auth.loadUser() 

  } catch (err) {
    console.error('Erreur lors de la régénération :', err)
  }
}
</script>
