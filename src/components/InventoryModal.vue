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
    <ul v-if="inventoryLoaded">
      <li v-for="item in inventory" class="item" :key="item.id">
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
import type Item from 'src/interfaces/Item';

const props = defineProps(['id']);
const emit = defineEmits(['update-stats']);
const inventory = ref<Item[]>([]);
const inventoryLoaded = ref(false);

async function useItem(item: Item) {
	const choice = confirm(`Do you want to use ${item.name} x1 ?`);

	if (choice && item) {
		const index:number = inventory.value.indexOf(item);
		item.amount = item.amount - 1;
		console.log(item);
		if (item.amount > 0) {
			const inventoryItem = inventory.value.find(i => i.id === item.id);
			if (!inventoryItem) return;
			inventoryItem.amount = item.amount;
			await fetch("http://localhost:5005/inventory", {
				method: "PUT",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({id_hero: props.id, id_item: item.id, amount: item.amount}),
			}).then(res => {
				console.log("Request complete! response:", res);
			});
		} else {
			inventory.value.splice(index, 1);
			await fetch(`http://localhost:5005/inventory?hero=${props.id}&item=${item.id}`, {
				method: "DELETE",
				headers: {'Content-Type': 'application/json'}
			}).then(res => {
				console.log("Request complete! response:", res);
			});
		}
		emit('update-stats', item);
	}
}

onMounted(async () => {
	const response = await fetch(`http://localhost:5005/inventory/${props.id}`).then((res) =>
		res.json(),
	);
	inventory.value = response;
	inventoryLoaded.value = true;
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
