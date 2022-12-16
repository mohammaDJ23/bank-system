export function isReceiver(rule: Object, value: string, callback: (error?: Error) => void): void {
  if (value.length < 3) callback(new Error('Invalid receiver name'));
  else if (value.length > 100) callback(new Error('receiver name is too long'));
  else callback();
}
