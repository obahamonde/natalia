<script setup lang="ts">
import type { Namespace, ChatMessage } from "~/types";
const { state } = useStore();
const message = ref(null) as Ref<string | null>;
const showSideBar = ref(true);
const showChat = ref(true)
const receiveAudio = async (value: string) => {
  message.value = value;
};
const sendAudio = async () => {
  const { data } = await useFetch("/api/audio?mode=llm&text=" + message.value, {
    method: "POST",
  }).blob();
  message.value = null;
  const audio = unref(data) as Blob;
  const audioEl = new Audio(URL.createObjectURL(audio));
  audioEl.play();
};
const isLoading = ref(false);

const forwardAudio = async (text: string) => {
  const { data } = await useFetch("/api/audio?mode=n&text=" + text, {
    method: "POST",
  }).blob();
  const audio = unref(data) as Blob;
  const audioEl = new Audio(URL.createObjectURL(audio));
  audioEl.play();
};

const createConversation = async () => {
  if (!state.user) return;
  const { data } = await useFetch(
    "/api/conversation/new?user=" + state.user.ref,
  ).json();
  const conversation = unref(data) as Namespace;
  state.currentConversation = conversation;
  await fetchConversations();
};

const fetchConversations = async () => {
  const { data } = await useFetch(
    "/api/conversation/list?user=" + state.user!.ref,
  ).json();
  state.conversations = unref(data).reverse() as Namespace[];
  state.currentConversation = state.conversations[0];
  await fetchConversation(state.currentConversation.ref);
};

const handleDelete = async (reference: string) => {
  if (!state.currentConversation) return;
  await useFetch("/api/conversation?id=" + reference, {
    method: "DELETE",
  }).text();
  await fetchConversations();
  await fetchConversation(state.currentConversation.ref);
  await fetchMessages(state.currentConversation.ref);
};

const fetchConversation = async (reference: string) => {
  if (!state.currentConversation) return;
  if (!message.value) {
    const { data } = await useFetch(
      "/api/conversation/get?id=" + reference,
    ).json();
    const conversation = unref(data) as Namespace;
    state.currentConversation = conversation;
    await fetchMessages(reference);
    return;
  }
  await fetchMessages(reference);
};

const fetchMessages = async (reference: string) => {
  if (!state.currentConversation) return;
  const { data } = await useFetch("/api/messages/get?id=" + reference).json();
  state.messages = unref(data).reverse() as ChatMessage[];
};

const wsRef = ref(null) as Ref<any>;

const sendWsMessage = async () => {
  const ws = wsRef.value;
  if (!state.currentConversation) return;
  if (!ws) return;
  if (!message.value) return;
  const messageToBeSent = message.value;
  ws.send(messageToBeSent);
  state.messages.unshift({
    role: "user",
    content: messageToBeSent,
    conversation: state.currentConversation.ref,
  });
  message.value = null;
  isLoading.value = true;
};

onMounted(async () => {
  await fetchConversations();
  await fetchConversation(state.currentConversation!.ref);
  await fetchMessages(state.currentConversation!.ref);
});

const wsUrl = computed(() => {
  if (!state.currentConversation) return;
  return (
    "wss://api.aiofauna.com/api/ws?namespace=" + state.currentConversation.ref
  );
});
</script>
<template>
  <Icon
    icon="mdi-menu"
    class="fixed top-6 left-6 text-black dark:text-white x2 scale cp"
    @click="showSideBar = !showSideBar"
    v-if="!showSideBar"
  />

  <transition name="fade-slide">
    <div
      class="tl fixed m-4 h-full w-72 bg-gray-700 dark:bg-gray-500 z-50"
      v-if="showSideBar"
    >
      <h1 class="w-full px-4 py-2 text-center">
        <Icon
          icon="mdi-menu"
          class="scale cp x2 text-black dark:text-white"
          @click="showSideBar = !showSideBar"
        />
      </h1>

      <button
        class="row center bg-secondary px-2 m-4 rounded sh scale cp"
        @click="createConversation()"
      >
        <Icon icon="mdi-plus" class="top-12 left-0 m-2 x2 scale cp" /><span
          class="m-4 text-lg"
          >New Namespace</span
        >
      </button>
      <div
        v-for="i in state.conversations"
        class="mt-16 m-4 p-4 col center sh "
        v-if="state"
      >
        <Icon
          icon="mdi-delete"
          class="text-primary hover:text-error cp scale translate-x-24 translate-y--4"
          @click="handleDelete(i.ref)"
        />
        <button
          :class="
            state.currentConversation && i.ref == state.currentConversation!.ref
              ? 'bg-accent text-white rounded-lg sh'
              : ''
          "
          class="text-lg text-center p-4 cp"
          @click.prevent="fetchConversation(i.ref)"
        >
          {{ i.title }}
        </button>
      </div>
    </div>
  </transition>

  <transition>
    <WebSocket :url="wsUrl" ref="wsRef" v-if="wsUrl && showChat" 
    @receive="isLoading=false"
    >
      <template #default="{ status }">
        <main>
          <section
            v-if="state.messages"
            class="gap-4 col backdrop-blur absolute sh mx-auto m-4"
            :class="showSideBar ? 'ml-96 w-4/6' : 'ml-24 w-5/6'"
          >
            <h1
              class="text-center text-2xl p-4 text-primary dark:text-secondary"
            > 
            <Icon icon="mdi:window-minimize" class="scale cp x2 text-black m-4 dark:text-white" @click="showChat = !showChat" />
              {{ state.currentConversation?.title }}
            </h1>
            
            <div v-if="isLoading" class="m-12 row start">
                  <Icon
                    icon="mdi:loading"
                    class="x2 scale cp text-primary animate-spin gap-4"
                  /><span class="text-primary">Thinking...</span>
                </div> 
            <div
              v-for="(i) in state.messages"
              class="m-4 col overflow-x-auto"
              :class="i.role !== 'user' ? 'col start' : 'col end'"

            >
              <p
                class="m-4 text-sm p-4 cp dark:bg-gray-800 bg-gray-700 rounded-lg w-auto"
                :class="i.role == 'user' ? 'col end' : 'col start'"
              >
                <img
                  :src="
                    i.role == 'user'
                      ? state.user!.picture
                      : isDark
                      ? '/favicon-dark.svg'
                      : '/favicon.svg'
                  "
                  class="w-8 h-8 rounded-full m-4 scale cp"
                  :class="
                    i.role == 'user'
                      ? 'col end'
                      : isDark
                      ? 'col start bg-gray-600'
                      : 'col start bg-gray-400'
                  "
                  @click="forwardAudio(i.content)"
                />
                
                <MdMessage :html="i.content" />
              </p>
            </div>
          </section>
          <section v-else>
            {{ status }}
          </section>
        </main>
      </template>
    </WebSocket>
    <div v-else class="col center">
      <Icon icon="mdi:window-maximize" class="x2 scale cp dark:text-light text-accent"
      @click="showChat = !showChat"
      />
    </div>
  </transition>

  <transition>
    <div class="col center mx auto">
      <input
        v-model="message"
        class="fixed bottom-0 h-16 min-w-128 bg-gray-500 dark:bg-gray-700 px-4 m-4 no-outline rounded-xl sh"
        placeholder="Enter your message here"
        text-light
        dark:text-accent
        @keyup.enter="sendWsMessage()"
      />
    </div>
  </transition>

  <Jarvis
    @speech="receiveAudio($event)"
    @finished="sendAudio"
    class="scale-50"
  />
</template>
