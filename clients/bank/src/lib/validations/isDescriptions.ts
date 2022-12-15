export function isDescription(
  rule: Object,
  value: string,
  callback: (error?: Error) => void
): void {
  if (value.length < 3) callback(new Error('Invalid description'));
  else if (value.length > 100) callback(new Error('The description is too long'));
  else callback();
}
