export const mutations = {
  loading(state, requestInstance) {
    const requestInstanceName = requestInstance.getConstructorName();
    state.loadings = Object.assign(state.loadings, { [requestInstanceName]: true });
    delete state.successes[requestInstanceName];
    delete state.errors[requestInstanceName];
  },

  success(state, requestInstance) {
    const requestInstanceName = requestInstance.getConstructorName();
    state.successes = Object.assign(state.successes, { [requestInstanceName]: true });
    delete state.loadings[requestInstanceName];
    delete state.errors[requestInstanceName];
  },

  error(state, requestInstance) {
    const requestInstanceName = requestInstance.getConstructorName();
    state.errors = Object.assign(state.errors, { [requestInstanceName]: true });
    delete state.loadings[requestInstanceName];
    delete state.successes[requestInstanceName];
  },
};
