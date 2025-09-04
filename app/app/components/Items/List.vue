<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { ElCard } from "element-plus";
import { storeToRefs } from "pinia";
import { useItemsStore } from "~/stores/items";
import Row from "./Row.vue";
import Loader from "~/components/Shared/Loader.vue";
import EmptyState from "~/components/Shared/EmptyState.vue";
import { useInfiniteObserver } from "~/composables/useInfiniteObserver";

type DnDEvent = { oldIndex?: number | null; newIndex?: number | null };

const store = useItemsStore();
const { items, hasMore, loading } = storeToRefs(store);
const scroller = ref<HTMLElement | null>(null);

const { target } = useInfiniteObserver(() => store.loadMore(), {
  root: scroller,
  rootMargin: "10px",
  threshold: 0,
});

// утилита для построения «предыдущего» порядка (для отката)
function moveBack<T>(arr: T[], from: number, to: number): T[] {
  // нормализуем индексы
  if (from === to) return arr.slice();
  if (from < 0 || from >= arr.length) return arr.slice();
  const toClamped = Math.max(0, Math.min(to, arr.length - 1));

  const a = arr.slice();
  const removed = a.splice(from, 1);
  const el = removed[0];
  if (el === undefined) return arr.slice(); // ничего не меняем

  a.splice(toClamped, 0, el);
  return a;
}

async function onEnd(evt: DnDEvent) {
  if (evt.newIndex == null || evt.oldIndex == null) return;

  const newIndex = evt.newIndex;
  const oldIndex = evt.oldIndex;

  // к этому моменту items уже в новом порядке
  const moved = items.value[newIndex];
  if (!moved) return;

  const anchor = newIndex > 0 ? items.value[newIndex - 1] : null;
  const movedId = moved.id;
  const afterId = anchor ? anchor.id : null;

  const prevOrder = moveBack(items.value, newIndex, oldIndex);

  await store.applyReorder(movedId, afterId, prevOrder);
}
</script>

<template>
  <ElCard shadow="never">
    <div
      ref="scroller"
      class="max-h-[60vh] overflow-y-auto overflow-x-auto max-w-full"
    >
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-white z-10">
          <tr class="border-b">
            <th class="text-center p-3 w-12">✓</th>
            <th class="text-left p-3">Значение</th>
          </tr>
        </thead>

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
