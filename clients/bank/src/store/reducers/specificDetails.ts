import { BillObj, UserObj } from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';
import { ClearState } from './clearState';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export class TotalAmount {
  constructor(public totalAmount: string = '0', public quantities: string = '0') {}
}

export interface BillsLastWeekObj {
  count: number;
  amount: string;
  date: number;
}

export interface LastWeekUsersObj {
  count: number;
  date: number;
}

export class PeriodAmountFilter {
  constructor(public start: number = 0, public end: number = 0) {}
}

export class BillDates {
  constructor(public start: number = 0, public end: number = 0) {}
}

export class UserQuantities {
  constructor(public quantities: number, public adminQuantities: number, public userQuantities: number) {}
}

export interface SpecificDetailsState {
  user: UserObj | null;
  bill: BillObj | null;
  totalAmount: TotalAmount;
  periodAmountFilter: PeriodAmountFilter;
  billsLastWeek: BillsLastWeekObj[];
  lastWeekUsers: LastWeekUsersObj[];
  billDates: BillDates;
  userQuantities: UserQuantities | null;
}

const initialState: SpecificDetailsState = {
  user: null,
  bill: null,
  totalAmount: new TotalAmount(),
  periodAmountFilter: new PeriodAmountFilter(),
  billsLastWeek: [],
  lastWeekUsers: [],
  billDates: new BillDates(),
  userQuantities: null,
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
