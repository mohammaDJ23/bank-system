export function isEmail(value: string): string | undefined {
  if (!/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(value))
    return 'Invalid email';
  else if (value.length > 256) return 'Too long email';
}
