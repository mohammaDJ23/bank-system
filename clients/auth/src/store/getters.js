export const getters = {
  getForms: function (state) {
    return state;
  },

  getForm: function (state) {
    return function (instance) {
      return state[instance.name];
    };
  },

  getInput: function (state) {
    return function (instance, inputName) {
      return state[instance.name][inputName];
    };
  },
};
