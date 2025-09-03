export const ONE_MILLION = 1_000_000;

// Итератор по возрастанию, совпадающие с подстрокой q
export function* ascendingIdsMatching(q: string): Generator<number> {
  const needle = q.trim();
  const noQ = needle.length === 0;
  for (let i = 1; i <= ONE_MILLION; i++) {
    if (noQ || i.toString().includes(needle)) yield i;
  }
}
