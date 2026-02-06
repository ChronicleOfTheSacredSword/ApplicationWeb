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
            <CombatModal @close="showModal = false" :mobs="map.mobs"/>
        </n-modal>

        <n-button type="info" @click="savePosition">Sauvegarder</n-button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { NButton, NModal } from 'naive-ui';
import InventoryModal from 'components/InventoryModal.vue';
import CombatModal from 'components/CombatModal.vue';
import type Save from 'src/interfaces/Save';
import type Map from 'src/interfaces/Map';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();

const save: Ref<Save> = ref({
    id: 0,
	id_map: 0,
	id_box: 0,
});

const map: Ref<Map> = ref({
	id: "A1",
    url: "A1",
    mobs: [],
});


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
        showModal.value = true;
    }
}

// -------------------------
// SAVE
// -------------------------
async function savePosition() {
    const newSave: Save = {
        id: authStore.getHero.id,
        id_map: 1,
        id_box: playerCellId.value,
    };
	const response = await fetch(`http://localhost:5003/save`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${authStore.getAccessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newSave)
	});
	save.value = await response.json();
}

// -------------------------
// ON MOUNT
// -------------------------
onMounted(async () => {
    await getSave();
	await getMap();
    if (save.value && save.value.id_box) {
        setPlayerFromIdBox(save.value.id_box);
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

async function getSave() {
	try {
		const hero = authStore.getHero;
		const responseSave = await fetch(`http://localhost:5003/save/${hero.id}`);
		if (!responseSave.ok) {
			console.error(`No save.`);
			return;
		}
		save.value = await responseSave.json();
	} catch (error) {
		console.error("An error occurred while fetching save data:", error);
	}

	    /*TODO : Appel au service la sauvegarde du héros
		GET Save

		Exemple :
		{
		"id": 1,
		"id_map": A1,
		"id_box": 1
		}*/
}

async function getMap(){
	try {
		const responseMap = await fetch(`http://localhost:5007/map/${save.value.id_map}`);
		if (!responseMap.ok) {
			console.error(`No map.`);
			return;
		}
		map.value = await responseMap.json();
	} catch (error) {
		console.error("An error occurred while fetching save data:", error);
	}
}
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
