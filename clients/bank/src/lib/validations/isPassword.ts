export function isPassword(value: string): string | undefined {
  const isPasswordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/.test(
    value
  );

  if (!isPasswordValid) return 'Invalid password';
}
