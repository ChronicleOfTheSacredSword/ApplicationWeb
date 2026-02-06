<template>
  <div class="app">
    <HeroInfoMap />
    <GameMap :save="save"/>
  </div>
</template>

<script setup lang="ts">
import GameMap from '../components/GameMap.vue';
import { onMounted, ref } from 'vue';
import HeroInfoMap from '../components/HeroInfoMap.vue';

const hero: any = ref({});
const save: any = ref({});

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
