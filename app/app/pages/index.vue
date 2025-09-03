<script setup lang="ts">
import { useItemsStore } from "~/stores/items";
import SearchBar from "~/components/Items/SearchBar.vue";
import Toolbar from "~/components/Items/Toolbar.vue";
import List from "~/components/Items/List.vue";

const store = useItemsStore();
const route = useRoute();
const router = useRouter();

await useAsyncData("items-init", async () => {
  const qFromUrl = typeof route.query.q === "string" ? route.query.q : "";
  if (qFromUrl) {
    store.q = qFromUrl;
  } else {
    await store.initFromServer();
  }
  await store.search(store.q);
  return store.items;
});

async function onSearch(q: string) {
  await router.replace({
    query: { ...route.query, q: q || undefined }, // удаляем параметр, если пустой
  });
  store.search(q);
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Тестовый список 1…1 000 000</h1>

    <SearchBar @search="onSearch" />
    <Toolbar />
    <List />
  </div>
</template>
