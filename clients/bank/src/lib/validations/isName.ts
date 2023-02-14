export function isName(value: string): string | undefined {
  const length = value.length;
  const isNameValid = length >= 3 && length <= 45;

  if (!isNameValid) return 'Please input a valid name';
}
