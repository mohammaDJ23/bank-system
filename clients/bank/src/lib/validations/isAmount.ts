export function isAmount(value: string): string | undefined {
  if (value.length < 1) return 'Invalid number';
  else if (value.length > 18) return 'To long number';
  else if (!!!Number(value)) return 'Invalid number';
  else if (Math.sign(+value) === -1) return 'Could not be a negative number';
}
