import { ResetApi, apis } from '../../../apis';
import { ElNotification } from 'element-plus';

export const actions = {
  async request(context, formSchema) {
    const formConstructorName = formSchema?.constructor?.name || '';

    try {
      context.commit('loading', { [formConstructorName]: true });

      if (typeof formSchema.beforeSubmit === 'function') formSchema.beforeSubmit(context);

      const restApi = new ResetApi();
      const res = await restApi.build(apis[formConstructorName](formSchema));

      if (typeof formSchema.afterSubmit === 'function') formSchema.afterSubmit(context, res);

      context.commit('success', formConstructorName);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong.';

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
