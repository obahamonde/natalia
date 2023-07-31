<script setup lang="ts">
const message = ref('')
const response = ref() as Ref<string>
const useFunction = async () => {
  if (!message.value) return
  try {
    const { data } = await useFetch('/api/functions?text=' + message.value, {
      method: 'POST'
    }).text()
    response.value = unref(data) as any
  }
  catch (e: any) {
    response.value = e.message
  }
}

</script>
<template>
<main v-if="response">
<div v-html="response"></div></main>
<input v-model="message" type="text" class="border-2 border-gray-300 p-2 rounded-lg" 
@keyup.enter="useFunction" placeholder="Enter an Instruction"
/>
</template>