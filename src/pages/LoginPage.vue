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
    align-items: center;      /* horizontal center */
    justify-content: center;  /* vertical center */

    /* Background image */
    background-image: url('/bg-login.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    min-height: 100vh;        /* fill the viewport height */
}
</style>

