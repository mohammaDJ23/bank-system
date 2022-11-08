export const mutations = {
  setForms: function (state, forms) {
    for (let instance of forms) state[instance.name] = new instance();
  },

  changeInput: function (state, { instance, inputName, value }) {
    const form = state[instance.name];

    if (!form) throw new Error('Invalid instance.');
    if (!form[inputName]) throw new Error('Invalid input.');

    form[inputName] = value;
  },

  clearForm: function (state, instance) {
    const form = state[instance.name];

    if (!form) throw new Error('Invalid instance.');

    const pureForm = new instance();

    for (let input in pureForm) form[input] = pureForm[input];
  },
};
