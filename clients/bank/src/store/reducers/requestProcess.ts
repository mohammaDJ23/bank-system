import { RootActions } from '../actions';
import { ErrorAction, LoadingAction, SuccessAction } from '../actions/requestProcess';

export enum RequestProcess {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CLEAN = 'CLEAN',
}

export interface RequestProcessState {
  [key: string]: boolean;
}

const initialState: RequestProcessState = {};

function loading(state: RequestProcessState, action: LoadingAction): RequestProcessState {
  return Object.assign({}, state, { [action.payload.name]: true });
}

function success(state: RequestProcessState, action: SuccessAction): RequestProcessState {
  return Object.assign({}, state, { [action.payload.name]: false });
}

function error(state: RequestProcessState, action: ErrorAction): RequestProcessState {
  return Object.assign({}, state, { [action.payload.name]: false });
}

function clean() {
  return Object.assign({});
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

    case RequestProcess.CLEAN:
      return clean();

    default:
      return state;
  }
}
