<template>
  <div class="index">
    <ComponentA />
    <ComponentB />
    <ComponentC />
    <ComponentD />
  </div>
</template>

<script setup lang="ts">
import ComponentA from './a/a.vue';
import ComponentB from './b/b.vue';
import ComponentC from './c/c.vue';
import ComponentD from './d/d.vue';

const props = defineProps({
  title: { type: String, default: 'Index' }
})
</script>

<style scoped>
.index {
  border: 1px solid red;
}
</style>
