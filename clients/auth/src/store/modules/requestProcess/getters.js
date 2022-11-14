export const getters = {
  getLoadings(state) {
    return state.loadings;
  },

  getErrors(state) {
    return state.errors;
  },

  getLoading(state) {
    return function (name) {
      return state.loadings[name];
    };
  },

  getError(state) {
    return function (name) {
      return state.errors[name];
    };
  },
};
