import { FormMetadataTypes } from './';

type InitialInputsValue = Record<string, any>;

export function getInitialInputsValue(target: any): InitialInputsValue {
  return Reflect.getMetadata(FormMetadataTypes.VALUES, target) || {};
}

export function setInitialInputsValue(values: InitialInputsValue, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.VALUES, values, target);
}

export function DefineVal() {
  return function (target: any, prop: string) {
    const value: any = Reflect.getMetadata('design:type', target, prop)();
    const inputs = getInitialInputsValue(target);
    const newInputs = Object.assign(inputs, { [prop]: value });
    setInitialInputsValue(newInputs, target);
  };
}
