import { BillObj, getTime, UserObj } from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';
import { ClearState } from './clearState';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export interface TotalAmountObj {
  totalAmount: string;
}

export interface PeriodAmountObj {
  totalAmount: string;
}

export interface BillsLastWeekObj {
  count: number;
  amount: string;
  date: number;
}

export class PeriodAmountFilter {
  constructor(public start: number = getTime(Date.now() - 7 * 24 * 60 * 60 * 1000), public end: number = getTime()) {}
}

export class BillDates {
  constructor(public start: number = getTime(Date.now() - 7 * 24 * 60 * 60 * 1000), public end: number = getTime()) {}
}

export interface SpecificDetailsState {
  user: UserObj | null;
  bill: BillObj | null;
  totalAmount: TotalAmountObj | null;
  periodAmount: PeriodAmountObj | null;
  periodAmountFilter: PeriodAmountFilter;
  billsLastWeek: BillsLastWeekObj[] | null;
  billDates: BillDates;
}

const initialState: SpecificDetailsState = {
  user: null,
  bill: null,
  totalAmount: null,
  periodAmount: null,
  periodAmountFilter: new PeriodAmountFilter(),
  billsLastWeek: null,
  billDates: new BillDates(),
};

function setSpecificDetails(state: SpecificDetailsState, action: SetSpecificDetailsAction): SpecificDetailsState {
  return {
    ...state,
    [action.payload.key]: action.payload.data,
  };
}

function cleanState(state: SpecificDetailsState): SpecificDetailsState {
  return { ...state, user: null, bill: null };
}

export function specificDetailsReducer(
  state: SpecificDetailsState = initialState,
  actions: RootActions
): SpecificDetailsState {
  switch (actions.type) {
    case SpecificDetails.SET_SPECIFIC_DETAILS:
      return setSpecificDetails(state, actions);

    case ClearState.CLEAR_STATE:
      return cleanState(state);

    default:
      return state;
  }
}
