export interface Rule {
  validator(rule: Object, value: string, callback: (error?: Error) => void): void;
  trigger: string;
}

export interface Rules {
  [key: string]: Rule[];
}

export enum FormMetadataTypes {
  FORM_RULES = 'FORM_RULES',
}

export function DefineRules(rules: Rule[]): (target: any, prop: string) => void {
  return function (target, prop) {
    const formRules = Reflect.getMetadata(FormMetadataTypes.FORM_RULES, target) || {};
    Reflect.defineMetadata(FormMetadataTypes.FORM_RULES, { ...formRules, [prop]: rules }, target);
    if (Reflect.hasMetadata(prop, target))
      throw new Error('Choose another key as signature of the metadata');
    else Reflect.defineMetadata(prop, { [prop]: rules }, target);
  };
}
