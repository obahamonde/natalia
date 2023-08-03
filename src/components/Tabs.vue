<script setup lang="ts">
const tabs = [
  { name: "Home", path: "/", icon: "mdi-home" },
  { name: "Chat", path: "/chat", icon: "mdi-chat"},
  { name: "About", path: "/about", icon: "mdi-information" },
  { name: "Content", path: "/content", icon: "mdi-post" },
  { name: "Auto", path: "/automations", icon: "mdi-infinity" },
];

const tabBeingHovered = ref(null) as Ref<string | null>;
</script>
<template>
  <section class="right-0 fixed mt-24">
    <img src="/logo.png" alt="Vue logo" class="x10 tr mr-2 dark:invert" />

    <router-link
      :to="tab.path"
      v-for="tab in tabs"
      :key="tab.name"
      :class="tabBeingHovered === tab.name ? 'w-full' : 'w-32'"
      class="flex row center mx-4 my-2 text-2xl text-white bg-secondary px-4 py-2 rounded-lg text-center"
      @mouseover="tabBeingHovered = tab.name"
    >
      <div class="flex gap-4 row center">
        <Icon :icon="tab.icon" class="tab-icon" />
        <div :class="tabBeingHovered === tab.name ? 'px-4 w-32' : 'hidden'">
          {{ tab.name }}
        </div>
      </div>
    </router-link>
  </section>
</template>
<style scoped lang="scss">
.router-link-active {
  background-color: #1e1e1e;
  color: #00ffff;
}
</style>
