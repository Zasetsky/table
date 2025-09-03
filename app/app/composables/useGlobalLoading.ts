import { ElLoading } from "element-plus";

export function useGlobalLoading() {
  if (!import.meta.client) {
    const no = async <T>(x: (() => Promise<T>) | Promise<T>) =>
      typeof x === "function" ? (x as () => Promise<T>)() : x;
    return {
      open: (_text?: string) => void 0,
      close: () => void 0,
      withLoading: no,
    };
  }

  let inst: ReturnType<typeof ElLoading.service> | null = null;

  function open(text = "Загрузка…") {
    close();
    inst = ElLoading.service({
      lock: true,
      fullscreen: true,
      text,
      background: "rgba(255,255,255,0.6)",
    });
  }

  function close() {
    if (inst) {
      inst.close();
      inst = null;
    }
  }

  async function withLoading<T>(
    fnOrPromise: (() => Promise<T>) | Promise<T>,
    text?: string
  ): Promise<T> {
    open(text);
    try {
      const res =
        typeof fnOrPromise === "function"
          ? await (fnOrPromise as () => Promise<T>)()
          : await fnOrPromise;
      return res;
    } finally {
      close();
    }
  }

  return { open, close, withLoading };
}
