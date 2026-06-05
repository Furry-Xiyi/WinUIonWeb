<template>
  <div class="win-nav-shell" :class="[position === 'Top' ? 'is-top' : 'is-left', hasTitlebar ? 'has-titlebar' : '']">
    <nav v-if="position === 'Top'" class="win-nav-top-bar" ref="navRef" @nav-indicator-update="onIndicatorUpdate">
      <div class="win-nav-indicator" :style="indicatorStyle"></div>
      <div class="win-nav-menu"><slot name="menuItems"></slot></div>
      <div style="flex:1"></div>
      <div class="win-nav-menu">
        <slot name="footerItems"></slot>
        <div class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === 'settings' }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" ref="settingsEl">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">&#xE713;</span>
          <span class="label">Settings</span>
        </div>
      </div>
    </nav>
    <nav v-else class="win-nav-left-panel" :class="{ 'is-compact': isCompact }" ref="navRef" @nav-indicator-update="onIndicatorUpdate">
      <div class="win-nav-hamburger"
           @click="isCompact = !isCompact"
           @mousedown="onHamburgerDown"
           @mouseup="onHamburgerUp"
           @mouseleave="onHamburgerLeave">
        <span class="icon animated-icon animated-icon-hamburger"
              :class="hamburgerClass"
              @animationend="onHamburgerAnimEnd">&#xE700;</span>
      </div>
      <div class="win-nav-indicator" :style="indicatorStyle"></div>
      <div class="win-nav-menu"><slot name="menuItems"></slot></div>
      <div style="flex:1"></div>
      <div class="win-nav-menu">
        <slot name="footerItems"></slot>
        <div class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === 'settings' }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" ref="settingsEl">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">&#xE713;</span>
          <span class="label">Settings</span>
        </div>
      </div>
    </nav>
    <main class="win-nav-content">
      <div class="win-nav-content-inner"><slot></slot></div>
    </main>
  </div>
</template>
<script setup>
import { ref, inject, provide, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
  position: { type: String, default: 'Left' },
  selectedValue: String
});

const titleBarVisible = inject('winTitleBarVisible', ref(false));
const hasTitlebar = computed(() => titleBarVisible.value);
const emit = defineEmits(['update:selectedValue']);
const isCompact = ref(false);
const navRef = ref(null);
const settingsEl = ref(null);
const indicatorStyle = ref({ opacity: '0' });
let lastSelectedValue = null;
let lastSelectedEl = null;
let ro = null;
let skipTransition = false;

const gearClass = ref('');
const hamburgerClass = ref('');
let gearPressed = false;
let gearRewindDone = false;
let hamburgerPressed = false;
let hamburgerPressDone = false;

const onGearDown = () => {
  gearPressed = true;
  gearRewindDone = false;
  gearClass.value = 'gear-rewind';
};
const onGearUp = () => {
  if (!gearPressed) return;
  gearPressed = false;
  if (gearRewindDone) gearClass.value = 'gear-spin';
};
const onGearLeave = () => { gearPressed = false; };
const onGearAnimEnd = () => {
  if (gearClass.value === 'gear-rewind') {
    gearRewindDone = true;
    if (!gearPressed) gearClass.value = 'gear-spin';
  } else if (gearClass.value === 'gear-spin') {
    gearClass.value = '';
    gearRewindDone = false;
  }
};

const onHamburgerDown = () => {
  hamburgerPressed = true;
  hamburgerPressDone = false;
  hamburgerClass.value = 'pressing';
};
const onHamburgerUp = () => {
  if (!hamburgerPressed) return;
  hamburgerPressed = false;
  if (hamburgerPressDone) hamburgerClass.value = 'releasing';
};
const onHamburgerLeave = () => { hamburgerPressed = false; };
const onHamburgerAnimEnd = () => {
  if (hamburgerClass.value === 'pressing') {
    hamburgerPressDone = true;
    if (!hamburgerPressed) hamburgerClass.value = 'releasing';
  } else if (hamburgerClass.value === 'releasing') {
    hamburgerClass.value = '';
    hamburgerPressDone = false;
  }
};

const selectSettings = () => {
  emit('update:selectedValue', 'settings');
  nextTick(reportSettings);
};

const reportSettings = () => {
  if (props.selectedValue === 'settings' && settingsEl.value) {
    lastSelectedEl = settingsEl.value;
    lastSelectedValue = 'settings';
    skipTransition = false;
    calcIndicator();
  }
};

provide('navContext', { selectedValue: () => props.selectedValue, select: (val) => emit('update:selectedValue', val) });

const calcIndicator = () => {
  if (!navRef.value || !lastSelectedEl) return;
  if (!navRef.value.contains(lastSelectedEl)) return;
  const navRect = navRef.value.getBoundingClientRect();
  const elRect = lastSelectedEl.getBoundingClientRect();
  const base = skipTransition ? { transition: 'none' } : {};
  if (props.position === 'Top') {
    const cx = elRect.left - navRect.left + elRect.width / 2 - 8;
    indicatorStyle.value = { ...base, transform: `translateX(${cx}px)`, width: '16px', opacity: '1' };
  } else {
    const cy = elRect.top - navRect.top + elRect.height / 2 - 8;
    indicatorStyle.value = { ...base, transform: `translateY(${cy}px)`, opacity: '1' };
  }
};

const onResize = () => { skipTransition = true; calcIndicator(); requestAnimationFrame(() => { skipTransition = false; }); };

const onIndicatorUpdate = (e) => {
  lastSelectedEl = e.detail.el;
  lastSelectedValue = null;
  skipTransition = false;
  calcIndicator();
};

const rebindRo = () => {
  if (ro) ro.disconnect();
  ro = new ResizeObserver(onResize);
  if (navRef.value) ro.observe(navRef.value);
};

const refreshAfterPositionChange = () => {
  skipTransition = true;
  nextTick(() => {
    rebindRo();
    if (props.selectedValue === 'settings') {
      reportSettings();
    } else if (navRef.value) {
      const sel = navRef.value.querySelector('.win-nav-item.is-selected');
      if (sel) { lastSelectedEl = sel; calcIndicator(); }
    }
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

onMounted(() => { rebindRo(); if (props.selectedValue === 'settings') nextTick(reportSettings); });
onBeforeUnmount(() => { if (ro) ro.disconnect(); });
watch(() => props.selectedValue, (v) => { if (v === 'settings') nextTick(reportSettings); });
watch(() => props.position, refreshAfterPositionChange);
watch(isCompact, () => setTimeout(() => { skipTransition = false; calcIndicator(); }, 260));</script>
<style src="../styles/navigationview.css"></style>
