export function isSamePassword(value) {
  console.log(this);
  const isSamePassword =
    form.password.toString().trim().toLowerCase() === value.toString().trim().toLowerCase();
  if (!isSamePassword) return 'The password is not the same';
}
