<template>
  <section class="col center" v-if="state.user && state.user.ref">
    <Request :url="'/api/content?user=' + state.user.ref">
      <template #default="{ json }">
        <div v-for="post in json">
          <p v-html="post" class="vhtml_wrapper"></p>
        </div>
      </template>
    </Request>
  </section>

  <main class="container col center bottom-4">
    <transition name="input-fade">
      <section
        class="col center gap-4 sh backdrop-blur-md py-2 px-4 rounded bottom-4 absolute"
      >
        <input
          class="input"
          v-model="input"
          @keyup.enter="useContentGenerator"
          :placeholder="
            selected === 'BlogPost'
              ? 'Enter a Blog Prompt'
              : 'Enter an Audio Book Prompt'
          "
        />
        <input
          class="input"
          v-if="selected === 'BlogPost'"
          v-model="imgprompt"
          @keyup.enter="useContentGenerator"
          placeholder="Generate Image"
        />
        <Upload v-else>
          <template #default="{ data }">
            <div>{{ data }}</div>
          </template>
        </Upload>

        <select class="input text-accent dark:text-success" v-model="selected">
          <option
            class="text-accent dark:text-success"
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
</script>

<style lang="scss">
.vhtml_wrapper {
  background: #f8f8f8 !important;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: #333;
  margin: 0;
  padding-left: 8em;
  padding-right: 8em;
  text-align: left;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  margin-bottom: 1rem;

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
    margin: 16px 0px;
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
