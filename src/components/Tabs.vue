<script setup lang="ts">
const tabs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Content", path: "/content" },
  { name: "Automations", path: "/automations" },
];
</script>
<template>
    <section class="right-0 absolute mt-24">
      <img src="/logo.png" alt="Vue logo" class="x10 tr mr-2 dark:invert" />

      <nav class="gap-4 p-4 rounded-lg sh col center bg-primary">
        <div class="flex flex-col" v-for="tab in tabs" :key="tab.name">
          <router-link
            :to="tab.path"
            class="text-2xl text-white hover:text-gray-300"
          >
            {{ tab.name }}
          </router-link>
        </div>
      </nav>
  </section>
</template>
