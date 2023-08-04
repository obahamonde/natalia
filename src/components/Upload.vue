<script setup lang="ts">
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: "*/*",
  },
  bucket: {
    type: String,
    default: "assets",
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

const handleInput = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = false;
  input.onchange = () => {
    onDrop(input.files![0]);
  };
  input.click();
};

const emit = defineEmits(["upload"]);
</script>
<template>
  <div class="col center">
    <label for="singleFile" name="file" class="dropzone" @click="handleInput">
      <div v-if="fileData">
        <slot :data="fileData"></slot>
      </div>
      <div v-else class="text-accent">Click to upload</div>
      <input
        type="file"
        :multiple="props.multiple"
        id="singleFile"
        class="hidden"
        :accept="props.accept"
      />
    </label>
    <button class="btn-get" @click="emit('upload', fileData!.file)">
      Upload
    </button>
  </div>
</template>
