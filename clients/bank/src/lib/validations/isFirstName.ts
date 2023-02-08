import { isName } from './isName';

export function isFirstName(value: string): string | void {
  return isName(value);
}
