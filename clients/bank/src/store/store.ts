import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  historyReducer,
  listContainerReducer,
  modalReducer,
  requsetProcessReducer,
} from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  loadings: requsetProcessReducer,
  listContainer: listContainerReducer,
  history: historyReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
