import { ClearState } from '../reducers';

export interface ClearStateAction {
  type: ClearState.CLEAR_STATE;
}

export type ClearStateActions = ClearStateAction;

export function clearState(): ClearStateAction {
  return {
    type: ClearState.CLEAR_STATE,
  };
}
