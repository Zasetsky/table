export function useInfiniteObserver(callback: () => void) {
  const target = ref<HTMLElement | null>(null);
  let obs: IntersectionObserver | null = null;

  onMounted(() => {
    obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && callback()),
      { rootMargin: "200px" }
    );
    if (target.value) obs.observe(target.value);
  });

  onBeforeUnmount(() => {
    if (obs && target.value) obs.unobserve(target.value);
    obs = null;
  });

  return { target };
}
