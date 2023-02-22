import { FormMetadataTypes } from '.';

export interface InputValidation {
  isValid: boolean;
  errorMessage: string | undefined;
}

export type InputsValidation = Record<string, InputValidation>;

export function getInitialInputValidation(): InputValidation {
  return { isValid: false, errorMessage: '' };
}

export function getInputsValidation(target: any): InputsValidation {
  return Reflect.getMetadata(FormMetadataTypes.INPUTS_VALIDATION, target) || {};
}

export function setInputsValidation(value: InputsValidation, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.INPUTS_VALIDATION, value, target);
}

export function DefineValidation(inputValidation: Partial<InputValidation> = {}) {
  return function (target: any, prop: string) {
    inputValidation = Object.assign(getInitialInputValidation(), inputValidation);
    const inputsValidation = getInputsValidation(target);
    const newInputsValidation = Object.assign(inputsValidation, { [prop]: inputValidation });
    setInputsValidation(newInputsValidation, target);
  };
}
