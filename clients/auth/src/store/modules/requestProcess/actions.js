export const actions = {
  loading(context, payload) {
    context.commit('loading', payload);
  },

  success(context, payload) {
    context.commit('success', payload);
  },

  error(context, payload) {
    context.commit('error', payload);
  },
};
