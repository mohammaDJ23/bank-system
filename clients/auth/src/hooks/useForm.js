import { computed } from 'vue';
import { useStore } from 'vuex';

export function useForm(form) {
  const store = useStore();

  const isFormProcessing = computed(
    () => !!store.state.requestProcessModule.loadings[form.constructor.name]
  );

  return { isFormProcessing };
}
