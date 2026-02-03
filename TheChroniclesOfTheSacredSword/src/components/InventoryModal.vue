<template>
  <n-card
    class="container"
    title="Inventory"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-divider />
    <ul v-if="inventory.size > 0">
      <li v-for="(item, id) in inventory.values()" class="item" :key="id">
        <p>
          <strong>{{ item.name }}</strong>
        </p>
        <p>
          Gives <strong>{{ item.quantity }}</strong> amount of <strong>{{ item.unit }}</strong>
        </p>
        <p>x{{ item.amount }}</p>
        <n-button @click="useItem(item)">Use</n-button>
      </li>
    </ul>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NCard, NDivider } from 'naive-ui';
import { onMounted, ref } from 'vue';

const props = defineProps(['id']);
const emit = defineEmits(['update-stats']);
const inventory = ref(
  new Map([
    [0, { id: 0, name: 'Health potion', usable: true, quantity: 50, unit: 'PV', amount: 2 }],
    [1, { id: 1, name: 'Strength potion', usable: true, quantity: 20, unit: 'ATK', amount: 1 }],
    [2, { id: 2, name: 'Stolen purse', usable: true, quantity: 200, unit: 'GOLD', amount: 1 }],
  ]),
);

function useItem(item) {
  const choice = confirm(`Do you want to use ${item.name} x1 ?`);
  if (choice) {
    item.amount = item.amount - 1;
    if (item.amount > 0) {
      inventory.value.set(item.id, item);
      // update inventory (service)
    } else {
      inventory.value.delete(item.id);
      // delete item from inventory
    }
    emit('update-stats', item);
  }
}

onMounted(() => {
  // fetch inventory
  console.log(`Inventory loaded. ${props.id}`);
});
</script>

<style scoped>
.container {
  width: 60vh;
}
ul {
  width: 100%;
  margin: 0;
  padding: 0;
}

.item {
  display: grid;
  grid-template-columns: 2fr 3fr 0.5fr 0.5fr;
}
</style>
