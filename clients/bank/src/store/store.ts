import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  historyReducer,
  listContainerReducer,
  modalReducer,
  requsetProcessReducer,
  specificDetailsReducer,
  paginationListReducer,
  FormReducer,
} from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  requestProcess: requsetProcessReducer,
  listContainer: listContainerReducer,
  history: historyReducer,
  specificDetails: specificDetailsReducer,
  paginationList: paginationListReducer,
  form: FormReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
