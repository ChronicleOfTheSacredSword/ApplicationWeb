<template>
  <div class="map-container" tabindex="0">
    <!-- Joueur (rond) -->
    <div class="player" :style="playerStyle"></div>

    <!-- Grille -->
    <div class="grid">
      <div v-for="cellId in ROWS * COLS" :key="cellId" class="cell"></div>
    </div>

    <br />

    <n-modal v-model:show="showModal" :mask-closable="false" :close-on-esc="false">
      <CombatModal @close="showModal = false" />
    </n-modal>

    <n-button type="info" @click="savePosition">Sauvegarder</n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { NButton, NModal } from 'naive-ui';
import InventoryModal from 'components/InventoryModal.vue';
import CombatModal from 'components/CombatModal.vue';

interface Save {
  id: number;
  id_map: number;
  id_box: number;
}

const props = defineProps<{
  save?: Save;
}>();

const showModal = ref(false);

// -------------------------
// CONFIG
// -------------------------
type Direction = 'up' | 'down' | 'left' | 'right';
const ROWS = 4;
const COLS = 9;
const CELL_SIZE = 60;
const PLAYER_SIZE = 40;

// -------------------------
// PLAYER STATE
// -------------------------
const playerRow = ref(0);
const playerCol = ref(0);
let lastMoveTime = 0;
const MOVE_DELAY = 200;

const playerCellId = computed(() => playerRow.value * COLS + playerCol.value + 1);
const playerStyle = computed(() => ({
  transform: `translate(
    ${playerCol.value * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2}px,
    ${playerRow.value * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2}px
  )`,
}));

function setPlayerFromIdBox(id_box: number) {
  const index = id_box - 1;
  playerRow.value = Math.floor(index / COLS);
  playerCol.value = index % COLS;
}

// -------------------------
// MOVEMENT
// -------------------------
function move(direction: Direction) {
  const now = Date.now();
  if (now - lastMoveTime < MOVE_DELAY) return;

  switch (direction) {
    case 'up':
      playerRow.value = (playerRow.value - 1 + ROWS) % ROWS;
      break;
    case 'down':
      playerRow.value = (playerRow.value + 1) % ROWS;
      break;
    case 'left':
      playerCol.value = (playerCol.value - 1 + COLS) % COLS;
      break;
    case 'right':
      playerCol.value = (playerCol.value + 1) % COLS;
      break;
  }
  lastMoveTime = now;
  checkRandomMonster();
}

function handleKeydown(e: KeyboardEvent) {
  if (showModal.value) return;
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      move('up');
      break;
    case 'ArrowDown':
      e.preventDefault();
      move('down');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      move('left');
      break;
    case 'ArrowRight':
      e.preventDefault();
      move('right');
      break;
  }
}

// -------------------------
// MONSTER EVENT
// -------------------------
function checkRandomMonster() {
  if (Math.random() <= 0.9) {
    //alert('⚔️ Un monstre apparaît !')
    console.log("Je trouve un monstre");
    showModal.value = true;
  }
}

// -------------------------
// SAVE
// -------------------------
function savePosition() {
  const save: Save = {
    id: 1,
    id_map: 1,
    id_box: playerCellId.value,
  };
  localStorage.setItem('playerSave', JSON.stringify(save));
}

// -------------------------
// ON MOUNT
// -------------------------
onMounted(() => {
  if (props.save && props.save.id_box) {
    setPlayerFromIdBox(props.save.id_box);
  } else {
    const saved = localStorage.getItem('playerSave');
    if (saved) {
      const saveObj: Save = JSON.parse(saved);
      if (saveObj.id_box) setPlayerFromIdBox(saveObj.id_box);
    }
  }

  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: calc(9 * 60px);
  margin: 20px auto;
  outline: none;
}

/* Grille */
.grid {
  display: grid;
  grid-template-columns: repeat(9, 60px);
  grid-template-rows: repeat(4, 60px);
}

.cell {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Joueur */
.player {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: crimson;
  z-index: 10;
  pointer-events: none;
  transition: transform 0.2s ease-out;
}
</style>
