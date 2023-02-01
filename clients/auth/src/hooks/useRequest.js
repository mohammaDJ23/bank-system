import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import { Request } from '../apis';
import { computed } from 'vue';
import { RequestProcessingError } from '../lib';

export function useRequest() {
  const store = useStore();

  function currentApiProcessing(requestInstance) {
    return store.getters.getLoading(requestInstance);
  }

  function isCurrentApiProcessing(requestInstance) {
    return !!currentApiProcessing(requestInstance);
  }

  async function request(requestInstance) {
    try {
      if (isCurrentApiProcessing(requestInstance))
        throw new RequestProcessingError('The api is processing please wait.');
      store.dispatch('loading', requestInstance);
      const restApi = new Request(requestInstance);
      const res = await restApi.build();
      store.dispatch('success', requestInstance);
      return res;
    } catch (error) {
      let message = error?.response?.data?.message || error?.message || 'Something went wrong.';
      message = Array.isArray(message) ? message.join(' - ') : message;

      if (error instanceof RequestProcessingError)
        notification.warning({ message: 'Warning', description: message });
      else notification.error({ message: 'Error', description: message });

      store.dispatch('error', requestInstance);
      throw error;
    }
  }

  function isApiProcessing(requestInstance) {
    return computed(() => isCurrentApiProcessing(requestInstance));
  }

  return { request, isApiProcessing };
}
