import { FormMetadataTypes, Rule, Rules } from '../';

export class Form {
  getPrototype(): object {
    return this.constructor.prototype;
  }

  getRule(key: string): Rule[] {
    return Reflect.getMetadata(key, this.getPrototype()) || [];
  }

  getRules(): Rules {
    return Reflect.getMetadata(FormMetadataTypes.FORM_RULES, this.getPrototype()) || {};
  }
}
