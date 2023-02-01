export const mutations = {
  loading(state, requestInstance) {
    state.loadings = Object.assign(state.loadings, { [requestInstance.constructor.name]: true });
    delete state.successes[requestInstance.constructor.name];
    delete state.errors[requestInstance.constructor.name];
  },

  success(state, requestInstance) {
    state.successes = Object.assign(state.successes, { [requestInstance.constructor.name]: true });
    delete state.loadings[requestInstance.constructor.name];
    delete state.errors[requestInstance.constructor.name];
  },

  error(state, requestInstance) {
    state.errors = Object.assign(state.errors, { [requestInstance.constructor.name]: true });
    delete state.loadings[requestInstance.constructor.name];
    delete state.successes[requestInstance.constructor.name];
  },
};
