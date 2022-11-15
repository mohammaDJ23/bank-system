export const mutations = {
  loading(state, payload) {
    state.loadings = Object.assign(state.loadings, payload);
  },

  success(state, payload) {
    setTimeout(() => {
      delete state.loadings[payload];
    }, 5000);
  },
};
