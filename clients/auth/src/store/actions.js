export const actions = {
  setForms: function (context, forms) {
    context.commit('setForms', forms);
  },

  changeForm: function (context, payload) {
    context.commit('changeForm', payload);
  },
};
