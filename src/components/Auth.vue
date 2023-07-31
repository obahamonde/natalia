<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
const { state } = useStore();
const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } =
  useAuth0();

onMounted(async () => {
  await authorize();
});

const authorize = async () => {
  const token = await getAccessTokenSilently();
  state.token = token;
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  state.notifications.push({
    message: "Welcome " + user.value!.name,
    status: "success",
  });
  return data;
};

watch(isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    state.user = await authorize();
  }
});
</script>
<template>
  <Notifier />
  <div v-if="isAuthenticated && state.user">
    <slot />
  </div>
  <div v-else>
    <div class="container">
      <button class="btn-get" @click.prevent="loginWithRedirect()">
        Login
      </button>
    </div>
  </div>
</template>
