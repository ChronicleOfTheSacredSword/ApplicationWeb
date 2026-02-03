<template>
    <section class="not-found">
        <h1>404</h1>
        <h2>Oops! There is nothing here...</h2>
        <p>The page you are looking for does not exist.</p>
        <button @click="goHome">Go to Login</button>
    </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"

const router = useRouter()

function goHome() {
    router.push("/") // Navigate back to login page
}
</script>

<style scoped>
.not-found {
    text-align: center;
    padding: 4rem 1rem;
    color: #333;
}

.not-found h1 {
    font-size: 6rem;
    margin-bottom: 1rem;
    color: #e74c3c;
}

.not-found h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.not-found p {
    font-size: 1rem;
    margin-bottom: 2rem;
}

.not-found button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #2d8cf0;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.not-found button:hover {
    background-color: #1a6fcc;
}
</style>
