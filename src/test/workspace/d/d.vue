<template>
  <div class="component-d">
    <ComponentE />
  </div>
</template>

<script setup lang="ts">
import ComponentE from '../e/e.vue';

const props = defineProps({
  title: { type: String, default: 'Component D' }
})
</script>

<style scoped>
.component-d {
  border: 1px solid red;
}
</style>
