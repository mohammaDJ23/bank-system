import { metadataTypes } from '../types';

export function getInputsRules(target) {
  return Reflect.getMetadata(metadataTypes.INPUT_RULES, target) || {};
}

export function defineInputRules(value, target) {
  Reflect.defineMetadata(metadataTypes.INPUT_RULES, value, target);
}

export function DefineInputRules(rules) {
  return function (target, name) {
    if (Array.isArray(rules)) {
      const targetConstructor = target.constructor;
      const inputRules = getInputsRules(targetConstructor);
      defineInputRules(Object.assign(inputRules, { [name]: rules }), targetConstructor);
    }
  };
}
