import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import { Request } from '../apis';
import { computed } from 'vue';

export function useRequest() {
  const store = useStore();

  async function request(requestInstance) {
    try {
      if (store.getters.getLoading(requestInstance)) throw new Error('The api is processing.');
      store.dispatch('loading', requestInstance);
      const restApi = new Request(requestInstance);
      const res = await restApi.build();
      store.dispatch('success', requestInstance);
      return res;
    } catch (error) {
      let message = error?.response?.data?.message || error?.message || 'Something went wrong.';
      message = Array.isArray(message) ? message.join(' - ') : message;
      notification.error({
        message: 'Error',
        description: message,
      });
      store.dispatch('error', requestInstance);
      throw error;
    }
  }

  function isApiProcessing(apiInstance) {
    return computed(() => !!store.getters.getLoading(apiInstance));
  }

  return { request, isApiProcessing };
}
