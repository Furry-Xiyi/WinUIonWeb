// TitleBar.IsDragRegion 附加属性的 Web 版静态方法。
// 官方定义：ref/microsoft-ui-xaml-main/controls/dev/TitleBar/TitleBar.idl（IsDragRegion 附加属性，预览 API）。
// 官方 C# 用法：TitleBar.SetIsDragRegion(element, true) / TitleBar.GetIsDragRegion(element)
// / element.ClearValue(TitleBar.IsDragRegionProperty)

export function setIsDragRegion(element: HTMLElement | null | undefined, value: boolean | null | undefined): void {
  if (!element) return;
  if (value === true || value === false) {
    element.setAttribute('IsDragRegion', String(value));
  } else {
    element.removeAttribute('IsDragRegion');
  }
}

export function getIsDragRegion(element: HTMLElement | null | undefined): boolean | null {
  if (!element || typeof element.getAttribute !== 'function') return null;
  const value = element.getAttribute('IsDragRegion');
  if (value === null) return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

export function clearIsDragRegion(element: HTMLElement | null | undefined): void {
  if (!element) return;
  element.removeAttribute('IsDragRegion');
}
