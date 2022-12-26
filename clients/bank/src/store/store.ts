import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ListContainerReducer, modalReducer, requsetProcessReducer } from './reducers';

const reducers = combineReducers({
  modals: modalReducer,
  loadings: requsetProcessReducer,
  listContainer: ListContainerReducer,
});

export const store = createStore(reducers, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof reducers>;
