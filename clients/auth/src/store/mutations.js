export const mutations = {
  setForms: function (state, forms) {
    for (let instance of forms) state[instance.name] = new instance();
  },

  changeForm: function (state, { instance, inputName, value }) {
    const form = state[instance.name];

    if (!form) throw new Error('Invalid instance.');
    if (!form[inputName]) throw new Error('Invalid input.');

    form[inputName] = value;
  },
};
