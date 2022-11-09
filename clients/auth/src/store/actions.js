export const actions = {
  setForms(context, forms) {
    context.commit('setForms', forms);
  },

  changeInput(context, payload) {
    context.commit('changeInput', payload);
  },

  clearForm(context, instance) {
    context.commit('clearForm', instance);
  },

  removeForms(context, instance) {
    context.commit('removeForms', instance);
  },
};
