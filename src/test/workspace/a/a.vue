<template>
  <div class="component-a">
    <ComponentB />
  </div>
</template>

<script setup lang="ts">
import ComponentB from '../b/b.vue';

const props = defineProps({
  title: { type: String, default: 'Component A' }
})
</script>

<style scoped>
.component-a {
  border: 1px solid red;
}
</style>
