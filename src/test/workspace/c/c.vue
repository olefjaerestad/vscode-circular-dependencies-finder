<template>
  <div class="component-c">
    <ComponentE />
  </div>
</template>

<script setup lang="ts">
import ComponentE from '../e/e.vue';

const props = defineProps({
  title: { type: String, default: 'Component C' }
})
</script>

<style scoped>
.component-c {
  border: 1px solid red;
}
</style>
