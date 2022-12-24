import { RootActions } from '../actions';
import {
  ErrorAction,
  LoadingAction,
  RequestProcess,
  SuccessAction,
} from '../actions/requestProcess';

export interface RequestProcessState {
  [key: string]: boolean;
}

const initialState: RequestProcessState = {};

function loading(state: RequestProcessState, action: LoadingAction): RequestProcessState {
  return Object.assign({}, state, { [action.payload.name]: true });
}

function success(state: RequestProcessState, action: SuccessAction): RequestProcessState {
  delete state[action.payload.name];
  return Object.assign({}, state);
}

function error(state: RequestProcessState, action: ErrorAction): RequestProcessState {
  delete state[action.payload.name];
  return Object.assign({}, state);
}

export function requsetProcessReducer(
  state: RequestProcessState = initialState,
  actions: RootActions
): RequestProcessState {
  switch (actions.type) {
    case RequestProcess.LOADING:
      return loading(state, actions);

    case RequestProcess.SUCCESS:
      return success(state, actions);

    case RequestProcess.ERROR:
      return error(state, actions);

    default:
      return state;
  }
}
