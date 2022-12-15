export function isAmount(rule: Object, value: string, callback: (error?: Error) => void): void {
  if (value.length < 1) callback(new Error('Invalid number'));
  else if (value.length > 100) callback(new Error('To long number'));
  else if (!!!Number(value)) callback(new Error('Invalid number'));
  else callback();
}
