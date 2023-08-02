<script setup lang="ts">
const input = ref("") as Ref<string | null>;

const { request, response, iserror, isloading } = useRequest();

const imgprompt = ref("") as Ref<string | null>;
const selected = ref("") as Ref<string | null>;
const options = ref(["BlogPost", "Audio Book"]);

const useContentGenerator = async () => {
  if (!input.value) return;
  await request(
    "/api/content?blog_promp=" +
      input.value +
      "image_prompt=" +
      imgprompt.value,
    {
      method: "POST",
    },
  );
  input.value = null;
  imgprompt.value = null;
};
</script>
<template>
  <main class="container col center">
    <transition name="input-fade">
      <section
        class="col center gap-4 sh backdrop-blur-md py-2 px-4 rounded bottom-4 absolute"
      >
        <input
          class="input"
          v-model="input"
          @keyup.enter="useContentGenerator"
          placeholder="Generate Blog Post"
        />
        <input
          class="input"
          v-if="selected === 'BlogPost'"
          v-model="imgprompt"
          @keyup.enter="useContentGenerator"
          placeholder="Generate Image"
        />
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
