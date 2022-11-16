import { computed } from 'vue';
import { useStore } from 'vuex';

export function useForm(formSchema) {
  const store = useStore();

  const isFormProcessing = computed(
    () => store.state.requestProcessModule.loadings[formSchema.constructor.name],
  );

  return { isFormProcessing };
}
