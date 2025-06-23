<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
      <nav
        class="flex justify-between items-center text-sm text-blue-600 font-medium"
      >
        <NuxtLink to="/login" class="hover:underline">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="hover:underline"
          >Créer un compte</NuxtLink
        >
      </nav>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <h1 class="text-2xl font-bold text-gray-800">Créer un compte</h1>

        <input
          v-model="username"
          placeholder="Nom d'utilisateur"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          S'inscrire
        </button>
      </form>

      <div v-if="password" class="space-y-4 border-t pt-6">
        <h2 class="text-xl font-semibold text-gray-700">
          Informations générées
        </h2>

        <div class="text-sm">
          <p><strong>Mot de passe :</strong> {{ password }}</p>
          <p class="mt-2"><strong>QR Code du mot de passe :</strong></p>
          <img
            :src="`data:image/png;base64,${passwordQr}`"
            class="w-32 h-32 object-contain"
          />
        </div>

        <div class="text-sm">
          <p><strong>Secret MFA :</strong> {{ mfaSecret }}</p>
          <p class="mt-2"><strong>QR Code MFA :</strong></p>
          <img
            :src="`data:image/png;base64,${mfaQr}`"
            class="w-32 h-32 object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const password = ref("");
const passwordQr = ref("");
const mfaSecret = ref("");
const mfaQr = ref("");

const handleRegister = async () => {
  try {
    const response = await axios.post(
      "http://openfaas.mspr.antoninsimon.fr/function/register",
      {
        username: username.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Permet les cookies si nécessaires
      }
    );
    console.log(response.data);

    const data = response.data;

    password.value = data.password;
    passwordQr.value = data.password_qr_base64;
    mfaSecret.value = data.mfa_secret;
    mfaQr.value = data.mfa_qr_base64;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
  }
};
</script>
