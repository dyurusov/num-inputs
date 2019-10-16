export function domElementFactory (id?: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<div id="${id}" />`;
  return div;
}
