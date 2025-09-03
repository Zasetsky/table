<script setup lang="ts">
import { useItemsStore } from "~/stores/items";
import SearchBar from "~/components/Items/SearchBar.vue";
import Toolbar from "~/components/Items/Toolbar.vue";
import List from "~/components/Items/List.vue";

const store = useItemsStore();

await useAsyncData("items-init", async () => {
  await store.search("");
  return store.items;
});

function onSearch(q: string) {
  store.search(q);
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Тестовый список 1…1 000 000</h1>

    <SearchBar @search="onSearch" />
    <Toolbar />
    <List />

    <p class="text-xs text-gray-500">
      * Порядок и выбор сохраняются на сервере (сессия). После перезагрузки —
      первые 20 в сохранённом порядке, остальные по скроллу.
    </p>
  </div>
</template>
