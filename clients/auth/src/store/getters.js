export const getters = {
  getForms(state) {
    return state;
  },

  getForm(state) {
    return function (instance) {
      return state[instance.name];
    };
  },

  getInput(state) {
    return function (instance, inputName) {
      return state[instance.name][inputName];
    };
  },
};
