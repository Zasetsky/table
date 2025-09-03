<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { ElCard } from "element-plus";
import { storeToRefs } from "pinia";
import { useItemsStore } from "~/stores/items";
import Row from "./Row.vue";
import Loader from "~/components/Shared/Loader.vue";
import EmptyState from "~/components/Shared/EmptyState.vue";
import { useInfiniteObserver } from "~/composables/useInfiniteObserver";

const store = useItemsStore();
const { items, hasMore, loading } = storeToRefs(store);
const { target } = useInfiniteObserver(() => store.loadMore());

async function onEnd() {
  await store.applyReorder(items.value);
}
</script>

<template>
  <ElCard shadow="never">
    <div class="max-h-[60vh] overflow-y-auto overflow-x-auto max-w-full">
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-white z-10">
          <tr class="border-b">
            <th class="text-center p-3 w-12">✓</th>
            <th class="text-left p-3">Значение</th>
          </tr>
        </thead>

        <!-- Только на клиенте + fallback -->
        <ClientOnly>
          <Draggable
            :list="items"
            item-key="id"
            tag="tbody"
            ghost-class="bg-yellow-50"
            @end="onEnd"
          >
            <Row v-for="el in items" :key="el.id" :item="el" />
          </Draggable>
          <template #fallback>
            <tbody>
              <Row v-for="el in items" :key="el.id" :item="el" />
            </tbody>
          </template>
        </ClientOnly>
      </table>

      <EmptyState v-if="!loading && items.length === 0" />

      <div
        v-if="!hasMore && items.length > 0"
        class="p-4 text-center text-gray-500"
      >
        Больше элементов нет
      </div>

      <div ref="target" />
      <Loader v-if="loading" />
    </div>
  </ElCard>
</template>
