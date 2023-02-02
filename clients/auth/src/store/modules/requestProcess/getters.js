export const getters = {
  getLoadings(state) {
    return state.loadings;
  },

  getLoading(state) {
    return function (requestInstance) {
      let requestInstanceName = '';
      if (typeof requestInstance === 'function') requestInstanceName = requestInstance.name;
      else if (typeof requestInstance === 'object')
        requestInstanceName = requestInstance.getConstructorName();
      return state.loadings[requestInstanceName];
    };
  },
};
