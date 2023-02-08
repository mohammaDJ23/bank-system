import { FormMetadataTypes } from './';

type ValuesObj = Record<string, any>;

export function getInitialInputsValue(target: any) {
  return Reflect.getMetadata(FormMetadataTypes.VALUES, target) || {};
}

export function setInputValues(values: ValuesObj, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.VALUES, values, target);
}

export function DefineVal() {
  return function (target: any, prop: string) {
    const value: any = Reflect.getMetadata('design:type', target, prop)();
    const inputs: ValuesObj = getInitialInputsValue(target);
    const newInputs = Object.assign(inputs, { [prop]: value });
    setInputValues(newInputs, target);
  };
}
