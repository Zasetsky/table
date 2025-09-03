<script setup lang="ts">
import { ElButton } from "element-plus";
import { storeToRefs } from "pinia";
import { useItemsStore } from "~/stores/items";

const store = useItemsStore();
const { items, total, shownCount } = storeToRefs(store);

function selectAll() {
  store.toggleMany(
    items.value.map((i) => i.id),
    true
  );
}
function clearAll() {
  store.toggleMany(
    items.value.map((i) => i.id),
    false
  );
}
</script>

<template>
  <div class="flex items-center gap-3">
    <ElButton type="success" @click="selectAll"
      >Выбрать всё на странице</ElButton
    >
    <ElButton type="warning" @click="clearAll"
      >Снять выбор на странице</ElButton
    >

    <div class="ml-auto text-sm text-gray-500">
      Найдено: <b>{{ total }}</b> · Показано: <b>{{ shownCount }}</b>
    </div>
  </div>
</template>
