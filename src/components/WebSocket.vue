<script setup lang="ts">
const { state } = useStore();

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
const { data, open, close, status, send } = useWebSocket(props.url, {
  autoReconnect: true,
});

const emit = defineEmits(["receive"]);

onMounted(() => {
  open();
});

onUnmounted(() => {
  close();
});

watch(data, async (newData) => {
  if (!state.currentConversation) return;
  state.messages.unshift({
    content: "",
    role: "assistant",
    conversation: state.currentConversation.ref,
  });
  emit("receive")
  const CHUNKSIZE = 1;
  for (let i = 0; i < newData.length; i += CHUNKSIZE) {
    const chunk = newData.slice(i, i + CHUNKSIZE);
    state.messages[0].content += chunk;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
});

defineExpose({
  send,
});
</script>
<template>
  <slot :status="status" />
</template>
