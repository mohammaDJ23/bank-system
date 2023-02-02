import { Form } from '../forms/formConstructor';
import { metadataTypes } from '../types';

export function BindInputRules() {
  return function (target) {
    const rules = Reflect.getMetadata(metadataTypes.INPUT_RULES, target);
    const constructors = Reflect.getMetadata(metadataTypes.CONSTRUCT, Form.getPrototype());
    for (let input in rules)
      rules[input] = rules[input].map(fn => fn.bind(constructors[target.name]));
  };
}
