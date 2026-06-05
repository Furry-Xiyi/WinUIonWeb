<template>
  <div class="win-nav-shell" :class="[position === 'Top' ? 'is-top' : 'is-left', hasTitlebar ? 'has-titlebar' : '']">
    <nav v-if="position === 'Top'" class="win-nav-top-bar" ref="navRef" @nav-indicator-update="onIndicatorUpdate">
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :style="indicatorStyle"></div>
      </div>
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
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :style="indicatorStyle"></div>
      </div>
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
const indicatorTrack = ref(null);
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
let prevSelectedEl = null;
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
  const sourceEl = prevSelectedEl && prevSelectedEl !== lastSelectedEl ? prevSelectedEl : null;
  prevSelectedEl = lastSelectedEl;
  if (!navRef.value || !lastSelectedEl) return;
  if (!navRef.value.contains(lastSelectedEl)) return;
  const navRect = navRef.value.getBoundingClientRect();
  const elRect = lastSelectedEl.getBoundingClientRect();
  const track = navRef.value.querySelector('.win-nav-indicator-track');
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl) return;

  const getItemRect = (el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - navRect.left, right: r.right - navRect.left, top: r.top - navRect.top, bottom: r.bottom - navRect.top };
  };

  const targetRect = getItemRect(lastSelectedEl);
  const sourceRect = sourceEl ? getItemRect(sourceEl) : null;

  const makeClipX = (r1, r2) => {
    if (!r2) return `polygon(${r1.left}px 0%, ${r1.right}px 0%, ${r1.right}px 100%, ${r1.left}px 100%)`;
    const left1 = Math.min(r1.left, r2.left);
    const right1 = r1.left < r2.left ? r1.right : r2.right;
    const left2 = r1.left < r2.left ? r2.left : r1.left;
    const right2 = Math.max(r1.right, r2.right);
    if (right1 >= left2) {
      return `polygon(${left1}px 0%, ${right2}px 0%, ${right2}px 100%, ${left1}px 100%)`;
    }
    return `polygon(${left1}px 0%, ${right1}px 0%, ${right1}px 100%, ${left1}px 100%, ${left1}px 0%, ${left2}px 0%, ${left2}px 100%, ${right2}px 100%, ${right2}px 0%, ${left2}px 0%)`;
  };

  const makeClipY = (r1, r2) => {
    if (!r2) return `polygon(0% ${r1.top}px, 100% ${r1.top}px, 100% ${r1.bottom}px, 0% ${r1.bottom}px)`;
    const top1 = Math.min(r1.top, r2.top);
    const bottom1 = r1.top < r2.top ? r1.bottom : r2.bottom;
    const top2 = r1.top < r2.top ? r2.top : r1.top;
    const bottom2 = Math.max(r1.bottom, r2.bottom);
    if (bottom1 >= top2) {
      return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
    }
    return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom1}px, 0% ${bottom1}px, 0% ${top2}px, 100% ${top2}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
  };

  if (props.position === 'Top') {
    const newX = elRect.left - navRect.left + elRect.width / 2 - 8;

    if (skipTransition || indicatorStyle.value.opacity === '0') {
      indicatorEl.getAnimations().forEach(a => a.cancel());
      track.style.clipPath = makeClipX(targetRect, null);
      indicatorStyle.value = { transition: 'none', transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      return;
    }
    const currentTransform = indicatorStyle.value.transform || '';
    const match = currentTransform.match(/translateX\(([-\d.]+)px\)/);
    const oldX = match ? parseFloat(match[1]) : newX;
    const dist = Math.abs(newX - oldX);
    if (dist < 1) {
      track.style.clipPath = makeClipX(targetRect, null);
      indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1' };
      return;
    }

    const stretchW = dist + 16;
    indicatorEl.getAnimations().forEach(a => a.cancel());
    const hideThreshold = 160;

    if (stretchW <= hideThreshold) {
      indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
      track.style.clipPath = makeClipX(targetRect, sourceRect);
      const movingRight = newX > oldX;
      const dur = 300;
      const easeOut = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
      let keyframes;
      if (movingRight) {
        keyframes = [
          { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeOut },
          { transform: `translateX(${oldX}px)`, width: `${stretchW}px`, offset: 0.333, easing: easeOut },
          { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
        ];
      } else {
        keyframes = [
          { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeOut },
          { transform: `translateX(${newX}px)`, width: `${stretchW}px`, offset: 0.333, easing: easeOut },
          { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
        ];
      }
      const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
      anim.onfinish = () => {
        indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1', transition: 'none' };
        track.style.clipPath = makeClipX(targetRect, null);
      };
      return;
    }

    const movingRight = newX > oldX;
    indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
    track.style.clipPath = makeClipX(targetRect, sourceRect);

    const collapseDur = 350;
    const expandDur = 350;
    const expandDelay = 80;
    const easeCollapse = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)';
    const easeExpand = 'cubic-bezier(0.1, 0.9, 0.2, 1)';

    let collapseKeyframes, expandKeyframes;
    if (movingRight) {
      collapseKeyframes = [
        { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeCollapse },
        { transform: `translateX(${oldX + 16}px)`, width: '0px', offset: 1 }
      ];
      expandKeyframes = [
        { transform: `translateX(${newX}px)`, width: '0px', offset: 0, easing: easeExpand },
        { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
      ];
    } else {
      collapseKeyframes = [
        { transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeCollapse },
        { transform: `translateX(${oldX}px)`, width: '0px', offset: 1 }
      ];
      expandKeyframes = [
        { transform: `translateX(${newX + 16}px)`, width: '0px', offset: 0, easing: easeExpand },
        { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }
      ];
    }

    const collapseAnim = indicatorEl.animate(collapseKeyframes, { duration: collapseDur, fill: 'forwards' });
    collapseAnim.onfinish = () => {
      const expandAnim = indicatorEl.animate(expandKeyframes, { duration: expandDur, fill: 'forwards' });
      expandAnim.onfinish = () => {
        indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1', transition: 'none' };
        track.style.clipPath = makeClipX(targetRect, null);
      };
    };

  } else {
    const newY = elRect.top - navRect.top + elRect.height / 2 - 8;

    if (skipTransition || indicatorStyle.value.opacity === '0') {
      indicatorEl.getAnimations().forEach(a => a.cancel());
      track.style.clipPath = makeClipY(targetRect, null);
      indicatorStyle.value = { transition: 'none', transform: `translateY(${newY}px)`, height: '16px', opacity: '1' };
      return;
    }
    const currentTransform = indicatorStyle.value.transform || '';
    const match = currentTransform.match(/translateY\(([-\d.]+)px\)/);
    const oldY = match ? parseFloat(match[1]) : newY;
    const dist = Math.abs(newY - oldY);
    if (dist < 1) {
      track.style.clipPath = makeClipY(targetRect, null);
      indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1' };
      return;
    }

    track.style.clipPath = makeClipY(targetRect, sourceRect);

    const movingDown = newY > oldY;
    const stretchH = dist + 16;
    indicatorEl.getAnimations().forEach(a => a.cancel());
    indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' };

    const dur = 300;
    const easeOut = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
    let keyframes;
    if (movingDown) {
      keyframes = [
        { transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeOut },
        { transform: `translateY(${oldY}px)`, height: `${stretchH}px`, offset: 0.2, easing: easeOut },
        { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }
      ];
    } else {
      keyframes = [
        { transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeOut },
        { transform: `translateY(${newY}px)`, height: `${stretchH}px`, offset: 0.2, easing: easeOut },
        { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }
      ];
    }
    const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
    anim.onfinish = () => { track.style.clipPath = makeClipY(targetRect, null); };
  }
};

const onResize = () => {
  skipTransition = true;
  nextTick(() => {
    calcIndicator();
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

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

onMounted(() => {
  rebindRo();
  window.addEventListener('resize', onResize);
  if (props.selectedValue === 'settings') nextTick(reportSettings);
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  window.removeEventListener('resize', onResize);
});
watch(() => props.selectedValue, (v) => { if (v === 'settings') nextTick(reportSettings); });
watch(() => props.position, refreshAfterPositionChange);
watch(isCompact, () => setTimeout(() => { skipTransition = false; calcIndicator(); }, 260));</script>
<style src="../styles/navigationview.css"></style>
