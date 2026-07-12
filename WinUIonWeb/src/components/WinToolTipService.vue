<template>
  <WinToolTip
    :IsOpen="isOpen"
    :Content="content"
    :Placement="placement"
    :PlacementTarget="placementTarget"
    :Theme="theme"
    :UseNativeToolTip="false"
    :InitialShowDelay="0"
    :BetweenShowDelay="0"
    IsServiceHost />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import WinToolTip from './WinToolTip.vue';

const TOOL_TIP_ATTRIBUTE = 'tooltipservice.tooltip';
const PLACEMENT_ATTRIBUTE = 'tooltipservice.placement';
const PLACEMENT_TARGET_ATTRIBUTE = 'tooltipservice.placementtarget';
const TOOL_TIP_SELECTOR = '[tooltipservice\\.tooltip]';
const INITIAL_SHOW_DELAY = 500;
const BETWEEN_SHOW_DELAY = 100;

const isOpen = ref(false);
const content = ref('');
const placement = ref('Mouse');
const placementTarget = shallowRef<HTMLElement | null>(null);
const theme = ref('');
const attachedElements = new Set<HTMLElement>();
const originalTitles = new WeakMap<HTMLElement, string | null>();
let activeElement: HTMLElement | null = null;
let pendingElement: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let openTimer: number | undefined;
let closeTimer: number | undefined;
let touchDismissTimer: number | undefined;
let lastClosedAt = 0;

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
    element.setAttribute('title', text);
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
  else element.setAttribute('title', text);
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

function openFor(element: HTMLElement) {
  const text = toolTipText(element);
  if (text === null) return;
  clearCloseTimer();
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

function queueOpen(element: HTMLElement, immediate = false) {
  if (activeElement === element && isOpen.value) {
    clearCloseTimer();
    return;
  }
  if (pendingElement === element) return;
  clearOpenTimer();
  clearCloseTimer();
  pendingElement = element;
  const recentlyClosed = performance.now() - lastClosedAt <= BETWEEN_SHOW_DELAY;
  const delay = immediate || recentlyClosed ? 0 : INITIAL_SHOW_DELAY;
  openTimer = window.setTimeout(() => openFor(element), delay);
}

function closeActive() {
  clearOpenTimer();
  clearCloseTimer();
  clearTouchDismissTimer();
  if (activeElement) restoreAttachedTitle(activeElement);
  activeElement = null;
  isOpen.value = false;
  placementTarget.value = null;
  content.value = '';
  lastClosedAt = performance.now();
}

function queueClose(element: HTMLElement) {
  if (pendingElement !== element && activeElement !== element) return;
  clearOpenTimer();
  clearCloseTimer();
  closeTimer = window.setTimeout(closeActive, BETWEEN_SHOW_DELAY);
}

function onPointerOver(event: PointerEvent) {
  const element = findToolTipElement(event.target);
  if (element) queueOpen(element);
}

function onPointerOut(event: PointerEvent) {
  const element = findToolTipElement(event.target);
  if (!element) return;
  const related = event.relatedTarget;
  if (related instanceof Node && element.contains(related)) return;
  queueClose(element);
}

function onPointerDown(event: PointerEvent) {
  const element = findToolTipElement(event.target);
  if (event.pointerType === 'touch' && element) {
    queueOpen(element, true);
    clearTouchDismissTimer();
    touchDismissTimer = window.setTimeout(closeActive, 5000);
  } else if (!element && activeElement) {
    closeActive();
  }
}

function onFocusIn(event: FocusEvent) {
  const element = findToolTipElement(event.target);
  if (element) queueOpen(element, true);
}

function onFocusOut(event: FocusEvent) {
  const element = findToolTipElement(event.target);
  if (element) queueClose(element);
}

onMounted(() => {
  document.querySelectorAll<HTMLElement>(TOOL_TIP_SELECTOR).forEach(syncNativeTitle);
  observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes' && record.target instanceof HTMLElement) syncNativeTitle(record.target);
      record.addedNodes.forEach(scanNode);
      record.removedNodes.forEach(releaseNode);
    });
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [TOOL_TIP_ATTRIBUTE],
    childList: true,
    subtree: true
  });
  document.addEventListener('pointerover', onPointerOver, true);
  document.addEventListener('pointerout', onPointerOut, true);
  document.addEventListener('pointerdown', onPointerDown, true);
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
  document.removeEventListener('pointerout', onPointerOut, true);
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('focusin', onFocusIn, true);
  document.removeEventListener('focusout', onFocusOut, true);
});
</script>
