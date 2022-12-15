export function isDate(rule: Object, value: string, callback: (error?: Error) => void): void {
  if (isNaN(new Date(value).getTime())) callback(new Error('Invalid date'));
  else callback();
}
