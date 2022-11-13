export function isSamePassword(password) {
  return function (rule, value, callback) {
    const isSamePassword = password.toString().toLowerCase() === value.toString().toLowerCase();

    if (!isSamePassword) callback(new Error('The password is not the same'));
    else callback();
  };
}
