export type Item = { id: number; selected: boolean };

export type ItemsPage = {
  items: Item[];
  total: number;
  offset: number;
  limit: number;
  q: string;
};

export type SelectResponse = { ok: true; selectedCount: number };
export type ReorderResponse = { ok: true };
