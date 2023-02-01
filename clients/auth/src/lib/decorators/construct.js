import { Form } from '../forms/formConstructor';
import { metadataTypes } from '../types';

export function Construct() {
  return function (target) {
    const targetObject = Form.getPrototype();
    const constructors = Reflect.getMetadata(metadataTypes.CONSTRUCT, targetObject) || {};
    const constructedTarget = new target();
    Reflect.defineMetadata(
      metadataTypes.CONSTRUCT,
      Object.assign(constructors, { [constructedTarget.constructor.name]: constructedTarget }),
      targetObject
    );
  };
}
