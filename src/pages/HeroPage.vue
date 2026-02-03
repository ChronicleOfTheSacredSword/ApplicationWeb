<template>
  <main class="hero-page">
    <TitleFrame />
    <n-modal v-model:show="showModal">
      <HeroCreationForm :id_user="id_user" @close-modal="toggleCloseModal" />
    </n-modal>
    <n-button type="info" @click="showModal = true"> Add hero </n-button>
    <HeroEntry v-for="hero in heroes" v-bind:key="hero.id" :hero="hero" />
  </main>
</template>

<script setup lang="ts">
import TitleFrame from '../components/TitleFrame.vue';
import HeroEntry from '../components/HeroEntry.vue';
import { ref } from 'vue';
import { NButton, NModal } from 'naive-ui';
import HeroCreationForm from 'components/HeroCreationForm.vue';

const showModal = ref(false);
const id_user = ref(1);
const heroes = ref([
  {
    id_user: 1,
    id: 0,
    name: 'richard',
    heroClass: 'Barbarian',
    pv: '12',
    atk: '10',
    lvl: '1',
    xp: '250',
    gold: '500',
  },
  {
    id_user: 1,
    id: 1,
    name: 'bruno',
    heroClass: 'Assassin',
    pv: '2',
    atk: '20',
    lvl: '2',
    xp: '50',
    gold: '300',
  },
]);

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
