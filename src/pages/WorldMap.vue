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
const hero: any = ref({});
const save: any = ref({});

onMounted(async () => {
  idHero.value = authStore.getHero;
  console.log('IDHERO :' + idHero.value);
  //TODO Récupérer Héros à afficher
  const response = await fetch(`http://localhost:5004/heros/${idHero.value}`).then((res) =>
    res.json(),
  );
  hero.value = response;

  /*
  TODO : Appel au service de héros pour récupérer le héros séléctionner
  GET Heros

  Exemple :
  {
    "id_user": 1,
    "id": 1,
    "name": "Arthas",
    "class": "Warrior",
    "pv": "120",
    "atk": "25",
    "lvl": "5",
    "xp": "1500",
    "gold": "200"
  }
   */

  const responseSave = await fetch(`http://localhost:5003/save/${idHero.value}`).then((res) =>
    res.json(),
  );
  save.value = responseSave;
  console.log(responseSave);

  /*
  TODO : Appel au service la sauvegarde du héros
  GET Save

  Exemple :
{
  "id": 1,
  "id_map": 1,
  "id_box": 1
}
 */
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
