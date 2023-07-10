import { SpecificDetails, SpecificDetailsState } from '../reducers';

type SpecificDetailsKeys = keyof SpecificDetailsState;
type SpecificDetailsVal = SpecificDetailsState[SpecificDetailsKeys];

export interface SetSpecificDetailsAction {
  type: SpecificDetails.SET_SPECIFIC_DETAILS;
  payload: { key: SpecificDetailsKeys; data: SpecificDetailsVal };
}

export type SpecificDetailsActions = SetSpecificDetailsAction;

export function setSpecificDetails(key: SpecificDetailsKeys, data: SpecificDetailsVal) {
  return {
    type: SpecificDetails.SET_SPECIFIC_DETAILS,
    payload: { key, data },
  };
}
