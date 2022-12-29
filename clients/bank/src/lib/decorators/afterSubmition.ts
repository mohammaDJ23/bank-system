import { Dispatch } from 'redux';
import { FormMetadataTypes } from '.';
import { RootState } from '../../store';
import { RootActions } from '../../store/actions';

export function AfterSubmition() {
  return function (target: any, name: string, propertyDescriptor: PropertyDescriptor) {
    const value = propertyDescriptor.value as (
      dispatch: Dispatch<RootActions>,
      store: RootState
    ) => void;
    const afterSubmitions = Reflect.getMetadata(FormMetadataTypes.AFTER_SUBMITION, target) || [];
    Reflect.defineMetadata(FormMetadataTypes.AFTER_SUBMITION, [...afterSubmitions, value], target);
  };
}
