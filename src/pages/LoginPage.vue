<template>
  <main class="login-page">
    <TitleFrame />
    <LoginForm />
  </main>
</template>

<script setup lang="ts">
import TitleFrame from "../components/TitleFrame.vue"
import LoginForm from "../components/LoginForm.vue"
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
