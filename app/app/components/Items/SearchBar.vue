<script setup lang="ts">
import { ElInput, ElButton } from "element-plus";

const emit = defineEmits<{ (e: "search", q: string): void }>();
const q = ref("");
function submit() {
  emit("search", q.value);
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <ElInput
      v-model="q"
      placeholder="Поиск по подстроке (например, 123)"
      style="width: 320px"
    />
    <ElButton type="primary" @click="submit">Найти</ElButton>
  </div>
</template>
