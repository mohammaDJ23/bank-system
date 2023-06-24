import { BrowserHistory, MemoryHistory } from 'history';
import { History } from '../reducers';

export interface SetHistoryAction {
  type: History.SET_HISTORY;
  payload: { history: MemoryHistory | BrowserHistory };
}

export type HistoryActions = SetHistoryAction;

export function setHistory(history: MemoryHistory | BrowserHistory) {
  return {
    type: History.SET_HISTORY,
    payload: { history },
  };
}
