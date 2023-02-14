export function isPhone(value: string): string | undefined {
  const isPhoneValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);

  if (!isPhoneValid) return 'Invalid phone number';
}
