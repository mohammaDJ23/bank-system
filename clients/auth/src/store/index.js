import { createStore } from 'vuex';
import { state } from './state';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

const authModule = { state, actions, mutations, getters };

export const store = createStore({ modules: { authModule } });
