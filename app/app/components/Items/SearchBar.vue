<script setup lang="ts">
import { ElInput, ElButton } from "element-plus";
import { computed } from "vue";
import { useItemsStore } from "~/stores/items";

const emit = defineEmits<{ (e: "search", q: string): void }>();

const store = useItemsStore();
const q = computed({
  get: () => store.q,
  set: (v: string) => (store.q = v),
});

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
      @keyup.enter="submit"
    />
    <ElButton type="primary" @click="submit">Найти</ElButton>
  </div>
</template>
