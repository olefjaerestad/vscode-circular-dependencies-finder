<template>
  <div class="component-e">
    <ComponentF />
  </div>
</template>

<script setup lang="ts">
import ComponentF from '../f/f.vue';

const props = defineProps({
  title: { type: String, default: 'Component E' }
})
</script>

<style scoped>
.component-e {
  border: 1px solid red;
}
</style>
