<template>
  <div class="entry">
    <p><b>Nom</b> : {{ hero.name }}</p>
    <p><b>PV</b> : {{ hero.pv }}</p>
    <p><b>ATK</b> : {{ hero.atk }}</p>
    <p><b>LVL</b> : {{ hero.lvl }}</p>
    <p><b>GOLD</b> : {{ hero.gold }}</p>
    <n-modal v-model:show="showModal">
      <InventoryModal :id="hero.id" @update-stats="updateHeroStats" />
    </n-modal>
    <n-button type="info" @click="showModal = true">Inventory</n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NModal } from 'naive-ui';
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type Hero from 'src/interfaces/Hero';
import InventoryModal from 'components/InventoryModal.vue';
import type Item from 'src/interfaces/Item';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();

const hero: Ref<Hero> = ref({
  name: '',
  heroClass: '',
  pv: '0',
  atk: '0',
  lvl: '1',
  xp: '0',
  gold: '0',
});

onMounted(() => {
  hero.value = authStore.getHero;
});

const showModal = ref(false);

async function updateHeroStats(item: Item) {
  switch (item.unit) {
    case 'PV':
      hero.value.pv += item.quantity;
      break;
    case 'ATK':
      hero.value.atk += item.quantity;
      break;
    case 'GOLD':
      hero.value.gold += item.quantity;
      break;
    default:
      console.log(`Type non pris en charge: ${item.unit}`);
      break;
  }
  await fetch('http://localhost:5004/heros', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hero.value),
  });
}
</script>

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
  font-family: 'Adwaita Mono';
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
