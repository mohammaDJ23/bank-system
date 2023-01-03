import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  historyReducer,
  listContainerReducer,
  modalReducer,
  requsetProcessReducer,
  specificDetailsReducer,
} from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  loadings: requsetProcessReducer,
  listContainer: listContainerReducer,
  history: historyReducer,
  specificDetails: specificDetailsReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
