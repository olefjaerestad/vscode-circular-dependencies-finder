<template>
  <div class="component-f">
    <ComponentD />
  </div>
</template>

<script setup lang="ts">
import ComponentD from '../d/d.vue';

const props = defineProps({
  title: { type: String, default: 'Component F' }
})
</script>

<style scoped>
.component-f {
  border: 1px solid red;
}
</style>
