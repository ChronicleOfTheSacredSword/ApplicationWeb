<template>
  <n-card
    style="width: 60vh"
    title="Hero"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-form>
      <n-form-item label="Name">
        <n-input v-model:value="heroName" />
      </n-form-item>
      <n-form-item label="Class">
        <n-select
          v-model:value="classValue"
          :options="options"
          :disabled="customClass.length > 0"
          clearable
        />
      </n-form-item>
      <n-form-item v-show="classValue === '0'" label="Custom class name">
        <n-input v-model:value="customClass" />
      </n-form-item>

      <n-form-item label="Stats">
        <n-input-number v-model:value="atk" :min="1" clearable>
          <template #prefix> <strong>ATK</strong> </template>
        </n-input-number>
        <n-input-number v-model:value="pv" :min="1" clearable>
          <template #prefix> <strong>PV</strong> </template>
        </n-input-number>
        <n-input-number v-model:value="gold" :min="0" clearable>
          <template #prefix><strong>GOLD</strong> </template>
        </n-input-number>
      </n-form-item>
      <n-button @click="addHero()" :disabled="heroName.length < 3 || classValue === null">
        Validate
      </n-button>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NCard, NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();
const props = defineProps(['id_user']);
const emit = defineEmits(['close-modal']);

const heroName = ref('');
const customClass = ref('');

const atk = ref(1);
const pv = ref(1);
const gold = ref(0);

const classValue = ref(null);
let options = [
  {
    label: 'Classe personnalisée',
    value: '0',
    stats: { atk: 1, pv: 1, gold: 0 },
  },
];

watch(classValue, (newValue) => {
  if (newValue !== null) {
    const selectedOption = options.find((opt) => opt.value === newValue);
    if (selectedOption) {
      atk.value = selectedOption.stats.atk;
      pv.value = selectedOption.stats.pv;
      gold.value = selectedOption.stats.gold;
    }
  }
});

async function addHero() {
  const idUser = await authStore.getUser;
  const heroClass: number = Number.parseInt(classValue.value);
  if (classValue.value === '0') {
    const response = await fetch('http://localhost:5008/class', {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + authStore.getAccessToken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id_hero: 0,
        name: customClass.value,
        pv: pv.value,
        gold: gold.value,
        atk: atk.value,
      }),
    }).then((res) => res.json());
  }
  const newHero = {
    id_user: idUser.id,
    name: heroName.value,
    class: heroClass,
    pv: pv.value,
    atk: atk.value,
    lvl: '0',
    xp: '0',
    gold: gold.value,
  };
  await fetch('http://localhost:5004/heros', {
    method: 'POST',
    headers: new Headers({
      Authorization: 'Bearer ' + authStore.getAccessToken,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(newHero),
  }).then((res) => {
    console.log('Request complete! response:', res);
  });
  emit('close-modal');
}

onMounted(async () => {
  const response = await fetch('http://localhost:5008/class', {
    method: 'GET',
    headers: new Headers({
      Authorization: 'Bearer ' + authStore.getAccessToken,
      'Content-Type': 'application/json',
    }),
  }).then((res) => res.json());
  console.log(response);
  for (const item of response) {
    options.push({
      label: item.name,
      value: item.id,
      stats: { atk: item.atk, pv: item.pv, gold: item.gold },
    });
  }
});
</script>

<style scoped>
.stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
