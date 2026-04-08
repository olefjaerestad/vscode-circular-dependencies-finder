<template>
  <div class="component-b">
    <ComponentA />
  </div>
</template>

<script setup lang="ts">
import ComponentA from '../a/a.vue';

const props = defineProps({
  title: { type: String, default: 'Component B' }
})
</script>

<style scoped>
.component-b {
  border: 1px solid red;
}
</style>
