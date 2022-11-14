import { createStore } from 'vuex';
import { authModule } from './modules/auth';

export const store = createStore({ modules: { authModule } });
