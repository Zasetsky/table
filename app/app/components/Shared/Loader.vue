<script setup lang="ts">
import { ElIcon } from "element-plus";
import { Loading } from "@element-plus/icons-vue";

defineProps<{
  text?: string;
  size?: number | string;
  inline?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      inline ? 'inline-flex' : 'flex',
      'items-center justify-center gap-2 text-gray-500',
      inline ? '' : 'p-8',
    ]"
    aria-busy="true"
  >
    <ElIcon class="is-loading" :size="size ?? 20">
      <Loading />
    </ElIcon>
    <span>{{ text ?? "Загрузка…" }}</span>
  </div>
</template>
