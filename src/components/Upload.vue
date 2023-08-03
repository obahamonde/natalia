<script setup lang="ts">
const { state } = useStore();

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: "*/*",
  },
});

const fileData = ref<{
  name: string;
  size: number;
  contentType: string;
  lastModified: number;
  url: string;
  file: File;
}>();

function onDrop(file: File | null) {
  if (!file) return;
  if (file) {
    fileData.value = {
      name: file.name,
      size: file.size,
      contentType: file.type,
      lastModified: file.lastModified,
      url: URL.createObjectURL(file),
      file: file,
    };
  }
}

const uploadFile = ref();

const handleInput = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = false;
  input.onchange = () => {
    onDrop(input.files![0]);
  };
  input.click();
};

const upload = async (file: {
  name: string;
  size: number;
  contentType: string;
  lastModified: number;
  url: string;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("file", file.file);
  const { data } = await useFetch(
    `/api/assets/${state.currentConversation!.ref!}?size=${file.size
    }&bucket=assets&user=${state.user!.ref}`,
    {
      method: "POST",
      body: formData,
    },
  ).json();
  const item = unref(data) as any;
  uploadFile.value = item;
};
</script>
<template>
      <div class="col center">
        <label for="singleFile" name="file" class="dropzone" @click="handleInput">
          <div v-if="fileData">
            <slot :data="fileData"></slot>
          </div>
          <div v-else>Click to upload</div>
          <input
            type="file"
            :multiple="props.multiple"
            id="singleFile"
            class="hidden"
            :accept="props.accept"
          />
        </label>
        <button
          class="btn-get"
          @click="
            upload(fileData!);
          $emit('close');
          "
        >
        Upload
    </button>
  </div>
</template>
