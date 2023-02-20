import { FormMetadataTypes } from '.';

export interface RuleFn {
  (value: any): string | undefined;
}

export type InputRules = RuleFn[];

export type InputsRules = Record<string, InputRules>;

export function getInputsRules(target: any): InputsRules {
  return Reflect.getMetadata(FormMetadataTypes.FORM_RULES, target) || {};
}

export function setInputsRules(rules: InputsRules, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.FORM_RULES, rules, target);
}

export function getInputRules(key: string, target: any): InputRules {
  return Reflect.getMetadata(key, target) || [];
}

export function setInputRules(key: string, value: InputRules, target: any) {
  Reflect.defineMetadata(key, value, target);
}

export function DefineRules(rules: RuleFn[]) {
  return function (target: any, prop: string) {
    const inputsRules = getInputsRules(target);
    const newRule = { [prop]: rules };
    const newInputsRules = Object.assign(inputsRules, newRule);
    setInputsRules(newInputsRules, target);
    setInputRules(prop, rules, target);
  };
}
