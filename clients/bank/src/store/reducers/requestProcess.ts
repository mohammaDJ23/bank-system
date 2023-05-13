import { RootActions } from '../actions';
import {
  InitialProcessingApiErrorAction,
  InitialProcessingApiLoadingAction,
  InitialProcessingApiSuccessAction,
  ProcessingApiErrorAction,
  ProcessingApiLoadingAction,
  ProcessingApiSuccessAction,
} from '../actions/requestProcess';
import { ClearState } from './clearState';

export enum RequestProcess {
  PROCESSING_API_LOADING = 'PROCESSING_API_LOADING',
  PROCESSING_API_SUCCESS = 'PROCESSING_API_SUCCESS',
  PROCESSING_API_ERROR = 'PROCESSING_API_ERROR',
  INITIAL_PROCESSING_API_LOADING = 'INITIAL_PROCESSING_API_LOADING',
  INITIAL_PROCESSING_API_SUCCESS = 'INITIAL_PROCESSING_API_SUCCESS',
  INITIAL_PROCESSING_API_ERROR = 'INITIAL_PROCESSING_API_ERROR',
}

interface Process<T = boolean> {
  [key: string]: T;
}

interface ProcessingApi {
  loadings: Process;
  errors: Process;
  successes: Process;
}

export interface RequestProcessState {
  processingApis: ProcessingApi;
  initialProcessingApis: ProcessingApi;
}

const processingApi = { loadings: {}, errors: {}, successes: {} };

const initialState: RequestProcessState = {
  processingApis: processingApi,
  initialProcessingApis: processingApi,
};

function processingApiLoading(state: RequestProcessState, action: ProcessingApiLoadingAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.processingApis.errors[requestName];
  delete newState.processingApis.successes[requestName];
  return {
    ...newState,
    processingApis: {
      ...newState.processingApis,
      loadings: {
        ...newState.processingApis.loadings,
        [requestName]: true,
      },
    },
  };
}

function processingApiSuccess(state: RequestProcessState, action: ProcessingApiSuccessAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.processingApis.loadings[requestName];
  delete newState.processingApis.errors[requestName];
  return {
    ...newState,
    processingApis: {
      ...newState.processingApis,
      successes: {
        ...newState.processingApis.successes,
        [requestName]: true,
      },
    },
  };
}

function processingApiError(state: RequestProcessState, action: ProcessingApiErrorAction): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.processingApis.loadings[requestName];
  delete newState.processingApis.successes[requestName];
  return {
    ...newState,
    initialProcessingApis: {
      ...newState.initialProcessingApis,
      errors: {
        ...newState.initialProcessingApis.errors,
        [requestName]: true,
      },
    },
  };
}

function initialProcessingApiLoading(
  state: RequestProcessState,
  action: InitialProcessingApiLoadingAction
): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.initialProcessingApis.errors[requestName];
  delete newState.initialProcessingApis.successes[requestName];
  return {
    ...newState,
    initialProcessingApis: {
      ...newState.initialProcessingApis,
      loadings: {
        ...newState.initialProcessingApis.loadings,
        [requestName]: true,
      },
    },
  };
}

function initialProcessingApiSuccess(
  state: RequestProcessState,
  action: InitialProcessingApiSuccessAction
): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.initialProcessingApis.loadings[requestName];
  delete newState.initialProcessingApis.errors[requestName];
  return {
    ...newState,
    initialProcessingApis: {
      ...newState.initialProcessingApis,
      successes: {
        ...newState.initialProcessingApis.successes,
        [requestName]: true,
      },
    },
  };
}

function initialProcessingApiError(
  state: RequestProcessState,
  action: InitialProcessingApiErrorAction
): RequestProcessState {
  const requestName = action.payload.name;
  const newState = Object.assign<object, RequestProcessState>({}, state);
  delete newState.initialProcessingApis.loadings[requestName];
  delete newState.initialProcessingApis.successes[requestName];
  return {
    ...newState,
    initialProcessingApis: {
      ...newState.initialProcessingApis,
      errors: {
        ...newState.initialProcessingApis.errors,
        [requestName]: true,
      },
    },
  };
}

function clean(state: RequestProcessState) {
  return Object.assign<RequestProcessState, Partial<RequestProcessState>>(state, {
    processingApis: { loadings: {}, errors: {}, successes: {} },
    initialProcessingApis: { loadings: {}, errors: {}, successes: {} },
  });
}

export function requsetProcessReducer(
  state: RequestProcessState = initialState,
  actions: RootActions
): RequestProcessState {
  switch (actions.type) {
    case RequestProcess.PROCESSING_API_LOADING:
      return processingApiLoading(state, actions);

    case RequestProcess.PROCESSING_API_SUCCESS:
      return processingApiSuccess(state, actions);

    case RequestProcess.PROCESSING_API_ERROR:
      return processingApiError(state, actions);

    case RequestProcess.INITIAL_PROCESSING_API_LOADING:
      return initialProcessingApiLoading(state, actions);

    case RequestProcess.INITIAL_PROCESSING_API_SUCCESS:
      return initialProcessingApiSuccess(state, actions);

    case RequestProcess.INITIAL_PROCESSING_API_ERROR:
      return initialProcessingApiError(state, actions);

    case ClearState.CLEAR_STATE:
      return clean(state);

    default:
      return state;
  }
}
