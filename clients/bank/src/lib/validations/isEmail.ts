export function isEmail(value: string): string | undefined {
  const isEmailValid =
    /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(
      value
    );

  if (!isEmailValid) return 'Invalid email';
}
