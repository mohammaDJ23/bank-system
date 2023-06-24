import { router } from '../main';

export function useRedirect() {
  function redirect(path) {
    if (typeof path !== 'string') return;
    router.push(path);
  }

  return { redirect };
}
