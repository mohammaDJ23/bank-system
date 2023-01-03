import { BillObj, UserObj } from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export interface SpecificDetailsState {
  user: UserObj | null;
  bill: BillObj | null;
}

const initialState: SpecificDetailsState = {
  user: null,
  bill: null,
};

function setSpecificDetails(
  state: SpecificDetailsState,
  action: SetSpecificDetailsAction
): SpecificDetailsState {
  return {
    ...state,
    [action.payload.key]: action.payload.data,
  };
}

export function specificDetailsReducer(
  state: SpecificDetailsState = initialState,
  actions: RootActions
): SpecificDetailsState {
  switch (actions.type) {
    case SpecificDetails.SET_SPECIFIC_DETAILS:
      return setSpecificDetails(state, actions);

    default:
      return state;
  }
}
