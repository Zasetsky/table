import { defineStore } from "pinia";
import type { Item, ItemsPage } from "~/types/api";
import { useApi } from "~/composables/useApi";
import { useGlobalLoading } from "~/composables/useGlobalLoading";

export const useItemsStore = defineStore("items", {
  state: () => ({
    q: "" as string,
    total: 0,
    limit: 20,
    items: [] as Item[],
    loading: false,
    hasMore: true,
    loadedIds: new Set<number>(),
  }),
  getters: {
    shownCount: (s) => s.items.length,
  },
  actions: {
    async search(q: string) {
      const { withLoading } = useGlobalLoading();
      await withLoading(async () => {
        this.q = q.trim();
        this.items = [];
        this.loadedIds = new Set();
        this.total = 0;
        this.hasMore = true;
        await this.loadMore(); // первый пакет после поиска
      }, "Поиск…");
    },

    async loadMore() {
      if (this.loading || !this.hasMore) return;
      this.loading = true;
      try {
        const { get } = useApi();
        const page = await get<ItemsPage>("/api/items", {
          offset: this.items.length,
          limit: this.limit,
          q: this.q,
        });
        this.total = page.total;
        for (const it of page.items) {
          if (!this.loadedIds.has(it.id)) {
            this.items.push(it);
            this.loadedIds.add(it.id);
          }
        }
        this.hasMore = this.items.length < this.total;
      } finally {
        this.loading = false;
      }
    },

    async toggleOne(id: number, selected: boolean) {
      const { post } = useApi();
      const { withLoading } = useGlobalLoading();
      await withLoading(
        post("/api/items/select", { ids: [id], selected }),
        selected ? "Выбираем…" : "Снимаем выбор…"
      );
      const idx = this.items.findIndex((x) => x.id === id);
      if (idx >= 0 && this.items[idx]) {
        this.items[idx].selected = selected;
      }
    },

    async toggleMany(ids: number[], selected: boolean) {
      const { post } = useApi();
      const { withLoading } = useGlobalLoading();
      await withLoading(
        post("/api/items/select", { ids, selected }),
        selected ? "Выбираем…" : "Снимаем выбор…"
      );
      const set = new Set(ids);
      this.items = this.items.map((x) =>
        set.has(x.id) ? { ...x, selected } : x
      );
    },

    async applyReorder(newOrder: Item[]) {
      const { post } = useApi();
      const { withLoading } = useGlobalLoading();
      await withLoading(
        post("/api/items/reorder", {
          q: this.q,
          orderedIds: newOrder.map((i) => i.id),
        }),
        "Сохраняем порядок…"
      );
      this.items = [...newOrder];
    },
  },
});
