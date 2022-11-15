import { ResetApi, apis } from '../../../apis';
import { ElNotification } from 'element-plus';

export const actions = {
  async request(context, formSchema) {
    const formConstructorName = formSchema?.constructor?.name || '';

    try {
      if (context.getters.getLoading(formConstructorName)) return;

      context.commit('loading', { [formConstructorName]: true });

      if (typeof formSchema.beforeSubmit === 'function') formSchema.beforeSubmit(context);

      const restApi = new ResetApi();
      const res = await restApi.build(apis[formConstructorName](formSchema));

      if (typeof formSchema.afterSubmit === 'function') formSchema.afterSubmit(context, res);

      context.commit('success', formConstructorName);
    } catch (error) {
      let message = error?.response?.data?.message || error?.message || 'Something went wrong.';
      message = Array.isArray(message) ? message.join(' - ') : message;

      ElNotification({
        title: 'Error',
        message,
        type: 'error',
      });
    } finally {
      context.commit('loading', { [formConstructorName]: false });
    }
  },
};
