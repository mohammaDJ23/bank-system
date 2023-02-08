export function isDescription(value: string): string | void {
  if (value.length < 3) return 'Invalid description';
  else if (value.length > 500) return 'The description is too long';
}
