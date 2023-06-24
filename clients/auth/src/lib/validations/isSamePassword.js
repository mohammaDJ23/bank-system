export function isSamePassword(value) {
  const isSamePassword = this.password.toString().trim().toLowerCase() === value.toString().trim().toLowerCase();
  if (!isSamePassword) return 'The password is not the same';
}
