export const mutations = {
  setForms: function (state, forms) {
    for (let instance of forms) state[instance.name] = new instance();
  },
};
