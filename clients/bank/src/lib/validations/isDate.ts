export function isDate(value: Date): string | undefined {
  if (isNaN(new Date(value).getTime())) return 'Invalid date';
}
