import { FormMetadataTypes } from '.';

export interface InputValidation {
  isValid: boolean;
  errorMessage: string;
}

export type InputsValidation = Record<string, InputValidation>;

export function getInputValidation(prop: string, target: any): InputValidation {
  return Reflect.getMetadata(prop, target) || {};
}

export function setInputValidation(prop: string, value: any, target: any) {
  Reflect.defineMetadata(prop, value, target);
}

export function getInputsValidation(target: any): InputsValidation {
  return Reflect.getMetadata(FormMetadataTypes.INPUTS_VALIDATION, target) || {};
}

export function setInputsValidation(value: InputsValidation, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.INPUTS_VALIDATION, value, target);
}

export function DefineValidation(inputValidation: Partial<InputValidation> = {}) {
  return function (target: any, prop: string) {
    inputValidation = { isValid: false, errorMessage: '', ...inputValidation };
    const inputsValidation = getInputsValidation(target);
    const newInputsValidation = Object.assign(inputsValidation, { [prop]: inputValidation });
    setInputValidation(prop, inputValidation, target);
    setInputsValidation(newInputsValidation, target);
  };
}
