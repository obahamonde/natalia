<script setup lang="ts">
import type { Namespace } from "~/types";
const props = defineProps<{
	namespace: Namespace;
}>();
const { messages, error, eventSource } = usePubSub(props.namespace);
defineExpose({ messages, error, eventSource });
</script>
<template>
<div v-for="message in messages">
<slot :message="message" />
</div>
<slot :error="error" />
</template>