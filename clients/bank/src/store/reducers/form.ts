import { copyConstructor, Form as FormConstructor, forms } from '../../lib';
import { FormActions, OnChangeAction, ResetFormAction, SetFormAction } from '../actions/form';

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
  const { form, inputName, value } = action.payload;
  const copiedForm = copyConstructor(form);
  copiedForm[inputName] = value;
  newState[form.getConstructorName()] = copiedForm;
  return newState;
}

function resetForm(state: FormState, action: ResetFormAction): FormState {
  const newState = Object.assign<object, FormState>({}, state);
  const { form } = action.payload;
  const constructedForm = new form();
  newState[form.name] = constructedForm;
  return newState;
}

export function FormReducer(state: FormState = initialState, actions: FormActions): FormState {
  switch (actions.type) {
    case Form.SET_FORM:
      return setForm(state, actions);

    case Form.ON_CHANGE:
      return onChange(state, actions);

    case Form.RESET_FORM:
      return resetForm(state, actions);

    default:
      return state;
  }
}
