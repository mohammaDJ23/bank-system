export function isSamePassword(formSchema) {
  return function (rule, value, callback) {
    const isSamePassword =
      formSchema.password.toString().toLowerCase() === value.toString().toLowerCase();

    if (!isSamePassword) callback(new Error('The password is not the same'));
    else callback();
  };
}
