<script setup lang="ts">
const { state } = useStore();
const message = ref("");
const response = ref() as Ref<string>;
const useFunction = async () => {
  if (!message.value) return;
  if (!state.currentConversation) return;
  try {
    const { data } = await useFetch("/api/functions?text=" + message.value + "&namespace" + state.currentConversation.ref, {
      method: "POST",
    }).json();
    response.value = unref(data) as any;
  } catch (e: any) {
    response.value = e.message;
  }
};



</script>
<template>
  <div>
    <p>{{ state.currentConversation }}</p>
    <p>{{ message }}</p>
  </div>
  <main v-if="response">
   {{ response  }}
  </main>
  <PubSub :namespace="state.currentConversation" v-if="state.currentConversation">
  <template #message="{ message }">
  <div>

  {{ message }}

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
