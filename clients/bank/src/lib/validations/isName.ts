export function isName(rule: Object, value: string, callback: (error?: Error) => void): void {
  const length = value.length;
  const isNameValid = length >= 3 && length <= 45;

  if (!isNameValid) callback(new Error('Please input a valid name'));
  else callback();
}
