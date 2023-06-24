import { copyConstructor, Form as FormConstructor, forms, InputValidation } from '../../lib';
import { RootActions } from '../actions';
import { OnChangeAction, ResetFormAction, SetFormAction } from '../actions/form';
import { ClearState } from './clearState';

export enum Form {
  SET_FORM = 'SET_FORM',
  ON_CHANGE = 'ON_CHANGE',
  RESET_FORM = 'RESET_FORM',
}

export type FormType<T = {}> = T & FormConstructor;

interface FormState<T = {}> {
  [key: string]: FormType<T>;
}

function makeFormsState(): FormState {
  let state: FormState = {};
  for (const formName in forms) state[formName] = new forms[formName as keyof typeof forms]();
  return state;
}

const initialState: FormState = makeFormsState();

function setForm(state: FormState, action: SetFormAction): FormState {
  const newState = Object.assign<object, FormState>({}, state);
  const form = action.payload.form;
  newState[form.getConstructorName()] = form;
  return newState;
}

function onChange(state: FormState, action: OnChangeAction): FormState {
  const newState = Object.assign<object, FormState>({}, state);
  const { form, key, value } = action.payload;
  const copiedForm = copyConstructor(newState[form.name]);
  copiedForm[key] = value;
  newState[copiedForm.getConstructorName()] = copiedForm;

  let errorMessage: string | undefined;
  let inputValidation: InputValidation | undefined;

  for (const applyValidation of copiedForm.getRule(key)) {
    errorMessage = applyValidation(value) ?? '';
    inputValidation = copiedForm.getInputValidation(key);
    inputValidation.isValid = !!!errorMessage;
    inputValidation.errorMessage = errorMessage;
    if (inputValidation.isValid) copiedForm.cachInput(key, value);
    else copiedForm.clearCachedInput(key);
  }

  return newState;
}

function resetForm(state: FormState, action: ResetFormAction): FormState {
  const newState = Object.assign<object, FormState>({}, state);
  const { form } = action.payload;
  const constructedForm = new form();
  constructedForm.resetCach();
  newState[form.name] = constructedForm;
  return newState;
}

function cleanState(): FormState {
  return makeFormsState();
}

export function FormReducer(state: FormState = initialState, actions: RootActions): FormState {
  switch (actions.type) {
    case Form.SET_FORM:
      return setForm(state, actions);

    case Form.ON_CHANGE:
      return onChange(state, actions);

    case Form.RESET_FORM:
      return resetForm(state, actions);

    case ClearState.CLEAR_STATE:
      return cleanState();

    default:
      return state;
  }
}
