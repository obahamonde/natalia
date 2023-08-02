import { acceptHMRUpdate, defineStore } from "pinia";
import { User, Notification, Namespace, ChatMessage } from "../types";

export const useStore = defineStore("state", () => {
  const state = reactive({
    notifications: [] as Notification[],
    user: null as User | null,
    conversations: [] as Namespace[],
    messages: [] as ChatMessage[],
    currentConversation: null as Namespace | null,
  });

  const setState = (newState: any) => {
    Object.assign(state, newState);
  };

  const fetchTitle = async (reference: string, message: string) => {
    const { data } = await useFetch(
      "/api/chat?namespace=" + reference + "&text=" + message,
      {
        method: "POST",
      },
    ).text();
    const res = unref(data);
    state.currentConversation!.title = res as string;
  };

  const getMessages = async (reference: string, message: string) => {
    const { data } = await useFetch(
      "/api/chat?namespace=" + reference + "&text=" + message,
      {
        method: "POST",
      },
    ).json();
    const res = unref(data);
    state.messages = res as ChatMessage[];
  };

  const chunkify = async (text: string) => {
    let response = reactive({ value: "" });
    for (let i = 0; i < text.length; i += 1) {
      const chunk = text.slice(i, i + 1);
      response.value += chunk;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return response.value;
  };

  const fetchMessages = async (reference: string, message: string) => {
    const length = message.length > 0;
    if (message === "") message = "[NONE]";
    length
      ? await getMessages(reference, message)
      : await fetchTitle(reference, message);
  };
  return {
    chunkify,
    state,
    setState,
    fetchMessages,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStore as any, import.meta.hot));
