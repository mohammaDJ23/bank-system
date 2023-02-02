import { metadataTypes } from '../types';

export function DefineInputRules(rules) {
  return function (target, name) {
    if (Array.isArray(rules)) {
      const targetConstructor = target.constructor;
      const inputRules = Reflect.getMetadata(metadataTypes.INPUT_RULES, targetConstructor) || {};
      Reflect.defineMetadata(
        metadataTypes.INPUT_RULES,
        Object.assign(inputRules, { [name]: rules }),
        targetConstructor
      );
    }
  };
}
