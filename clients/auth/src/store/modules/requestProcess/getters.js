export const getters = {
  getLoadings(state) {
    return state.loadings;
  },

  getLoading(state) {
    return function (requestInstance) {
      return state.loadings[requestInstance.name];
    };
  },
};
