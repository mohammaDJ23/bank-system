export const actions = {
  setForms: function (context, forms) {
    context.commit('setForms', forms);
  },

  changeInput: function (context, payload) {
    context.commit('changeInput', payload);
  },
};
