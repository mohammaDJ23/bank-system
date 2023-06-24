import { createStore } from 'vuex';
import { requestProcessModule } from './modules/requestProcess';

export const store = createStore({ modules: { requestProcessModule } });
