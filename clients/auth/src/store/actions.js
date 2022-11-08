export const actions = {
  setForms: function (context, forms) {
    context.commit('setForms', forms);
  },

  changeInput: function (context, payload) {
    context.commit('changeInput', payload);
  },

  clearForm: function (context, instance) {
    context.commit('clearForm', instance);
  },

  removeForm: function (context, instance) {
    context.commit('removeForm', instance);
  },
};
