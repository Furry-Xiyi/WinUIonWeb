<template>
  <WinToolTip
    :IsOpen="isOpen"
    :Content="content"
    :Placement="placement"
    :PlacementTarget="placementTarget || undefined"
    :PlacementPoint="placementPoint || undefined"
    :Theme="theme"
    :UseNativeToolTip="false"
    IsServiceHost
    @tooltip-pointer-enter="onToolTipPointerEnter"
    @tooltip-pointer-leave="onToolTipPointerLeave" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import WinToolTip from './WinToolTip.vue';

const TOOL_TIP_ATTRIBUTE = 'tooltipservice.tooltip';
const PLACEMENT_ATTRIBUTE = 'tooltipservice.placement';
const PLACEMENT_TARGET_ATTRIBUTE = 'tooltipservice.placementtarget';
const TOOL_TIP_SELECTOR = '[tooltipservice\\.tooltip]';
const MOUSE_HOVER_TIME = 400;
const INITIAL_SHOW_DELAY = MOUSE_HOVER_TIME * 2;
const RESHOW_DELAY = MOUSE_HOVER_TIME * 1.5;
const TOUCH_SHOW_DELAY = MOUSE_HOVER_TIME;
const BETWEEN_SHOW_DELAY = 200;
const CLOSE_ANIMATION_DURATION = 167;

type InputMode = 'keyboard' | 'mouse' | 'touch';

const isOpen = ref(false);
const content = ref('');
const placement = ref('Mouse');
const placementTarget = shallowRef<HTMLElement | null>(null);
const placementPoint = ref<{ x: number; y: number } | null>(null);
const theme = ref('');
const attachedElements = new Set<HTMLElement>();
const originalTitles = new WeakMap<HTMLElement, string | null>();
let activeElement: HTMLElement | null = null;
let pendingElement: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let openTimer: number | undefined;
let closeTimer: number | undefined;
let touchDismissTimer: number | undefined;
let lastClosedAt = Number.NEGATIVE_INFINITY;
let isPointerOverToolTip = false;
let suppressedElement: HTMLElement | null = null;
let lastInputMode: InputMode | null = null;
let isClosing = false;
let canCancelClose = false;

function toolTipText(element: HTMLElement): string | null {
  return element.getAttribute(TOOL_TIP_ATTRIBUTE);
}

function syncNativeTitle(element: HTMLElement) {
  const text = toolTipText(element);
  if (text === null) {
    if (activeElement === element) closeActive();
    else if (attachedElements.has(element)) restoreOriginalTitle(element);
    return;
  }

  if (!attachedElements.has(element)) {
    originalTitles.set(element, element.getAttribute('title'));
    attachedElements.add(element);
  }

  if (activeElement === element && isOpen.value) {
    content.value = text;
    placement.value = element.getAttribute(PLACEMENT_ATTRIBUTE) || 'Mouse';
    placementTarget.value = resolvePlacementTarget(element);
  } else {
    element.removeAttribute('title');
  }
}

function restoreOriginalTitle(element: HTMLElement) {
  const original = originalTitles.get(element);
  if (original === null || original === undefined) element.removeAttribute('title');
  else element.setAttribute('title', original);
  originalTitles.delete(element);
  attachedElements.delete(element);
}

function restoreAttachedTitle(element: HTMLElement) {
  const text = toolTipText(element);
  if (text === null) restoreOriginalTitle(element);
  else element.removeAttribute('title');
}

function scanNode(node: Node) {
  if (!(node instanceof Element)) return;
  if (node instanceof HTMLElement && node.hasAttribute(TOOL_TIP_ATTRIBUTE)) syncNativeTitle(node);
  node.querySelectorAll<HTMLElement>(TOOL_TIP_SELECTOR).forEach(syncNativeTitle);
}

function releaseNode(node: Node) {
  if (!(node instanceof Element)) return;
  const elements = node instanceof HTMLElement && node.hasAttribute(TOOL_TIP_ATTRIBUTE)
    ? [node, ...node.querySelectorAll<HTMLElement>(TOOL_TIP_SELECTOR)]
    : [...node.querySelectorAll<HTMLElement>(TOOL_TIP_SELECTOR)];
  elements.forEach(element => {
    if (activeElement === element) closeActive();
    if (pendingElement === element) clearOpenTimer();
    if (suppressedElement === element) suppressedElement = null;
    if (attachedElements.has(element)) restoreOriginalTitle(element);
  });
}

function findToolTipElement(start: EventTarget | null): HTMLElement | null {
  let element = start instanceof HTMLElement
    ? start
    : start instanceof Node
      ? start.parentElement
      : null;

  while (element) {
    if (element.hasAttribute(TOOL_TIP_ATTRIBUTE)) return element;
    element = element.parentElement;
  }
  return null;
}

function resolvePlacementTarget(element: HTMLElement): HTMLElement {
  const selector = element.getAttribute(PLACEMENT_TARGET_ATTRIBUTE);
  if (!selector) return element;
  try {
    return document.querySelector<HTMLElement>(selector) || element;
  } catch {
    return element;
  }
}

function resolveTheme(element: HTMLElement): string {
  const scope = element.closest('.theme-light, .theme-dark');
  if (scope?.classList.contains('theme-dark')) return 'dark';
  if (scope?.classList.contains('theme-light')) return 'light';
  return '';
}

function clearOpenTimer() {
  if (openTimer !== undefined) window.clearTimeout(openTimer);
  openTimer = undefined;
  pendingElement = null;
}

function clearCloseTimer() {
  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
  closeTimer = undefined;
}

function clearTouchDismissTimer() {
  if (touchDismissTimer !== undefined) window.clearTimeout(touchDismissTimer);
  touchDismissTimer = undefined;
}

function elementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function openFor(element: HTMLElement) {
  const text = toolTipText(element);
  if (text === null) return;
  clearCloseTimer();
  isClosing = false;
  canCancelClose = false;
  if (activeElement && activeElement !== element) restoreAttachedTitle(activeElement);
  activeElement = element;
  pendingElement = null;
  content.value = text;
  placement.value = element.getAttribute(PLACEMENT_ATTRIBUTE) || 'Mouse';
  placementTarget.value = resolvePlacementTarget(element);
  theme.value = resolveTheme(element);
  element.removeAttribute('title');
  isOpen.value = true;
}

function queueOpen(element: HTMLElement, inputMode: InputMode, point?: { x: number; y: number }) {
  if (suppressedElement === element) return;
  if (activeElement === element && isClosing && canCancelClose) {
    clearCloseTimer();
    isClosing = false;
    canCancelClose = false;
    element.removeAttribute('title');
    isOpen.value = true;
    return;
  }
  if (activeElement === element && isOpen.value) {
    clearCloseTimer();
    return;
  }
  if (pendingElement === element) return;

  const isSwitchingVisibleTarget = Boolean(activeElement && activeElement !== element && isOpen.value);
  if (isSwitchingVisibleTarget) {
    closeActive();
  } else {
    clearOpenTimer();
    clearCloseTimer();
  }

  pendingElement = element;
  placementPoint.value = point || elementCenter(element);
  const recentlyClosed = performance.now() - lastClosedAt <= BETWEEN_SHOW_DELAY;
  const isReshow = isSwitchingVisibleTarget || recentlyClosed;
  const delay = inputMode === 'touch'
    ? isReshow ? 0 : TOUCH_SHOW_DELAY
    : inputMode === 'mouse' && isReshow
      ? RESHOW_DELAY
      : INITIAL_SHOW_DELAY;
  openTimer = window.setTimeout(() => openFor(element), delay);
}

function closeActive(allowCancellation = false) {
  const wasOpen = Boolean(activeElement && isOpen.value);
  const closingElement = activeElement;
  clearOpenTimer();
  clearCloseTimer();
  clearTouchDismissTimer();
  isPointerOverToolTip = false;
  if (closingElement) restoreAttachedTitle(closingElement);
  isOpen.value = false;
  if (wasOpen) lastClosedAt = performance.now();
  if (!closingElement) {
    isClosing = false;
    canCancelClose = false;
    placementTarget.value = null;
    placementPoint.value = null;
    content.value = '';
    return;
  }

  isClosing = true;
  canCancelClose = allowCancellation;
  closeTimer = window.setTimeout(() => {
    closeTimer = undefined;
    if (!isClosing || isOpen.value || activeElement !== closingElement) return;
    activeElement = null;
    isClosing = false;
    canCancelClose = false;
    placementTarget.value = null;
    placementPoint.value = null;
    content.value = '';
  }, CLOSE_ANIMATION_DURATION);
}

function queueClose(element: HTMLElement) {
  if (pendingElement !== element && activeElement !== element) return;
  clearOpenTimer();
  if (isPointerOverToolTip) return;
  closeActive(true);
}

function onPointerOver(event: PointerEvent) {
  const element = findToolTipElement(event.target);
  if (element && event.pointerType !== 'touch') {
    lastInputMode = 'mouse';
    queueOpen(element, 'mouse', { x: event.clientX, y: event.clientY });
  }
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' || !pendingElement) return;
  const element = findToolTipElement(event.target);
  if (element !== pendingElement) return;
  placementPoint.value = { x: event.clientX, y: event.clientY };
}

function onPointerOut(event: PointerEvent) {
  const element = findToolTipElement(event.target);
  if (!element) return;
  const related = event.relatedTarget;
  if (related instanceof Node && element.contains(related)) return;
  if (suppressedElement === element) suppressedElement = null;
  queueClose(element);
}

function onPointerDown(event: PointerEvent) {
  lastInputMode = event.pointerType === 'touch' ? 'touch' : 'mouse';
  const element = findToolTipElement(event.target);
  if (event.pointerType === 'touch' && element) {
    queueOpen(element, 'touch', { x: event.clientX, y: event.clientY });
    clearTouchDismissTimer();
    touchDismissTimer = window.setTimeout(closeActive, 5000);
  } else if (element) {
    suppressedElement = element;
    if (activeElement === element || pendingElement === element) closeActive();
  } else if (!element && activeElement) {
    closeActive();
  }
}

function onFocusIn(event: FocusEvent) {
  const element = findToolTipElement(event.target);
  if (element && lastInputMode === 'keyboard') {
    queueOpen(element, 'keyboard', elementCenter(element));
  }
}

function onFocusOut(event: FocusEvent) {
  const element = findToolTipElement(event.target);
  if (element) queueClose(element);
}

function onKeyDown() {
  lastInputMode = 'keyboard';
}

function onToolTipPointerEnter() {
  isPointerOverToolTip = true;
  clearCloseTimer();
  if (activeElement && isClosing && canCancelClose && suppressedElement !== activeElement) {
    isClosing = false;
    canCancelClose = false;
    activeElement.removeAttribute('title');
    isOpen.value = true;
  }
}

function onToolTipPointerLeave() {
  isPointerOverToolTip = false;
  if (activeElement) queueClose(activeElement);
}

onMounted(() => {
  document.querySelectorAll<HTMLElement>(TOOL_TIP_SELECTOR).forEach(syncNativeTitle);
  observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes' && record.target instanceof HTMLElement) {
        if (record.attributeName === TOOL_TIP_ATTRIBUTE) syncNativeTitle(record.target);
        if (
          record.attributeName === 'class'
          && activeElement
          && (record.target === activeElement || record.target.contains(activeElement))
        ) {
          theme.value = resolveTheme(activeElement);
        }
      }
      record.addedNodes.forEach(scanNode);
      record.removedNodes.forEach(releaseNode);
    });
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [TOOL_TIP_ATTRIBUTE, 'class'],
    childList: true,
    subtree: true
  });
  document.addEventListener('pointerover', onPointerOver, true);
  document.addEventListener('pointermove', onPointerMove, true);
  document.addEventListener('pointerout', onPointerOut, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('focusin', onFocusIn, true);
  document.addEventListener('focusout', onFocusOut, true);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearOpenTimer();
  clearCloseTimer();
  clearTouchDismissTimer();
  attachedElements.forEach(restoreOriginalTitle);
  document.removeEventListener('pointerover', onPointerOver, true);
  document.removeEventListener('pointermove', onPointerMove, true);
  document.removeEventListener('pointerout', onPointerOut, true);
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('keydown', onKeyDown, true);
  document.removeEventListener('focusin', onFocusIn, true);
  document.removeEventListener('focusout', onFocusOut, true);
});
</script>
