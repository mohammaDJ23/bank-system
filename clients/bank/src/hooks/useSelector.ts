import { TypedUseSelectorHook, useSelector as useSelectorRedux } from 'react-redux';
import { RootState } from '../store/store';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux;
