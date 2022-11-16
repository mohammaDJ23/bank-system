export function useFocus() {
  function focus(name) {
    const [el] = document.getElementsByName(name);

    if (el) el?.focus();
  }

  return { focus };
}
