<template>
  <div ref="element" v-bind="forwardedAttrs" class="win-rich-text-block" :class="{ 'is-selectable': selectionEnabled }" :style="[attrs.style,style]" @contextmenu="onContextMenu" @copy="onCopy">
    <div ref="source" :class="{ 'win-rich-text-source': hasOverflow }" :aria-hidden="hasOverflow || undefined" :inert="hasOverflow || undefined"><ContentOutlet /></div>
    <div v-if="hasOverflow" ref="flow" class="win-rich-text-flow" />
  </div>
  <ContextMenu v-if="selectionEnabled" />
</template>
<script lang="ts">
import { RichTextBlockBlocks, RichTextBlockTextHighlighters } from './TextInline';
export default { Blocks:RichTextBlockBlocks, TextHighlighters:RichTextBlockTextHighlighters };
</script>
<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, onUpdated, reactive, ref, useAttrs, useSlots, watch } from 'vue';
import { alignment, cssLength, xamlThickness } from './layout';
import { normalizeXamlNodes, resolveXamlValue } from './xamlRuntime';
import { textCommandFlyout } from './textCommandFlyout';
import { useI18n } from './i18n/index';
import { createTextHighlights, readTextHighlighters, restoreInlineInteractions, textBrush, textContentNodes, textFontWeight, textPosition, type TextHighlighterValue } from './TextInline';
defineOptions({ inheritAttrs: false });
const emit = defineEmits(['SelectionChanged', 'ContextMenuOpening', 'IsTextTrimmedChanged']);
const { t } = useI18n();
const props = defineProps({
  OverflowContentTarget: { type: [String,Object], default: null }, FontFamily: { type: String, default: '' },
  FontSize: { type: [String,Number], default: 14 }, FontStyle: { type: String, default: '' }, FontWeight: { type: [String,Number], default: '' }, FontStretch: { type: String, default: '' },
  Foreground: { type: [String,Object], default: '{ThemeResource TextFillColorPrimaryBrush}' }, IsTextSelectionEnabled: { type: [Boolean,String], default: true },
  SelectionHighlightColor: { type: [String,Object], default: 'Highlight' }, TextAlignment: { type: String, default: 'Left' }, HorizontalTextAlignment: { type: String, default: '' },
  CharacterSpacing: { type: [String,Number], default: 0 }, LineHeight: { type: [String,Number], default: 0 }, LineStackingStrategy: { type: String, default: 'MaxHeight' }, TextIndent: { type: [String,Number], default: 0 },
  TextLineBounds: { type: String, default: 'Full' }, OpticalMarginAlignment: { type: String, default: 'None' }, IsColorFontEnabled: { type: [Boolean,String], default: true }, IsTextScaleFactorEnabled: { type: [Boolean,String], default: true },
  TextReadingOrder: { type: String, default: 'Default' }, FlowDirection: { type: String, default: 'LeftToRight' }, TextDecorations: { type: String, default: 'None' }, SelectionFlyout: { type: [String,Object], default: null },
  TextWrapping: { type: String, default: 'Wrap' }, TextTrimming: { type: String, default: 'None' }, MaxLines: { type: [String,Number], default: 0 },
  Width: { type: [String,Number], default: '' }, Height: { type: [String,Number], default: '' }, Margin: { type: [String,Number], default: '' }, Padding: { type: [String,Number], default: '' },
  MinWidth: { type: [String,Number], default: 0 }, MinHeight: { type: [String,Number], default: 0 }, MaxWidth: { type: [String,Number], default: '' }, MaxHeight: { type: [String,Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' }, Visibility: { type: String, default: 'Visible' }, Opacity: { type: [String,Number], default: 1 }
});
const instance = getCurrentInstance();
const slots = useSlots();
const attrs = useAttrs();
const element = ref<HTMLElement | null>(null), source = ref<HTMLElement | null>(null), flow = ref<HTMLElement | null>(null);
const resolve = (name: keyof typeof props) => resolveXamlValue(props[name],instance);
const selectionEnabled = computed(() => resolve('IsTextSelectionEnabled') === true);
const forwardedAttrs = computed(() => ({ ...Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'style' && name !== 'AutomationProperties.Name')), 'aria-label': String(resolveXamlValue(attrs['AutomationProperties.Name'], instance) ?? '') }));
const hasOverflow = computed(() => Boolean(resolve('OverflowContentTarget')));
const ContentOutlet = defineComponent({ setup: () => () => h(Fragment,normalizeXamlNodes(textContentNodes(slots.default?.() ?? [], 'Blocks'),instance)) });
const style = computed<import('vue').CSSProperties>(() => ({
  fontFamily: resolve('FontFamily') === 'XamlAutoFontFamily' ? 'var(--ContentControlThemeFontFamily)' : resolve('FontFamily') as string,
  fontSize: cssLength(resolve('FontSize')),
  fontStyle: String(resolve('FontStyle')).toLowerCase(), fontWeight: textFontWeight(resolve('FontWeight')),
  fontStretch: String(resolve('FontStretch')).replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase(),
  color: textBrush(resolve('Foreground')), textAlign: String(resolve('HorizontalTextAlignment') || resolve('TextAlignment')).toLowerCase() as import('vue').CSSProperties['textAlign'],
  lineHeight: Number(resolve('LineHeight')) > 0 ? cssLength(resolve('LineHeight')) : resolve('TextLineBounds') === 'Tight' ? '1' : Number(resolve('FontSize')) === 14 ? '20px' : 'normal',
  letterSpacing: `${Number(resolve('CharacterSpacing')) / 1000}em`, textIndent: cssLength(resolve('TextIndent')),
  direction: resolve('FlowDirection') === 'RightToLeft' ? 'rtl' : 'ltr', unicodeBidi: resolve('TextReadingOrder') === 'DetectFromContent' ? 'plaintext' : 'normal',
  textDecorationLine: String(resolve('TextDecorations')).replace('Strikethrough','line-through').toLowerCase() as import('vue').CSSProperties['textDecorationLine'],
  whiteSpace: resolve('TextWrapping') === 'NoWrap' ? 'nowrap' : 'normal', overflowWrap: resolve('TextWrapping') === 'Wrap' ? 'anywhere' : 'normal',
  width: cssLength(resolve('Width')), height: cssLength(resolve('Height')), margin: xamlThickness(resolve('Margin')), padding: xamlThickness(resolve('Padding')),
  minWidth: cssLength(resolve('MinWidth')), minHeight: cssLength(resolve('MinHeight')), maxWidth: cssLength(resolve('MaxWidth')), maxHeight: cssLength(resolve('MaxHeight')), opacity: resolve('Opacity') as import('vue').CSSProperties['opacity'],
  justifySelf: alignment(resolve('HorizontalAlignment'),'horizontal'), alignSelf: alignment(resolve('VerticalAlignment'),'vertical'),
  userSelect: selectionEnabled.value ? 'text' : 'none', WebkitUserSelect: selectionEnabled.value ? 'text' : 'none', '--rich-text-selection': textBrush(resolve('SelectionHighlightColor')),
  ...(resolve('IsTextScaleFactorEnabled') === false ? { textSizeAdjust: 'none', WebkitTextSizeAdjust: 'none' } : {}),
  ...(hasOverflow.value || resolve('TextTrimming') !== 'None' ? { overflow: 'hidden', textOverflow: resolve('TextTrimming') === 'Clip' ? 'clip' : 'ellipsis' } : {}),
  ...(Number(resolve('MaxLines')) > 0 ? { display: '-webkit-box', WebkitLineClamp: String(resolve('MaxLines')), WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
  ...(resolve('Visibility') === 'Collapsed' ? { display: 'none' } : {})
}));
const highlighters = reactive<TextHighlighterValue[]>([]);
const highlights = createTextHighlights(`win-rich-text-${instance?.uid}`);
const visibleRoots: { Element: HTMLElement; Start: number }[] = [];
let observer: ResizeObserver | undefined, frame = 0, lastSignature = '', active = true;
const observed = new Set<HTMLElement>();
const overflowHosts = new Set<HTMLElement>();
const hasOverflowContent = ref(false), isTextTrimmed = ref(false), selectedText = ref('');
const textHighlighterCollection = {
  Add: (item: TextHighlighterValue) => highlighters.push(item), Clear: () => highlighters.splice(0),
  Remove: (item: TextHighlighterValue) => { const index = highlighters.indexOf(item); if(index >= 0) highlighters.splice(index,1); },
  RemoveAt: (index: number) => highlighters.splice(index,1), GetAt: (index: number) => highlighters[index], get Count() { return highlighters.length; }
};
const selectionText = () => {
  const selection = window.getSelection();
  if(!selection || !selection.rangeCount || !selectionEnabled.value) return '';
  const range = selection.getRangeAt(0);
  const contains = (node: Node) => visibleRoots.some(root => root.Element.contains(node));
  return contains(range.startContainer) && contains(range.endContainer) ? selection.toString() : '';
};
const selectionChanged = () => {
  const text = selectionText();
  if(selectedText.value === text) return;
  selectedText.value = text;
  emit('SelectionChanged', api, { OriginalSource: element.value, Handled: false });
};
const selectAll = () => {
  if(!selectionEnabled.value || !visibleRoots.length) return;
  const range = document.createRange(); range.setStart(visibleRoots[0].Element,0);
  const last = visibleRoots.at(-1)!.Element; range.setEnd(last,last.childNodes.length);
  const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); selectionChanged();
};
const select = (start: { Offset: number }, end: { Offset: number }) => {
  if(!selectionEnabled.value || !visibleRoots.length) return;
  const position = (offset: number) => {
    const root = [...visibleRoots].reverse().find(root => root.Start <= offset) ?? visibleRoots[0];
    return textPosition(root.Element,offset-root.Start);
  };
  const range = document.createRange(); range.setStart(...position(start.Offset)); range.setEnd(...position(end.Offset));
  const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); selectionChanged();
};
const copySelection = () => { const text = selectionText(); if(text) void navigator.clipboard?.writeText(text); };
const onCopy = (event: ClipboardEvent) => { const text = selectionText(); if(text) { event.clipboardData?.setData('text/plain',text); event.preventDefault(); } };
const contextMenuRef = ref<any>(null);
const contextMenuItems = computed(() => [
  ...(selectedText.value ? [{ Text: t('text.copy'), Icon: 'Copy', Value: 'copy' }] : []),
  { Text: t('text.select-all'), Icon: 'SelectAll', Value: 'selectAll' }
]);
const ContextMenu = textCommandFlyout(contextMenuRef, () => contextMenuItems.value, item => {
  if(item.Value === 'copy') copySelection(); if(item.Value === 'selectAll') selectAll(); contextMenuRef.value?.Hide?.();
}, () => {});
const onContextMenu = (event: MouseEvent) => {
  if(!selectionEnabled.value) return;
  selectionChanged();
  const args = { OriginalSource: event.target, CursorLeft: event.clientX, CursorTop: event.clientY, Handled: false };
  emit('ContextMenuOpening',api,args);
  if(args.Handled) { event.preventDefault(); return; }
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  const position = { X:event.clientX-target.getBoundingClientRect().left, Y:event.clientY-target.getBoundingClientRect().top };
  const flyout = resolve('SelectionFlyout') as any;
  void (flyout?.ShowAt ? flyout : contextMenuRef.value)?.ShowAt?.(target,{ Position:position });
};
const api = {
  Element: element, TextHighlighters: textHighlighterCollection, get HasOverflowContent() { return hasOverflowContent.value; }, get IsTextTrimmed() { return isTextTrimmed.value; },
  get SelectedText() { return selectedText.value; }, get ContentStart() { return { Offset:0 }; }, get ContentEnd() { return { Offset: source.value?.textContent?.length ?? 0 }; },
  SelectAll: selectAll, Select: select, CopySelectionToClipboard: copySelection
};
defineExpose(api);
const setTrimmed = (value: boolean) => { if(isTextTrimmed.value !== value) { isTextTrimmed.value = value; emit('IsTextTrimmedChanged',api,{ IsTextTrimmed:value }); } };
const updateObserved = (hosts: HTMLElement[]) => {
  observed.forEach(host => { if(!hosts.includes(host)) { observer?.unobserve(host); observed.delete(host); } });
  hosts.forEach(host => { if(!observed.has(host)) { observer?.observe(host); observed.add(host); } });
};
const clearOverflowHost = (host: HTMLElement) => {
  host.replaceChildren(); host.removeEventListener('contextmenu',onContextMenu); host.removeEventListener('copy',onCopy);
};
const layoutOverflow = () => {
  if(!source.value || !element.value) return;
  if(!hasOverflow.value || !flow.value) {
    overflowHosts.forEach(clearOverflowHost); overflowHosts.clear(); updateObserved([element.value]);
    visibleRoots.splice(0,visibleRoots.length,{ Element:source.value, Start:0 }); hasOverflowContent.value = false;
    setTrimmed(resolve('TextTrimming') !== 'None' && (element.value.scrollHeight > element.value.clientHeight || element.value.scrollWidth > element.value.clientWidth));
    lastSignature = ''; return;
  }
  const targets: HTMLElement[] = [flow.value];
  const hosts: HTMLElement[] = [element.value];
  let target = resolve('OverflowContentTarget') as any;
  const visited = new Set();
  while(target && !visited.has(target)) { visited.add(target); if(target.Element instanceof HTMLElement) { targets.push(target.Element); hosts.push(target.Element); } target = target.OverflowContentTarget; }
  overflowHosts.forEach(host => { if(!targets.includes(host)) clearOverflowHost(host); });
  overflowHosts.clear(); targets.slice(1).forEach(host => { overflowHosts.add(host); host.removeEventListener('contextmenu',onContextMenu); host.addEventListener('contextmenu',onContextMenu); host.removeEventListener('copy',onCopy); host.addEventListener('copy',onCopy); });
  updateObserved(hosts);
  const computedStyle = getComputedStyle(element.value);
  const inheritedProperties = ['font-family','font-size','font-weight','font-style','font-stretch','line-height','letter-spacing','color','text-align','text-indent','white-space','overflow-wrap','direction','user-select','--rich-text-selection'];
  targets.forEach(destination => inheritedProperties.forEach(property => destination.style.setProperty(property,computedStyle.getPropertyValue(property))));
  const signature = source.value.innerHTML + hosts.map(host => `${host.clientWidth}:${host.clientHeight}`).join('|') + inheritedProperties.map(property => computedStyle.getPropertyValue(property)).join('|');
  if(signature === lastSignature) return;
  lastSignature = signature;
  // Split the original document at browser-measured character boundaries.
  // cloneContents preserves paragraph and inline formatting across containers.
  const measure = document.createElement('div');
  Object.assign(measure.style,{ position:'fixed', visibility:'hidden', pointerEvents:'none', left:'0', top:'0' });
  inheritedProperties.forEach(property => measure.style.setProperty(property,computedStyle.getPropertyValue(property)));
  measure.className = 'win-rich-text-block'; document.body.append(measure);
  const length = source.value.textContent?.length ?? 0;
  let offset = 0;
  visibleRoots.splice(0);
  targets.forEach((destination,index) => {
    const host = hosts[index];
    const hostStyle = getComputedStyle(host);
    const width = Math.max(0,host.clientWidth-parseFloat(hostStyle.paddingLeft || '0')-parseFloat(hostStyle.paddingRight || '0'));
    const height = Math.max(0,host.clientHeight-parseFloat(hostStyle.paddingTop || '0')-parseFloat(hostStyle.paddingBottom || '0'));
    measure.style.width = `${width}px`;
    let low = offset, high = length;
    const fragment = (end: number) => {
      const range = document.createRange(); range.setStart(...textPosition(source.value!,offset)); range.setEnd(...textPosition(source.value!,end)); const fragment = range.cloneContents();
      fragment.querySelectorAll('p').forEach(paragraph => { if(!paragraph.textContent && !paragraph.querySelector('img,br,.win-inline-ui-container')) paragraph.remove(); });
      return fragment;
    };
    while(low < high && width > 0 && height > 0) { const middle = Math.ceil((low+high)/2); measure.replaceChildren(fragment(middle)); if(measure.scrollHeight <= height) low = middle; else high = middle-1; }
    if(low < length && low > offset) { const text = source.value!.textContent ?? ''; let boundary = low; while(boundary > offset && !/\s/.test(text[boundary] ?? '')) boundary--; if(boundary > offset) low = boundary+1; }
    if(low > offset && /[\uD800-\uDBFF]/.test(source.value!.textContent?.[low-1] ?? '')) low--;
    destination.replaceChildren(fragment(low));
    restoreInlineInteractions(destination);
    visibleRoots.push({ Element:destination, Start:offset });
    if(index === 0) hasOverflowContent.value = low < length;
    offset = low;
  });
  setTrimmed(offset < length && resolve('TextTrimming') !== 'None');
  measure.remove();
};
const schedule = () => { if(!active) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { layoutOverflow(); highlights.Update(visibleRoots,[...readTextHighlighters(slots.default?.() ?? [],instance),...highlighters]); }); };
onMounted(async () => { await nextTick(); observer = new ResizeObserver(schedule); if(element.value) updateObserved([element.value]); schedule(); document.fonts.ready.then(schedule); document.addEventListener('selectionchange',selectionChanged); });
onUpdated(schedule);
watch(highlighters,schedule,{deep:true});
watch(() => {
  const targets = []; const visited = new Set(); let target = resolve('OverflowContentTarget') as any;
  while(target && !visited.has(target)) { visited.add(target); targets.push(target); target = target.OverflowContentTarget; }
  return targets;
}, () => { lastSignature = ''; schedule(); }, { flush:'post' });
watch(selectionEnabled,(enabled) => { if(!enabled) { if(selectedText.value) window.getSelection()?.removeAllRanges(); selectedText.value = ''; contextMenuRef.value?.Hide?.(); } });
onBeforeUnmount(() => { active = false; observer?.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('selectionchange',selectionChanged); overflowHosts.forEach(clearOverflowHost); highlights.Clear(); });
</script>
<style>
.win-rich-text-block { position: relative; display: block; box-sizing: border-box; min-width: 0; min-height: 0; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable Text', 'Segoe UI', sans-serif); line-height: 20px; color: var(--TextFillColorPrimaryBrush,var(--text-primary)); }
.win-rich-text-block p { margin: 0; }
.win-rich-text-source { position: absolute; inset: 0; visibility: hidden; pointer-events: none; }
.win-rich-text-flow { height: 100%; overflow: hidden; }
.win-rich-text-block::selection, .win-rich-text-block *::selection { background: var(--rich-text-selection, Highlight); color: HighlightText; }
.win-rich-text-block.is-selectable, .win-rich-text-block.is-selectable * { user-select: text; -webkit-user-select: text; }
.win-text-hyperlink { color: var(--HyperlinkForeground,var(--AccentTextFillColorPrimaryBrush,var(--accent-text-fill-primary))); cursor: pointer; }
.win-text-hyperlink:hover { color: var(--HyperlinkForegroundPointerOver,var(--AccentTextFillColorSecondaryBrush,var(--accent-text-fill-secondary))); }
.win-text-hyperlink:active { color: var(--HyperlinkForegroundPressed,var(--AccentTextFillColorTertiaryBrush,var(--accent-text-fill-tertiary))); }
.win-text-hyperlink:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush,var(--focus-stroke)); outline-offset: 1px; }
</style>
