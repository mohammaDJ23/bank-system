import { RootState } from '../store/store';
import { TypedUseSelectorHook, useSelector as useSelectorRedux } from 'react-redux';

export const selectors: TypedUseSelectorHook<RootState> = useSelectorRedux;

export const useSelector: () => RootState = () => selectors(state => state);
