export const getters = {
  getLoadings(state) {
    return state.loadings;
  },

  getLoading(state) {
    return function (name) {
      return state.loadings[name];
    };
  },
};
