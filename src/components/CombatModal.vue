<template>
    <n-card
        class="container"
        title="Combat"
        :bordered="true"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
        <!-- Zone combat -->
        <div class="fight-zone">
            <!-- Ennemi -->
            <div class="fighter">
                <div class="enemy"></div>
                <div class="hp">
                    <div class="hp-bar">
                        <div class="hp-fill enemy-hp" :style="{ width: enemyHpPercent + '%' }" />
                    </div>
                    <span>{{ enemyHp }} / {{ enemyMaxHp }}</span>
                </div>
            </div>

            <!-- Joueur -->
            <div class="fighter">
                <div class="player"></div>
                <div class="hp">
                    <div class="hp-bar">
                        <div class="hp-fill player-hp" :style="{ width: playerHpPercent + '%' }" />
                    </div>
                    <span>{{ playerHp }} / {{ playerMaxHp }}</span>
                </div>
            </div>
        </div>

        <n-divider />

        <!-- Infos du round -->
        <div class="round-info" v-if="playerActionLabel && robotActionLabel">
            <p>
                Toi : <strong>{{ playerActionLabel }}</strong> &nbsp;—&nbsp; Robot :
                <strong>{{ robotActionLabel }}</strong>
            </p>
            <p class="result">
                {{ roundResult }}
            </p>
        </div>

        <p v-if="isCombatOver" class="end-text">
            {{ playerHp <= 0 ? '💀 Défaite...\nAppuyez sur Echap' : '🏆 Victoire !\nAppuyez sur Echap' }}
        </p>

        <!-- Actions -->
        <div class="actions">
            <n-button type="error" :disabled="isCombatOver" @click="playTurn('attaque')">
                Attaque
            </n-button>

            <n-button type="warning" :disabled="isCombatOver" @click="playTurn('defense')">
                Défense
            </n-button>

            <n-button type="success" :disabled="isCombatOver" @click="playTurn('choppe')">
                Choppe
            </n-button>
        </div>

        <!-- Bouton de fin de combat -->
        <div v-if="isCombatOver" class="end-actions">
            <n-button type="primary" @click="emitCombatEnd"> Quitter le combat </n-button>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import { NCard, NDivider, NButton } from 'naive-ui';
import { ref, computed, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type Mob from 'src/interfaces/Mob';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();

/*
TODO : mise à jour des informations du joueur dans les micro services dédiés : Inventaire, Heros.
PUT Inventaire,
PUT héros

TODO : récupération des mobs
GET Mob
exemple :
{
    "id": 1,
    "name": "Gobelin",
    "pv": 100,
    "atk": 15,
    "drops": [101, 102, 103]
}
 */

const props = defineProps<{
  	mobs: number[];
}>();

type Action = 'attaque' | 'defense' | 'choppe';

const actions: Action[] = ['attaque', 'defense', 'choppe'];

const playerActionLabel = ref<Action | null>(null);
const robotActionLabel = ref<Action | null>(null);
const roundResult = ref('');
const winsAgainst: Record<Action, Action> = {
    attaque: 'choppe',
    choppe: 'defense',
    defense: 'attaque',
};

function randomRobotAction(): Action {
    const index = Math.floor(Math.random() * actions.length);
    return actions[index] as Action;
}

const DAMAGE = 15;

function playTurn(playerAction: Action) {
    const robotAction = randomRobotAction();

    playerActionLabel.value = playerAction;
    robotActionLabel.value = robotAction;

    // Égalité
    if (playerAction === robotAction) {
        roundResult.value = 'Égalité 🤝';
        return;
    }

    // Le joueur gagne
    if (winsAgainst[playerAction] === robotAction) {
        enemyHp.value = Math.max(0, enemyHp.value - DAMAGE);
        roundResult.value = 'Tu gagnes ce round ✅';
        return;
    }

    // Le robot gagne
    playerHp.value = Math.max(0, playerHp.value - DAMAGE);
    roundResult.value = 'Le robot gagne ce round ❌';
}

// PV
const enemyMaxHp = ref(80);
const playerMaxHp = ref(100);

const enemyHp = ref(80);
const playerHp = ref(100);

const mob: Ref<Mob> = ref({
    "id": 1,
    "name": "Gobelin",
    "pv": 80,
    "atk": 15,
    "drops": [101, 102, 103]
});

const enemyHpPercent = computed(() => (enemyHp.value / enemyMaxHp.value) * 100);

const playerHpPercent = computed(() => (playerHp.value / playerMaxHp.value) * 100);

const isCombatOver = computed(() => {
    return enemyHp.value <= 0 || playerHp.value <= 0;
});

watch(isCombatOver, async (newValue) => {
	if (newValue) {
		await endCombat();
	}
});

const emit = defineEmits<{
    (e: 'close'): void;
}>();

function emitCombatEnd() {
    emit('close');
}

onMounted(async () => {
    playerHp.value = parseInt(authStore.getHero.pv);
	playerMaxHp.value = playerHp.value;
	await getMob();
})


async function getMob() {
	if (!props.mobs || props.mobs.length === 0) {
		enemyHp.value = 80;
		return;
	}

	const randomIndex = Math.floor(Math.random() * props.mobs.length);
	const randomMob = props.mobs[randomIndex];
	const mobResponse = await fetch(`http://localhost:5006/mob/${randomMob}`, {
		method: 'GET',
		headers: {
		Authorization: `Bearer ${authStore.getAccessToken}`,
		'Content-Type': 'application/json'
		},
	});
	if(mobResponse.ok){
		mob.value = await mobResponse.json(); 
	}
	enemyHp.value = mob.value.pv;
	enemyMaxHp.value = enemyHp.value;
}

async function endCombat(){
	const hero = authStore.getHero;
	if(enemyHp.value){
		combatLost(hero);
	}
	else{
		await combatWin(hero);
	}

	authStore.setHero(hero);
	await updateHero(hero);
}

async function updateHero(hero: any){
	console.log("up hero", hero);
	const heroResponse = await fetch(`http://localhost:5004/heros`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${authStore.getAccessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(hero)
	});
	const newHero = await heroResponse.json();
	authStore.setHero(newHero);
}

function combatLost(hero: any){
	hero.pv = playerMaxHp.value/4;
}

async function combatWin(hero: any){
	hero.pv = playerHp.value;
	hero.xp += Math.floor(Math.random() * 50).toString();
	hero.gold += Math.floor(Math.random() * 10).toString();

	const inventory = mob.value.drops.map((itemId: number) => ({
		id_item: itemId,
		id_hero: hero.id,
		amount: Math.floor(Math.random() * 3) + 1, // 1 → 3
	}));

	console.log("up inventory", inventory);
	const inventoryResponse = await fetch(`http://localhost:5005/inventory`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${authStore.getAccessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(inventory)
	});

	if (!inventoryResponse.ok) {
		console.error('Failed to save inventory');
	}
}


</script>

<style scoped>
.container {
    width: 80vw;
    max-width: 900px;
}

/* Zone combat */
.fight-zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
}

/* Combattant */
.fighter {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Carrés */
.enemy,
.player {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    margin-bottom: 10px;
}

.enemy {
    background-color: crimson;
}

.player {
    background-color: steelblue;
}

/* PV */
.hp {
    width: 140px;
    text-align: center;
    font-size: 14px;
}

.hp-bar {
    width: 100%;
    height: 12px;
    background-color: #ddd;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 4px;
}

.hp-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.enemy-hp {
    background-color: crimson;
}

.player-hp {
    background-color: steelblue;
}

/* Actions */
.actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.round-info {
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
}

.result {
    font-weight: bold;
    margin-top: 4px;
}

.end-text {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}
.end-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
