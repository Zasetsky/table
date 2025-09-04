export function useInfiniteObserver(
  onIntersect: () => void | Promise<void>,
  opts?: {
    root?: Ref<HTMLElement | null>;
    rootMargin?: string;
    threshold?: number | number[];
  }
) {
  const target = ref<HTMLElement | null>(null);
  let io: IntersectionObserver | null = null;

  const makeObserver = () => {
    if (io) {
      io.disconnect();
      io = null;
    }
    const rootEl = opts?.root?.value ?? null;
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onIntersect();
      },
      {
        root: rootEl,
        rootMargin: opts?.rootMargin ?? "100px",
        threshold: opts?.threshold ?? 0,
      }
    );
    if (target.value) io.observe(target.value);
  };

  onMounted(() => {
    makeObserver();
    if (opts?.root) {
      // если root появится позже (ref на DOM) — пересоберём
      watch(opts.root, () => makeObserver(), { flush: "post" });
    }
    watch(target, () => makeObserver(), { flush: "post" });
  });

  onBeforeUnmount(() => {
    if (io) io.disconnect();
  });

  return { target };
}
