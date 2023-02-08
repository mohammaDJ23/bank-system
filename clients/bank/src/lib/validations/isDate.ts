export function isDate(value: Date): string | void {
  if (isNaN(new Date(value).getTime())) return 'Invalid date';
}
