import { Store, Dispatch } from 'redux';
import { FormMetadataTypes } from '.';
import { RootState } from '../../store';
import { RootActions } from '../../store/actions';

export function BeforeSubmition() {
  return function (
    target: any,
    name: string,
    propertyDescriptor: TypedPropertyDescriptor<
      (dispatch: Dispatch<RootActions>, store: Store<RootState>) => void
    >
  ) {
    const value = propertyDescriptor.value;
    const beforeSubmitions = Reflect.getMetadata(FormMetadataTypes.BEFORE_SUBMITION, target) || [];
    Reflect.defineMetadata(
      FormMetadataTypes.BEFORE_SUBMITION,
      [...beforeSubmitions, value],
      target
    );
  };
}
