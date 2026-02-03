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
        <n-input-number v-model:value="atk" :min="0" clearable>
          <template #prefix> <strong>ATK</strong> </template>
        </n-input-number>
        <n-input-number v-model:value="pv" :min="0" clearable>
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
import { ref, watch } from 'vue';

const props = defineProps(['id_user']);
const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const heroName = ref('');
const customClass = ref('');

const atk = ref(0);
const pv = ref(0);
const gold = ref(0);

const classValue = ref(null);
const options = [
  {
    label: 'Custom class',
    value: '0',
    stats: { atk: 0, pv: 0, gold: 0 },
  },
  {
    label: 'Barbarian',
    value: '1',
    stats: { atk: 40, pv: 40, gold: 50 },
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

function addHero() {
  // TODO: API call to create hero
  console.log(heroName.value);
  if (classValue.value === '0') {
    // TODO: API call to create class
    console.log(props.id_user, customClass.value, atk.value, pv.value, gold.value);
  } else {
    console.log(props.id_user, classValue.value, atk.value, pv.value, gold.value);
  }
  emit('close-modal');
}
</script>

<style scoped>
.stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
