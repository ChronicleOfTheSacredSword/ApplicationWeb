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
import { ref, computed, watch } from 'vue';

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
const enemyMaxHp = 100;
const playerMaxHp = 120;

const enemyHp = ref(80);
const playerHp = ref(110);

const enemyHpPercent = computed(() => (enemyHp.value / enemyMaxHp) * 100);

const playerHpPercent = computed(() => (playerHp.value / playerMaxHp) * 100);

const isCombatOver = computed(() => {
  return enemyHp.value <= 0 || playerHp.value <= 0;
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function emitCombatEnd() {
  emit('close');
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
