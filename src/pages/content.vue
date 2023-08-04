<template>
  <section class="col center" v-if="state.user && state.user.ref">
    <Request :url="'/api/content?user=' + state.user.ref">
      <template #default="{ json }">
        <div v-for="post in json">
          <Icon
            icon="mdi-delete"
            class="m-4 x2 absolute text-primary hover:text-error cp scale"
            @click="deletePost(post.ref)"
          />
          <p v-html="post.content" class="vhtml_wrapper"></p>
        </div>
      </template>
    </Request>
  </section>
  <div v-if="pdfChunks">
    {{ pdfChunks }}
  </div>

  <main class="container col center br fixed m-2 mr-34">
    <transition name="input-fade">
      <section
        class="col center gap-4 sh backdrop-blur-md py-2 bg-secondary px-4 rounded bottom-4 absolute"
      >
        <input
          class="input"
          v-model="input"
          @keyup.enter="useContentGenerator"
          :placeholder="
            selected === 'Audio Book'
              ? 'Enter a Audio Book Prompt'
              : 'Enter an Blog Post Prompt'
          "
        />
        <input
          class="input"
          v-if="selected === 'BlogPost'"
          v-model="imgprompt"
          @keyup.enter="useContentGenerator"
          placeholder="Generate Image"
        />
        <Upload
          bucket="images"
          v-else-if="selected === 'Audio Book'"
          @upload="postPdf($event)"
        >
          <template #default="{ data }">
            <div>
              <p>{{ data.name }}</p>
              <p>{{ data.contentType }}</p>
              <p>{{ data.size }}</p>
              <a :href="data.url" target="_blank">Download</a>
            </div>

            <select
              v-model="state.conversations"
              @change="fetchConversation($event.target!.value)"
            >
              <option
                v-for="conversation in state.conversations"
                :value="conversation.ref"
              >
                {{ conversation.title }}
              </option>
            </select>
          </template>
        </Upload>

        <select class="input text-accent dark:text-success" v-model="selected">
          <option
            class="text-accent da rk:text-success"
            :value="v"
            v-for="v in options"
          >
            {{ v }}
          </option>
        </select>
      </section>
    </transition>
  </main>
</template>

<script setup lang="ts">
import type { GenerateBlogPostWebsiteRequest } from "~/types";

const { state } = useStore();

const input = ref("") as Ref<string | null>;
const imgprompt = ref("") as Ref<string | null>;
const selected = ref("") as Ref<string | null>;
const options = ref(["BlogPost", "Audio Book"]);
const blogpost = ref("") as Ref<string | null>;
const pdfChunks = ref([]) as Ref<any[]>;

const fetchConversation = async (reference: string) => {
  const { data } = await useFetch(
    "/api/conversation/get?id=" + reference,
  ).json();
  const conversation = unref(data);
  state.currentConversation = conversation;
};

const fetchConversations = async () => {
  const { data } = await useFetch(
    "/api/conversation/list?user=" + state.user!.ref,
  ).json();
  state.conversations = unref(data).reverse();
  state.currentConversation = state.conversations[0];
  await fetchConversation(state.currentConversation.ref);
};

const useContentGenerator = async () => {
  if (
    !input.value ||
    !imgprompt.value ||
    !selected.value ||
    !state.user ||
    !state.currentConversation
  )
    return;
  const body: GenerateBlogPostWebsiteRequest = {
    blog_prompt: input.value as string,
    image_prompt: imgprompt.value as string,
    user: state.user!.ref as string,
    namespace: state.currentConversation!.ref,
  };
  const { data } = await useFetch("/api/content", {
    body: JSON.stringify(body),
    method: "POST",
  }).text();
  input.value = null;
  imgprompt.value = null;
  blogpost.value = unref(data) as string;
};

const deletePost = async (post: string) => {
  await useFetch("/api/content?id=" + post, {
    method: "DELETE",
  }).text();
  const conversation = state.currentConversation;
  state.currentConversation = null;
  state.currentConversation = conversation;
  window.location.reload();
};

const postPdf = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await useFetch("/api/pdf", {
    method: "POST",
    body: formData,
  }).json();
  pdfChunks.value = unref(data) as any[];
};

onMounted(async () => {
  await fetchConversations();
});
</script>

<style lang="scss">
.vhtml_wrapper {
  background: #ccc !important;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: #333;
  margin: 0;
  padding-left: 8em;
  padding-right: 16em;
  padding-top: 8em;
  padding-bottom: 8em;
  text-align: left;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  margin: 1rem;
  border-radius: 0.5rem;

  h1 {
    font-size: 2rem;
    line-height: 1.4;
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-family: "Inter", sans-serif;
  }

  h2 {
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    font-family: "Inter" !important;
    line-height: 28px;
    margin: 48px 0px;
    text-align: left;
  }

  img {
    max-width: 6rem;
    display: block;
    margin: 0 auto;
  }

  a {
    color: #ccc;
    text-decoration: underline;
  }

  blockquote {
    font-family: "Impact", sans-serif;
    margin-left: 0;
    padding-left: 1rem;
    border-left: 0.25rem solid #e2e8f0;
  }

  ul,
  ol {
    margin-top: 0;
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
}
</style>
