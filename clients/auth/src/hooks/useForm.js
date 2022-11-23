import { computed } from 'vue';
import { useStore } from 'vuex';
import { LocalStorage } from '../lib';

export function useForm(formSchema) {
  const store = useStore();

  const isFormProcessing = computed(
    () => store.state.requestProcessModule.loadings[formSchema.constructor.name],
  );

  function cacheInput(key, val) {
    LocalStorage.setItem(key, val);
  }

  return { isFormProcessing, cacheInput };
}
