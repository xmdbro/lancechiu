const NON_DRAGGABLE_SELECTOR =
  "a, button, input, select, textarea, [contenteditable], [data-no-drag]";

export function canStartMouseDrag(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !target.closest(NON_DRAGGABLE_SELECTOR)
  );
}
