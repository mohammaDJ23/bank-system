export function isPhone(rule: Object, value: string, callback: (error?: Error) => void): void {
  const isPhoneValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);

  if (!isPhoneValid) callback(new Error('Invalid phone number'));
  else callback();
}
