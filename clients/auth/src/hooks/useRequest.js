import { useStore } from 'vuex';
import { Request } from '../apis';
import { computed } from 'vue';
import { RequestProcessingError } from '../lib';
import { useNotification } from '@kyvg/vue3-notification';

export function useRequest() {
  const store = useStore();
  const { notify } = useNotification();

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

      if (error instanceof RequestProcessingError) notify({ text: message, title: 'Warn', type: 'warn' });
      else notify({ text: message, title: 'Error', type: 'error' });

      store.dispatch('error', requestInstance);
      throw error;
    }
  }

  function isApiProcessing(requestInstance) {
    return computed(() => isCurrentApiProcessing(requestInstance));
  }

  return { request, isApiProcessing };
}
