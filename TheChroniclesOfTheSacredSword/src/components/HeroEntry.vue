<template>
    <div class="entry">
        <h3>{{ hero.name }}</h3>
        <h3>{{ hero.heroClass }}</h3>
        <h3>{{ hero.pv }}</h3>
        <h3>{{ hero.lvl }}</h3>
        <h3>{{ hero.xp }}</h3>
        <h3>{{ hero.gold }}</h3>
    </div>
</template>

<script setup lang="ts">

interface Hero {
    id_user?: number;
    id?: number;
    name: string;
    heroClass: string;
    pv: string;
    atk: string;
    lvl: string;
    xp: string;
    gold: string;
}

const props = defineProps<{
    hero: Hero
}>();
</script>

<style scoped>

/* HeroEntry container styling */
.entry {
    display: grid;
    grid-template-columns: repeat(6, auto);
    flex-direction: column;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 1.5rem 2rem;
    width: 100%;
    max-width: 600px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.entry:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
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
