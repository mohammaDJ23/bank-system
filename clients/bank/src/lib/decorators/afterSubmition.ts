import { Store, Dispatch } from 'redux';
import { FormMetadataTypes } from '.';
import { RootState } from '../../store';
import { RootActions } from '../../store/actions';

export function AfterSubmition() {
  return function (
    target: any,
    name: string,
    propertyDescriptor: TypedPropertyDescriptor<
      (dispatch: Dispatch<RootActions>, store: Store<RootState>) => void
    >
  ) {
    const value = propertyDescriptor.value;
    const afterSubmitions = Reflect.getMetadata(FormMetadataTypes.AFTER_SUBMITION, target) || [];
    Reflect.defineMetadata(FormMetadataTypes.AFTER_SUBMITION, [...afterSubmitions, value], target);
  };
}
