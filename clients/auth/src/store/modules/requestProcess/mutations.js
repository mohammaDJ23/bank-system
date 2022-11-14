function cleanUpState(state, payload) {
  setTimeout(() => {
    delete state.loadings[payload];
    delete state.errors[payload];
  }, 5000);
}

export const mutations = {
  loading(state, payload) {
    state.loadings = Object.assign(state.loadings, payload);
  },

  success(state, payload) {
    cleanUpState(state, payload);
  },

  error(state, payload) {
    state.errors = Object.assign(state.errors, payload);
    cleanUpState(state, payload);
  },
};
