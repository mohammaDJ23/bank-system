export function isEmail(rule, value, callback) {
  const isEmailValid = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(
    value,
  );

  if (!isEmailValid) callback(new Error('Invalid email'));
  else callback();
}
