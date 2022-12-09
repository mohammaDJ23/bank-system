import { isName } from './isName';

export function isLastName(rule: Object, value: string, callback: (error?: Error) => void): void {
  isName(rule, value, callback);
}
