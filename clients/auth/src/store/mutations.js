export const mutations = {
  setForms(state, forms) {
    for (let instance of forms) state[instance.name] = new instance();
  },

  changeInput(state, { instance, inputName, value }) {
    const form = state[instance.name];

    if (!form) throw new Error('Invalid instance.');
    if (!(inputName in form)) throw new Error('Invalid input.');

    form[inputName] = value;
  },

  clearForm(state, instance) {
    const form = state[instance.name];

    if (!form) throw new Error('Invalid instance.');

    const pureForm = new instance();

    for (let input in pureForm) form[input] = pureForm[input];
  },

  removeForm(state, instance) {
    if (!state[instance.name]) throw new Error('Invalid instance.');

    delete state[instance.name];
  },
};
