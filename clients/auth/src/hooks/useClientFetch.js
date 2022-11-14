import { useStore } from 'vuex';

export function useClientFetch() {
  const store = useStore();

  async function request(config) {}

  return { request };
}
