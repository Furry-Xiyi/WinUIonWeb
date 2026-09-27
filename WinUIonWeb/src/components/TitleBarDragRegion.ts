// TitleBar.IsDragRegion 附加属性的 Web 版静态方法。
// 官方定义：ref/microsoft-ui-xaml-main/controls/dev/TitleBar/TitleBar.idl（IsDragRegion 附加属性，预览 API）。
// 官方 C# 用法：TitleBar.SetIsDragRegion(element, true) / TitleBar.GetIsDragRegion(element)
// / element.ClearValue(TitleBar.IsDragRegionProperty)

export const IsDragRegionProperty = Object.freeze({ Owner: 'TitleBar', Name: 'IsDragRegion', ClearValue: (target: DragRegionElement) => clearIsDragRegion(target) });
type DragRegionElement = HTMLElement | { Element?: HTMLElement; $el?: HTMLElement } | null | undefined;
const unwrapElement = (value: DragRegionElement): HTMLElement | undefined => value && ('Element' in value || '$el' in value) ? value.Element ?? value.$el : value as HTMLElement | undefined;
export function setIsDragRegion(target: DragRegionElement, value: boolean | null | undefined): void {
  const element = unwrapElement(target);
  if (!element || typeof element.setAttribute !== 'function') return;
  const next = value === true || value === false ? String(value) : null;
  if (element.getAttribute('TitleBar.IsDragRegion') === next) return;
  if (value === true || value === false) {
    element.setAttribute('TitleBar.IsDragRegion', String(value));
  } else {
    element.removeAttribute('TitleBar.IsDragRegion');
  }
  const CustomEvent = element.ownerDocument.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  element.dispatchEvent(new CustomEvent('winui-titlebar-drag-region-changed', { bubbles: true }));
}

export function getIsDragRegion(target: DragRegionElement): boolean | null {
  const element = unwrapElement(target);
  if (!element || typeof element.getAttribute !== 'function') return null;
  const value = element.getAttribute('TitleBar.IsDragRegion');
  if (value === null) return null;
  if (value === 'true' || value === 'True') return true;
  if (value === 'false' || value === 'False') return false;
  return null;
}

export function clearIsDragRegion(element: DragRegionElement): void { setIsDragRegion(element, null); }

export const SetIsDragRegion = setIsDragRegion;
export const GetIsDragRegion = getIsDragRegion;

const controlSelector = 'button,input,select,textarea,a[href],[contenteditable="true"],[role="button"],[role="textbox"],[role="combobox"],[role="checkbox"],[role="radio"],[role="switch"],[role="slider"],[role="listbox"],[tabindex]:not([tabindex="-1"]),.win-autosuggestbox,.win-person-picture';
/** FindInteractableElements follows TitleBar.cpp's attached-property inheritance. */
export function findTitleBarInteractableElements(root: HTMLElement): HTMLElement[] {
  const result: HTMLElement[] = [];
  const visit = (element: HTMLElement, parentIsDragRegion: boolean) => {
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);
    if (element.hidden || style?.display === 'none' || style?.visibility === 'hidden' || style?.pointerEvents === 'none') return;
    const explicit = getIsDragRegion(element), control = element.matches(controlSelector);
    if (explicit === false) { result.push(element); return; }
    if (explicit === true && control) return;
    const isDragRegion = explicit === true || parentIsDragRegion;
    const enabled = !element.matches(':disabled,[aria-disabled="true"],.is-disabled');
    if (!isDragRegion && control && enabled) { result.push(element); return; }
    for (const child of element.children) visit(child as HTMLElement, isDragRegion);
  };
  for (const child of root.children) visit(child as HTMLElement, false);
  return result;
}
