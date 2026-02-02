<template>
  <div id="app">
    <HeroInfoMap :hero="hero" />
    <GameMap :save="save" />
  </div>
</template>

<script setup lang="ts">
import GameMap from '../components/GameMap.vue'
import { ref } from 'vue'
import HeroInfoMap from '../components/HeroInfoMap.vue'

//TODO Récupérer Héros à afficher
const hero = ref({
  id_user: 1,
  id: 1,
  name: 'Richard',
  heroClass: 'Barbare',
  pv: '12',
  atk: '10',
  lvl: '1',
  xp: '250',
  gold: '500',
})

//TODO: récupérer une sauvegarde à charger
const save = ref({
  id: 1,
  id_map: 1,
  id_box: 36,
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
