export function isPassword(rule, value, callback) {
  const isPasswordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/.test(
    value,
  );

  if (!isPasswordValid) callback(new Error('Invalid password'));
  else callback();
}
