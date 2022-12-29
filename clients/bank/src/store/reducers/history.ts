import { BrowserHistory, MemoryHistory } from 'history';
import { RootActions } from '../actions';

export enum History {
  SET_HISTORY = 'SET_HISTORY',
}

export type HistoryState = MemoryHistory | BrowserHistory | null;

const initialState: HistoryState = null;

function setHistory(state: HistoryState, action: any): HistoryState {
  return action.payload.history;
}

export function historyReducer(
  state: HistoryState = initialState,
  actions: RootActions
): HistoryState {
  switch (actions.type) {
    case History.SET_HISTORY:
      return setHistory(state, actions);

    default:
      return state;
  }
}
