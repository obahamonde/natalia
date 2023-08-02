<script setup lang="ts">
const tabs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Content", path: "/content" },
  { name: "Automations", path: "/automations" },
];
</script>
<template>
  <nav
    class="right-0 absolute mt-24 gap-4 p-4 rounded-lg sh col center bg-primary"
  >
    <img src="/logo.png" alt="Vue logo" class="x10 tr fixed mr-2" />
    <div class="flex flex-col" v-for="tab in tabs" :key="tab.name">
      <router-link
        :to="tab.path"
        class="text-2xl text-white hover:text-gray-300"
      >
        {{ tab.name }}
      </router-link>
    </div>
  </nav>
</template>
