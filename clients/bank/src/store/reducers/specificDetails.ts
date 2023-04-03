import { BillObj, UserObj, UserWithBillInfoObj } from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';
import { ClearState } from './clearState';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export class LastWeekReport {
  public date: string;
  public billCounts: number;
  public billAmount: string;
  public userCounts: number;

  constructor({ date = '0', billCounts = 0, billAmount = '0', userCounts = 0 }: Partial<LastWeekReport> = {}) {
    this.date = date;
    this.billCounts = billCounts;
    this.billAmount = billAmount;
    this.userCounts = userCounts;
  }
}

export class TotalAmount {
  constructor(public totalAmount: string, public quantities: string) {}
}

export interface LastWeekBillsObj {
  count: number;
  amount: string;
  date: number;
}

export interface LastWeekUsersObj {
  count: number;
  date: number;
}

export class PeriodAmountFilter {
  constructor(public start: number, public end: number) {}
}

export class BillDates {
  constructor(public start: number, public end: number) {}
}

export class UserQuantities {
  constructor(public quantities: number, public adminQuantities: number, public userQuantities: number) {}
}

export interface SpecificDetailsState {
  user: UserObj | null;
  userWithBillInfo: UserWithBillInfoObj | null;
  bill: BillObj | null;
  totalAmount: TotalAmount | null;
  periodAmountFilter: PeriodAmountFilter | null;
  lastWeekBills: LastWeekBillsObj[];
  lastWeekUsers: LastWeekUsersObj[];
  billDates: BillDates | null;
  userQuantities: UserQuantities | null;
}

const initialState: SpecificDetailsState = {
  user: null,
  userWithBillInfo: null,
  bill: null,
  totalAmount: null,
  periodAmountFilter: null,
  lastWeekBills: [],
  lastWeekUsers: [],
  billDates: null,
  userQuantities: null,
};

function setSpecificDetails(state: SpecificDetailsState, action: SetSpecificDetailsAction): SpecificDetailsState {
  return {
    ...state,
    [action.payload.key]: action.payload.data,
  };
}

function cleanState(state: SpecificDetailsState): SpecificDetailsState {
  return {
    ...state,
    user: null,
    userWithBillInfo: null,
    bill: null,
    totalAmount: null,
    periodAmountFilter: null,
    lastWeekBills: [],
    lastWeekUsers: [],
    billDates: null,
    userQuantities: null,
  };
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
