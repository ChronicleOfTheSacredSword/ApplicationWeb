<template>
  <main class="hero-page">
    <TitleFrame />
    <n-modal v-model:show="showModal">
      <HeroCreationForm :id_user="id_user" @close-modal="toggleCloseModal" />
    </n-modal>
    <n-button type="info" @click="showModal = true"> Add hero </n-button>
    <HeroEntry v-for="hero in heroes" :key="hero.id ?? hero.name" :hero="hero" />
  </main>
</template>

<script setup lang="ts">
import TitleFrame from '../components/TitleFrame.vue';
import HeroEntry from '../components/HeroEntry.vue';
import { ref, onMounted } from 'vue';
import { NButton, NModal } from 'naive-ui';
import HeroCreationForm from 'components/HeroCreationForm.vue';
import { useAuthStore } from 'src/stores/auth';
import type Hero from 'src/interfaces/Hero';

const authStore = useAuthStore();
const showModal = ref(false);
const id_user = ref(1);
const heroes = ref<Hero[]>([]);


onMounted(async () => {
  	await getHeroes()
})

async function getHeroes(){
	const heroesResponse = await fetch(`http://localhost:5004/heros/${authStore.getUser.id}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${authStore.getAccessToken}`,
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})

	heroes.value = await heroesResponse.json();
	console.log("heroes", heroes.value);
}

function toggleCloseModal() {
  showModal.value = !showModal.value;
  console.log(showModal.value);
}
</script>

<style scoped>
.hero-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(to bottom, #f0f4f8, #d9e2ec);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-page > *:not(:last-child) {
  margin-bottom: 2rem;
}
</style>
