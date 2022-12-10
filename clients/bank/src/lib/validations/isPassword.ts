export function isPassword(rule: Object, value: string, callback: (error?: Error) => void): void {
  const isPasswordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/.test(
    value,
  );

  if (!isPasswordValid) callback(new Error('Invalid password'));
  else callback();
}
