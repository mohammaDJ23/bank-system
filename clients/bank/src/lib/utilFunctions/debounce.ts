export function debounce(debounceTimer: number, cb: (...args: any) => any) {
  let initialDate = new Date().getTime();

  return function (...args: any[]): any {
    const tempDate = new Date().getTime();

    if (initialDate < tempDate) {
      cb.apply(window, args);
      initialDate = tempDate + debounceTimer;
    }
  };
}
