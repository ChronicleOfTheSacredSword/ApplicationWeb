<template>
  <div class="app" v-if="save.id !== undefined">
    <HeroInfoMap :hero="hero" />
    <GameMap :save="save" />
  </div>
</template>

<script setup lang="ts">
import GameMap from '../components/GameMap.vue';
import { onMounted, ref } from 'vue';
import HeroInfoMap from '../components/HeroInfoMap.vue';
import { useAuthStore } from 'stores/auth';
import Hero from 'src/interfaces/Hero';
const authStore = useAuthStore();

const idHero = ref(null);
const hero:any = ref({});
const save:any = ref({});

onMounted(() => {
  idHero.value = authStore.getHero;
  //TODO Récupérer Héros à afficher
  hero.value = {
    id_user: 1,
    id: 0,
    name: 'Richard',
    heroClass: 'Barbare',
    pv: '12',
    atk: '10',
    lvl: '1',
    xp: '250',
    gold: '500',
  };
  save.value = {
    id: 1,
    id_map: 1,
    id_box: 15,
  }
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
