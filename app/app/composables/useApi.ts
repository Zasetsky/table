export function useApi() {
  const {
    public: { apiBase },
  } = useRuntimeConfig();

  // Только на сервере берём входной Cookie и передаём его на бэкенд,
  // чтобы SSR видел ту же сессию, что и браузер.
  const reqCookie = import.meta.server
    ? useRequestHeaders(["cookie"]).cookie
    : undefined;

  const api = $fetch.create({
    baseURL: apiBase,
    credentials: "include",
    headers: reqCookie ? { cookie: reqCookie } : undefined,
    onResponseError({ response }) {
      console.error("API error", response.status, response._data);
    },
  });

  return {
    get<T>(path: string, query?: Record<string, any>) {
      return api<T>(path, { method: "GET", query });
    },
    post<T>(path: string, body?: any) {
      return api<T>(path, { method: "POST", body });
    },
  };
}
