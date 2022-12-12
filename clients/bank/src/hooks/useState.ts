import { RootState } from '../store/store';
import { useSelector } from './useSelector';

export const useState: () => RootState = () => useSelector((state) => state);
