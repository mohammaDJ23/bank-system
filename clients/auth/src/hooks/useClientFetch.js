import { useStore } from 'vuex';

export function useClientFetch() {
  const store = useStore();

  async function request(formSchema) {
    store.dispatch('request', formSchema);
  }

  return { request };
}
