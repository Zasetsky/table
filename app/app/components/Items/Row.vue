<script setup lang="ts">
import type { Item } from "~/types/api";
import { useItemsStore } from "~/stores/items";

const props = defineProps<{ item: Item }>();
const store = useItemsStore();

function toggle(e: Event) {
  const on = (e.target as HTMLInputElement).checked;
  store.toggleOne(props.item.id, on);
}
</script>

<template>
  <tr class="border-b hover:bg-gray-50 cursor-grab select-none">
    <td class="p-3 w-12 text-center">
      <input type="checkbox" :checked="item.selected" @change="toggle" />
    </td>
    <td class="p-3 flex items-center gap-2">
      <span aria-hidden="true" class="opacity-50">≡</span>
      <span>{{ item.id }}</span>
    </td>
  </tr>
</template>
