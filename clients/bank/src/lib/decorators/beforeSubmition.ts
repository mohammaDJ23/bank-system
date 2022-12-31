import { Dispatch } from 'redux';
import { FormMetadataTypes } from '.';
import { RootState } from '../../store';
import { RootActions } from '../../store/actions';

export function BeforeSubmition() {
  return function (target: any, name: string, propertyDescriptor: PropertyDescriptor) {
    const value = propertyDescriptor.value as (
      dispatch: Dispatch<RootActions>,
      store: RootState
    ) => void;
    const beforeSubmitions = Reflect.getMetadata(FormMetadataTypes.BEFORE_SUBMITION, target) || [];
    Reflect.defineMetadata(
      FormMetadataTypes.BEFORE_SUBMITION,
      [...beforeSubmitions, value],
      target
    );
  };
}
