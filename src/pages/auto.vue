<script setup lang="ts">
const { state } = useStore();
const message = ref("");
const response = ref() as Ref<string>;
const useFunction = async () => {
  if (!message.value) return;
  if (!state.currentConversation) return;
  try {
    const namespace = state.currentConversation.ref;
    const { data } = await useFetch(`/api/producer?namespace=${namespace}&text=` + message.value, {
      method: "POST",
    }).text()
    response.value = unref(data) as string
  } catch (e: any) {
    response.value = e.message;
  }
};



</script>
<template>
  <pre v-if="response">
   {{ response  }}
  </pre>
  <PubSub :namespace="state.currentConversation" v-if="state.currentConversation">
  <template #message="{ message }">
  <div>

  {{ JSON.parse(message) }}

  </div>
  </template>
  <template #error="{ error }">
  <div>
  {{ error }}
  </div>
  </template>
  </PubSub>
  <input
    v-model="message"
    type="text"
    class="border-2 border-gray-300 p-2 rounded-lg"
    @keyup.enter="useFunction"
    placeholder="Enter an Instruction"
  />
</template>
