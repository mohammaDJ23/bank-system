import { Constructor } from '../../lib';
import { Form, FormType } from '../reducers';

export interface SetFormAction<T = {}> {
  type: Form.SET_FORM;
  payload: { form: FormType<T> };
}

export interface OnChangeAction<T = {}> {
  type: Form.ON_CHANGE;
  payload: { form: Constructor<FormType<T>>; key: keyof FormType<T>; value: any };
}

export interface ResetFormAction<T = {}> {
  type: Form.RESET_FORM;
  payload: { form: Constructor<FormType<T>> };
}

export type FormActions = SetFormAction | OnChangeAction | ResetFormAction;

export function setForm<T>(form: SetFormAction<T>['payload']['form']): SetFormAction<T> {
  return {
    type: Form.SET_FORM,
    payload: { form },
  };
}

export function onChange<T>({ form, key, value }: OnChangeAction<T>['payload']): OnChangeAction<T> {
  return {
    type: Form.ON_CHANGE,
    payload: { form, key, value },
  };
}

export function resetForm<T>(form: ResetFormAction<T>['payload']['form']): ResetFormAction<T> {
  return {
    type: Form.RESET_FORM,
    payload: { form },
  };
}
