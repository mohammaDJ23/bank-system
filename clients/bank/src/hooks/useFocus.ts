export function useFocus() {
  function focus(name: string) {
    const el: NodeListOf<HTMLElement> = document.getElementsByName(name);
    if (el.length) el[0]?.focus();
  }

  return { focus };
}
