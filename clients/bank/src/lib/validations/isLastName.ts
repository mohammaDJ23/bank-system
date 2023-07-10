import { isName } from './isName';

export function isLastName(value: string): string | undefined {
  return isName(value);
}
