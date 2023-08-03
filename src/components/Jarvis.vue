<script setup lang="ts">
const { speech, result, isListening } = useSpeech();
const emit = defineEmits(["speech", "finished"]);
const handleClick = () => {
  isListening.value ? handleStop() : speech.start();
};
const handleStop = () => {
  speech.stop();
  emit("finished");
};
watch(result, (newResult) => {
  emit("speech", newResult);
});
</script>

<template>
  <section
    class="bg-accent border-t border-accent-2 w-96 br hover:brightness-300 x16 rf shadow-primary shadow-lg"
    style="z-index: 9999; position: absolute"
  >
    <div
      class="br fixed mb-32 mr-32 cp hover:animate-pulse"
      :class="isListening ? 'brightness-300' : 'brightness-100'"
      @click="handleClick"
    >
      <div class="e-loadholder">
        <div class="m-loader">
          <p class="e-text">
            <Icon
              class="x4 m-8"
              :icon="isListening ? 'mdi-microphone-off' : 'mdi-microphone'"
            />
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
