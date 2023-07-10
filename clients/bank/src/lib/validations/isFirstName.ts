import { isName } from './isName';

export function isFirstName(value: string): string | undefined {
  return isName(value);
}
