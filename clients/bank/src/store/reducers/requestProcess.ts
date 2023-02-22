import { RootActions } from '../actions';
import { ErrorAction, LoadingAction, SuccessAction } from '../actions/requestProcess';
import { ClearState } from './clearState';

export enum RequestProcess {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CLEAN = 'CLEAN',
}

interface Process<T = boolean> {
  [key: string]: T;
}

export interface RequestProcessState {
  loadings: Process;
  errors: Process;
  successes: Process;
}

const initialState: RequestProcessState = {
  loadings: {},
  errors: {},
  successes: {},
};

function loading(state: RequestProcessState, action: LoadingAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.errors[requestName];
  delete newState.successes[requestName];
  newState.loadings = Object.assign<Process, Process>(newState.loadings, { [requestName]: true });
  return newState;
}

function success(state: RequestProcessState, action: SuccessAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.loadings[requestName];
  delete newState.errors[requestName];
  newState.successes = Object.assign<Process, Process>(newState.successes, { [requestName]: true });
  return newState;
}

function error(state: RequestProcessState, action: ErrorAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.loadings[requestName];
  delete newState.successes[requestName];
  newState.errors = Object.assign<Process, Process>(newState.errors, { [requestName]: true });
  return newState;
}

function clean(state: RequestProcessState) {
  return Object.assign<RequestProcessState, Partial<RequestProcessState>>(state, {
    loadings: {},
    errors: {},
    successes: {},
  });
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

    case ClearState.CLEAR_STATE:
    case RequestProcess.CLEAN:
      return clean(state);

    default:
      return state;
  }
}
