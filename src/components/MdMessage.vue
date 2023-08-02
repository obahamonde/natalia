<script setup lang="ts">
const props = defineProps({
  html: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <p v-html="props.html"></p>
</template>
