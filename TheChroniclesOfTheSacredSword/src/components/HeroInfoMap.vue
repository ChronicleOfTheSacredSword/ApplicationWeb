<script setup lang="ts">
interface Hero {
  id_user?: number
  id?: number
  name: string
  heroClass: string
  pv: string
  atk: string
  lvl: string
  xp: string
  gold: string
}

const props = defineProps<{
  hero: Hero
}>()
</script>

<template>
  <div class="entry">
    <p><b>Nom</b> : {{ hero.name }}</p>
    <p><b>PV</b> : {{ hero.pv }}</p>
    <p><b>ATK</b> : {{ hero.atk }}</p>
    <p><b>LVL</b> : {{ hero.lvl }}</p>
    <p><b>GOLD</b> : {{ hero.gold }}</p>
  </div>
</template>

<style scoped>
/* HeroEntry container styling */
.entry {
  display: grid;
  grid-template-columns: repeat(6, auto);
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  font-family: "Adwaita Mono";
}

/* Hero information layout */
.entry h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #102a43;
}

.entry p {
  margin: 0.2rem 0;
  color: #334e68;
  font-size: 1rem;
}

.entry .stats {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.entry .stats div {
  background: #f0f4f8;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  margin: 0 0.25rem;
}

.entry .stats div:first-child {
  margin-left: 0;
}

.entry .stats div:last-child {
  margin-right: 0;
}
</style>
