<template>
  <div class="win-nav-shell" :class="[position === 'Top' ? 'is-top' : 'is-left', hasTitlebar ? 'has-titlebar' : '']">
    <nav v-if="position === 'Top'" class="win-nav-top-bar" ref="navRef">
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :style="indicatorStyle"></div>
      </div>
      <div class="win-nav-menu">
        <template v-for="item in menuItems" :key="item.value">
          <div v-if="!item.children" class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </div>
          <div v-else class="win-nav-group" :class="{ 'is-child-selected': isChildOfGroup(item) }">
            <div class="win-nav-item win-nav-group-header" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value }" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
              <span class="icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
              <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)">&#xE70D;</span>
            </div>
          </div>
        </template>
      </div>
      <div style="flex:1"></div>
      <div class="win-nav-menu">
        <template v-for="item in footerItems" :key="item.value">
          <div class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </div>
        </template>
        <div class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === 'settings' }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef('settings', el)">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">&#xE713;</span>
          <span class="label">Settings</span>
        </div>
      </div>
    </nav>
    <nav v-else class="win-nav-left-panel" :class="{ 'is-compact': isCompact }" ref="navRef">
      <div class="win-nav-indicator-track" ref="indicatorTrack">
        <div class="win-nav-indicator" :class="{ 'is-child': indicatorIsChild }" :style="indicatorStyle"></div>
      </div>
      <div class="win-nav-hamburger" @click="toggleCompact" @mousedown="onHamburgerDown" @mouseup="onHamburgerUp" @mouseleave="onHamburgerLeave">
        <span class="icon animated-icon animated-icon-hamburger" :class="hamburgerClass" @animationend="onHamburgerAnimEnd">&#xE700;</span>
      </div>
      <div class="win-nav-left-scrollable" ref="scrollArea" @scroll="onScroll">
        <div class="win-nav-menu">
          <template v-for="item in menuItems" :key="item.value">
            <div v-if="!item.children" class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
              <span class="icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </div>
            <div v-else class="win-nav-group" :class="{ 'is-expanded': groupExpanded[item.value], 'is-child-selected': isChildOfGroup(item) }">
              <div class="win-nav-item win-nav-group-header" :class="{ 'is-selected': item.selectsOnInvoked !== false && selectedValue === item.value }" @click="onGroupHeaderClick(item)" :ref="el => setItemRef(item.value, el)">
                <span class="icon">{{ item.icon }}</span>
                <span class="label">{{ item.label }}</span>
                <span class="icon win-nav-group-chevron" :class="groupChevronClass(item.value)">&#xE70D;</span>
              </div>
              <div v-if="!isCompact" class="win-nav-group-children" :style="{ height: groupExpanded[item.value] ? (groupHeights[item.value] || 0) + 'px' : '0px' }">
                <div class="win-nav-group-children-inner" :ref="el => setChildrenRef(item.value, el)">
                  <div v-for="child in item.children" :key="child.value" class="win-nav-item win-nav-group-child" :class="{ 'is-selected': selectedValue === child.value }" @click="onChildClick(item, child)" :ref="el => setItemRef(child.value, el)">
                    <span class="icon">{{ child.icon }}</span>
                    <span class="label">{{ child.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="win-nav-footer">
        <template v-for="item in footerItems" :key="item.value">
          <div class="win-nav-item" :class="{ 'is-selected': selectedValue === item.value }" @click="onItemClick(item)" :ref="el => setItemRef(item.value, el)">
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </div>
        </template>
        <div class="win-nav-item win-nav-settings-item" :class="{ 'is-selected': selectedValue === 'settings' }" @click="selectSettings" @mousedown="onGearDown" @mouseup="onGearUp" @mouseleave="onGearLeave" :ref="el => setItemRef('settings', el)">
          <span class="icon animated-icon animated-icon-gear" :class="gearClass" @animationend="onGearAnimEnd">&#xE713;</span>
          <span class="label">Settings</span>
        </div>
      </div>
    </nav>
    <main class="win-nav-content">
      <div class="win-nav-content-inner"><slot></slot></div>
    </main>
    <WinMenuFlyout :open="flyoutOpen" :anchorRect="flyoutAnchor" :items="flyoutItems" @close="closeFlyout" @select="onFlyoutSelect" />
  </div>
</template>
<script setup>import { ref, reactive, inject, provide, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

const props = defineProps({
  position: { type: String, default: 'Left' },
  selectedValue: String,
  menuItems: { type: Array, default: () => [] },
  footerItems: { type: Array, default: () => [] }
});

const titleBarVisible = inject('winTitleBarVisible', ref(false));
const hasTitlebar = computed(() => titleBarVisible.value);
const emit = defineEmits(['update:selectedValue']);
const isCompact = ref(false);
const navRef = ref(null);
const indicatorTrack = ref(null);
const scrollArea = ref(null);
const indicatorStyle = ref({ opacity: '0' });
const indicatorIsChild = ref(false);
const groupExpanded = reactive({});
const groupHeights = reactive({});
const groupChevrons = reactive({});
const flyoutOpen = ref(false);
const flyoutAnchor = ref(null);
const flyoutItems = ref([]);
const flyoutGroupValue = ref(null);

let itemRefs = {};
let childrenRefs = {};
let prevSelectedEl = null;
let lastSelectedEl = null;
let lastIsChild = false;
let prevIsChild = false;
let ro = null;
let skipTransition = false;

const gearClass = ref('');
const hamburgerClass = ref('');
let gearPressed = false;
let gearRewindDone = false;
let hamburgerPressed = false;
let hamburgerPressDone = false;

const childParentMap = computed(() => {
  const map = {};
  for (const item of props.menuItems) {
    if (item.children) {
      for (const child of item.children) {
        map[child.value] = item.value;
      }
    }
  }
  return map;
});

const isChildOfGroup = (groupItem) => {
  if (!groupItem.children) return false;
  return groupItem.children.some(c => c.value === props.selectedValue);
};

const findParentGroup = (val) => {
  return props.menuItems.find(item => item.children && item.children.some(c => c.value === val));
};

const setItemRef = (value, el) => {
  if (el) itemRefs[value] = el;
};

const setChildrenRef = (value, el) => {
  if (el) childrenRefs[value] = el;
};

const groupChevronClass = (value) => {
  return groupChevrons[value] || '';
};

const measureGroup = (value) => {
  const el = childrenRefs[value];
  if (el) {
    groupHeights[value] = el.scrollHeight;
  }
};

const measureAllGroups = () => {
  for (const item of props.menuItems) {
    if (item.children) measureGroup(item.value);
  }
};

const onItemClick = (item) => {
  emit('update:selectedValue', item.value);
  nextTick(() => moveIndicatorTo(item.value, false));
};

const onChildClick = (group, child) => {
  emit('update:selectedValue', child.value);
  nextTick(() => moveIndicatorTo(child.value, true));
};

const onGroupHeaderClick = (item) => {
  if (props.position === 'Top') {
    const el = itemRefs[item.value];
    if (el) {
      const rect = el.getBoundingClientRect();
      flyoutAnchor.value = rect;
      flyoutGroupValue.value = item.value;
      const items = [];
      if (item.selectsOnInvoked !== false) {
        items.push({ label: item.label, value: item.value, isHeader: true });
      }
      for (const child of (item.children || [])) {
        items.push({ label: child.label, value: child.value });
      }
      flyoutItems.value = items;
      flyoutOpen.value = !flyoutOpen.value;
      groupChevrons[item.value] = flyoutOpen.value ? 'chevron-open' : 'chevron-close';
    }
    return;
  }
  if (isCompact.value) {
    const el = itemRefs[item.value];
    if (el) {
      const rect = el.getBoundingClientRect();
      flyoutAnchor.value = { left: rect.right, top: rect.top, bottom: rect.bottom, width: 0, height: rect.height };
      flyoutGroupValue.value = item.value;
      const items = [];
      if (item.selectsOnInvoked !== false) {
        items.push({ label: item.label, value: item.value, isHeader: true });
      }
      for (const child of (item.children || [])) {
        items.push({ label: child.label, value: child.value });
      }
      flyoutItems.value = items;
      flyoutOpen.value = true;
      groupChevrons[item.value] = 'chevron-open';
    }
    return;
  }
  if (item.selectsOnInvoked !== false && !isChildOfGroup(item)) {
    emit('update:selectedValue', item.value);
    nextTick(() => moveIndicatorTo(item.value, false));
  }
  const wasExpanded = groupExpanded[item.value];
  groupExpanded[item.value] = !wasExpanded;
  nextTick(() => measureGroup(item.value));
  if (wasExpanded && isChildOfGroup(item)) {
    const header = itemRefs[item.value];
    if (header) {
      prevSelectedEl = lastSelectedEl;
      prevIsChild = lastIsChild;
      lastSelectedEl = header;
      lastIsChild = false;
      skipTransition = false;
      calcIndicator();
    }
  } else if (!wasExpanded && isChildOfGroup(item)) {
    nextTick(() => {
      measureGroup(item.value);
      setTimeout(() => {
        const sel = itemRefs[props.selectedValue];
        if (sel) {
          prevSelectedEl = lastSelectedEl;
          prevIsChild = lastIsChild;
          lastSelectedEl = sel;
          lastIsChild = true;
          skipTransition = false;
          calcIndicator();
        }
      }, 300);
    });
  } else {
    trackIndicatorDuringTransition();
  }
};

let trackingRaf = null;
const trackIndicatorDuringTransition = () => {
  if (trackingRaf) cancelAnimationFrame(trackingRaf);
  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl || !lastSelectedEl || !navRef.value) return;
  indicatorEl.getAnimations().forEach(a => a.cancel());
  const startTime = performance.now();
  const duration = 350;
  const tick = () => {
    if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
      trackingRaf = null;
      return;
    }
    const trackRect = track.getBoundingClientRect();
    const elRect = lastSelectedEl.getBoundingClientRect();
    const newY = elRect.top - trackRect.top + elRect.height / 2 - 8;
    const targetRect = {
      top: elRect.top - trackRect.top,
      bottom: elRect.bottom - trackRect.top
    };
    track.style.clipPath = `polygon(0% ${targetRect.top}px, 100% ${targetRect.top}px, 100% ${targetRect.bottom}px, 0% ${targetRect.bottom}px)`;
    indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' };
    if (performance.now() - startTime < duration) {
      trackingRaf = requestAnimationFrame(tick);
    } else {
      trackingRaf = null;
    }
  };
  trackingRaf = requestAnimationFrame(tick);
};

const closeFlyout = () => {
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    groupChevrons[flyoutGroupValue.value] = 'chevron-close';
  }
};

const onFlyoutSelect = (item) => {
  emit('update:selectedValue', item.value);
  flyoutOpen.value = false;
  if (flyoutGroupValue.value) {
    groupChevrons[flyoutGroupValue.value] = 'chevron-close';
  }
  nextTick(() => {
    if (props.position === 'Top') {
      const groupEl = itemRefs[flyoutGroupValue.value];
      if (groupEl && !item.isHeader) {
        moveIndicatorToEl(groupEl, false);
      } else {
        moveIndicatorTo(item.value, false);
      }
    } else {
      const parentGroup = findParentGroup(item.value);
      if (parentGroup) {
        moveIndicatorToEl(itemRefs[parentGroup.value], false);
      } else {
        moveIndicatorTo(item.value, false);
      }
    }
  });
};

const moveIndicatorTo = (value, isChild) => {
  const el = itemRefs[value];
  if (!el) return;
  moveIndicatorToEl(el, isChild);
};

const moveIndicatorToEl = (el, isChild) => {
  prevSelectedEl = lastSelectedEl;
  prevIsChild = lastIsChild;
  lastSelectedEl = el;
  lastIsChild = isChild;
  calcIndicator();
};

const selectSettings = () => {
  emit('update:selectedValue', 'settings');
  nextTick(() => moveIndicatorTo('settings', false));
};

const toggleCompact = () => {
  isCompact.value = !isCompact.value;
};

const onGearDown = () => { gearPressed = true; gearRewindDone = false; gearClass.value = 'gear-rewind'; };
const onGearUp = () => { if (!gearPressed) return; gearPressed = false; if (gearRewindDone) gearClass.value = 'gear-spin'; };
const onGearLeave = () => { gearPressed = false; };
const onGearAnimEnd = () => {
  if (gearClass.value === 'gear-rewind') { gearRewindDone = true; if (!gearPressed) gearClass.value = 'gear-spin'; }
  else if (gearClass.value === 'gear-spin') { gearClass.value = ''; gearRewindDone = false; }
};

const onHamburgerDown = () => { hamburgerPressed = true; hamburgerPressDone = false; hamburgerClass.value = 'pressing'; };
const onHamburgerUp = () => { if (!hamburgerPressed) return; hamburgerPressed = false; if (hamburgerPressDone) hamburgerClass.value = 'releasing'; };
const onHamburgerLeave = () => { hamburgerPressed = false; };
const onHamburgerAnimEnd = () => {
  if (hamburgerClass.value === 'pressing') { hamburgerPressDone = true; if (!hamburgerPressed) hamburgerClass.value = 'releasing'; }
  else if (hamburgerClass.value === 'releasing') { hamburgerClass.value = ''; hamburgerPressDone = false; }
};

const onScroll = () => {
  if (lastSelectedEl && navRef.value && navRef.value.contains(lastSelectedEl)) {
    skipTransition = true;
    calcIndicator();
    requestAnimationFrame(() => { skipTransition = false; });
  }
};

const calcIndicator = () => {
  const sourceEl = prevSelectedEl && prevSelectedEl !== lastSelectedEl ? prevSelectedEl : null;
  prevSelectedEl = lastSelectedEl;
  if (!navRef.value || !lastSelectedEl) return;
  if (!navRef.value.contains(lastSelectedEl)) return;

  const track = indicatorTrack.value;
  const indicatorEl = track?.querySelector('.win-nav-indicator');
  if (!track || !indicatorEl) return;

  const trackRect = track.getBoundingClientRect();
  const elRect = lastSelectedEl.getBoundingClientRect();

  const getItemRectRelTrack = (el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - trackRect.left, right: r.right - trackRect.left, top: r.top - trackRect.top, bottom: r.bottom - trackRect.top };
  };

  const targetRect = getItemRectRelTrack(lastSelectedEl);
  const sourceRect = sourceEl && navRef.value.contains(sourceEl) ? getItemRectRelTrack(sourceEl) : null;

  const makeClipX = (r1, r2) => {
    if (!r2) return `polygon(${r1.left}px 0%, ${r1.right}px 0%, ${r1.right}px 100%, ${r1.left}px 100%)`;
    const left1 = Math.min(r1.left, r2.left);
    const right1 = r1.left < r2.left ? r1.right : r2.right;
    const left2 = r1.left < r2.left ? r2.left : r1.left;
    const right2 = Math.max(r1.right, r2.right);
    if (right1 >= left2) return `polygon(${left1}px 0%, ${right2}px 0%, ${right2}px 100%, ${left1}px 100%)`;
    return `polygon(${left1}px 0%, ${right1}px 0%, ${right1}px 100%, ${left1}px 100%, ${left1}px 0%, ${left2}px 0%, ${left2}px 100%, ${right2}px 100%, ${right2}px 0%, ${left2}px 0%)`;
  };

  const makeClipY = (r1, r2) => {
    if (!r2) return `polygon(0% ${r1.top}px, 100% ${r1.top}px, 100% ${r1.bottom}px, 0% ${r1.bottom}px)`;
    const top1 = Math.min(r1.top, r2.top);
    const bottom1 = r1.top < r2.top ? r1.bottom : r2.bottom;
    const top2 = r1.top < r2.top ? r2.top : r1.top;
    const bottom2 = Math.max(r1.bottom, r2.bottom);
    if (bottom1 >= top2) return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
    return `polygon(0% ${top1}px, 100% ${top1}px, 100% ${bottom1}px, 0% ${bottom1}px, 0% ${top2}px, 100% ${top2}px, 100% ${bottom2}px, 0% ${bottom2}px)`;
  };

  const crossLevel = (lastIsChild !== prevIsChild) && sourceEl;

  const snapToFinal = (finalTransform, dimension, finalSize) => {
    requestAnimationFrame(() => {
      if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) return;
      const freshTrackRect = track.getBoundingClientRect();
      const freshElRect = lastSelectedEl.getBoundingClientRect();
      const freshTargetRect = getItemRectRelTrack(lastSelectedEl);
      let expectedPos;
      if (dimension === 'x') {
        expectedPos = freshElRect.left - freshTrackRect.left + freshElRect.width / 2 - 8;
        track.style.clipPath = makeClipX(freshTargetRect, null);
        indicatorStyle.value = { transform: `translateX(${expectedPos}px)`, width: '16px', opacity: '1', transition: 'none' };
      } else {
        expectedPos = freshElRect.top - freshTrackRect.top + freshElRect.height / 2 - 8;
        track.style.clipPath = makeClipY(freshTargetRect, null);
        indicatorStyle.value = { transform: `translateY(${expectedPos}px)`, height: '16px', opacity: '1', transition: 'none' };
      }
    });
  };

  if (props.position === 'Top') {
    const newX = elRect.left - trackRect.left + elRect.width / 2 - 8;
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
    if (dist < 1) { track.style.clipPath = makeClipX(targetRect, null); indicatorStyle.value = { transform: `translateX(${newX}px)`, width: '16px', opacity: '1' }; return; }

    const stretchW = dist + 16;
    indicatorEl.getAnimations().forEach(a => a.cancel());
    const hideThreshold = 160;

    if (stretchW <= hideThreshold) {
      indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
      track.style.clipPath = makeClipX(targetRect, sourceRect);
      const movingRight = newX > oldX;
      const dur = 600;
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
      anim.onfinish = () => snapToFinal(`translateX(${newX}px)`, 'x', '16px');
      return;
    }

    const movingRight = newX > oldX;
    indicatorStyle.value = { transform: `translateX(${oldX}px)`, width: '16px', opacity: '1', transition: 'none' };
    track.style.clipPath = makeClipX(targetRect, sourceRect);
    const collapseDur = 350; const expandDur = 350;
    const easeCollapse = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)'; const easeExpand = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
    let collapseKeyframes, expandKeyframes;
    if (movingRight) {
      collapseKeyframes = [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeCollapse }, { transform: `translateX(${oldX + 16}px)`, width: '0px', offset: 1 }];
      expandKeyframes = [{ transform: `translateX(${newX}px)`, width: '0px', offset: 0, easing: easeExpand }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }];
    } else {
      collapseKeyframes = [{ transform: `translateX(${oldX}px)`, width: '16px', offset: 0, easing: easeCollapse }, { transform: `translateX(${oldX}px)`, width: '0px', offset: 1 }];
      expandKeyframes = [{ transform: `translateX(${newX + 16}px)`, width: '0px', offset: 0, easing: easeExpand }, { transform: `translateX(${newX}px)`, width: '16px', offset: 1 }];
    }
    const collapseAnim = indicatorEl.animate(collapseKeyframes, { duration: collapseDur, fill: 'forwards' });
    collapseAnim.onfinish = () => {
      const expandAnim = indicatorEl.animate(expandKeyframes, { duration: expandDur, fill: 'forwards' });
      expandAnim.onfinish = () => snapToFinal(`translateX(${newX}px)`, 'x', '16px');
    };

  } else {
    const newY = elRect.top - trackRect.top + elRect.height / 2 - 8;

    const scrollEl = scrollArea.value;
    let visibleTop = 0;
    let visibleBottom = trackRect.height;
    if (scrollEl) {
      const scrollRect = scrollEl.getBoundingClientRect();
      visibleTop = scrollRect.top - trackRect.top;
      visibleBottom = scrollRect.bottom - trackRect.top;
    }

    const isInFooter = !scrollEl || !scrollEl.contains(lastSelectedEl);
    if (isInFooter) {
      visibleTop = 0;
      visibleBottom = trackRect.height;
    }

    const clampedTargetRect = {
      top: isInFooter ? targetRect.top : Math.max(targetRect.top, visibleTop),
      bottom: isInFooter ? targetRect.bottom : Math.min(targetRect.bottom, visibleBottom),
      left: targetRect.left,
      right: targetRect.right
    };

    if (clampedTargetRect.top >= clampedTargetRect.bottom) {
      indicatorStyle.value = { opacity: '0', transition: 'none' };
      return;
    }

    if (skipTransition || indicatorStyle.value.opacity === '0') {
      indicatorEl.getAnimations().forEach(a => a.cancel());
      track.style.clipPath = makeClipY(clampedTargetRect, null);
      indicatorStyle.value = { transition: 'none', transform: `translateY(${newY}px)`, height: '16px', opacity: '1' };
      indicatorIsChild.value = lastIsChild;
      return;
    }
    const currentTransform = indicatorStyle.value.transform || '';
    const match = currentTransform.match(/translateY\(([-\d.]+)px\)/);
    const oldY = match ? parseFloat(match[1]) : newY;
    const dist = Math.abs(newY - oldY);
    if (dist < 1) { track.style.clipPath = makeClipY(clampedTargetRect, null); indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1' }; indicatorIsChild.value = lastIsChild; return; }

    let clampedSourceRect = sourceRect;
    if (sourceRect && scrollEl) {
      const sourceInFooter = sourceEl && !scrollEl.contains(sourceEl);
      if (!sourceInFooter) {
        clampedSourceRect = {
          top: Math.max(sourceRect.top, visibleTop),
          bottom: Math.min(sourceRect.bottom, visibleBottom),
          left: sourceRect.left,
          right: sourceRect.right
        };
        if (clampedSourceRect.top >= clampedSourceRect.bottom) clampedSourceRect = null;
      }
    }

    track.style.clipPath = makeClipY(clampedTargetRect, clampedSourceRect);
    indicatorEl.getAnimations().forEach(a => a.cancel());

    if (crossLevel) {
      indicatorStyle.value = { transform: `translateY(${oldY}px)`, height: '16px', opacity: '1', transition: 'none' };
      const movingDown = newY > oldY;
      const collapseDur = 350; const expandDur = 350;
      const easeCollapse = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)'; const easeExpand = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
      let collapseKf, expandKf;
      if (movingDown) {
        collapseKf = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeCollapse }, { transform: `translateY(${oldY + 16}px)`, height: '0px', offset: 1 }];
        expandKf = [{ transform: `translateY(${newY}px)`, height: '0px', offset: 0, easing: easeExpand }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
      } else {
        collapseKf = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeCollapse }, { transform: `translateY(${oldY}px)`, height: '0px', offset: 1 }];
        expandKf = [{ transform: `translateY(${newY + 16}px)`, height: '0px', offset: 0, easing: easeExpand }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
      }
      const collapseAnim = indicatorEl.animate(collapseKf, { duration: collapseDur, fill: 'forwards' });
      collapseAnim.onfinish = () => {
        indicatorIsChild.value = lastIsChild;
        const expandAnim = indicatorEl.animate(expandKf, { duration: expandDur, fill: 'forwards' });
        expandAnim.onfinish = () => snapToFinal(`translateY(${newY}px)`, 'y', '16px');
      };
      return;
    }

    indicatorIsChild.value = lastIsChild;
    const movingDown = newY > oldY;
    const stretchH = dist + 16;
    indicatorStyle.value = { transform: `translateY(${newY}px)`, height: '16px', opacity: '1', transition: 'none' };
    const dur = 600; const easeOut = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
    let keyframes;
    if (movingDown) {
      keyframes = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeOut }, { transform: `translateY(${oldY}px)`, height: `${stretchH}px`, offset: 0.333, easing: easeOut }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
    } else {
      keyframes = [{ transform: `translateY(${oldY}px)`, height: '16px', offset: 0, easing: easeOut }, { transform: `translateY(${newY}px)`, height: `${stretchH}px`, offset: 0.333, easing: easeOut }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
    }
    const anim = indicatorEl.animate(keyframes, { duration: dur, fill: 'forwards' });
    anim.onfinish = () => snapToFinal(`translateY(${newY}px)`, 'y', '16px');
  }
};

let resizeTimer = null;
const onResize = () => {
  skipTransition = true;
  if (resizeTimer) cancelAnimationFrame(resizeTimer);
  if (!lastSelectedEl || !navRef.value || !navRef.value.contains(lastSelectedEl)) {
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup && (props.position === 'Top' || isCompact.value)) {
        lastSelectedEl = itemRefs[parentGroup.value] || null;
        lastIsChild = false;
      } else {
        lastSelectedEl = itemRefs[val] || null;
        lastIsChild = !!parentGroup;
      }
    }
  }
  calcIndicator();
  resizeTimer = requestAnimationFrame(() => {
    calcIndicator();
    resizeTimer = requestAnimationFrame(() => {
      calcIndicator();
      resizeTimer = requestAnimationFrame(() => {
        skipTransition = false;
      });
    });
  });
};
const rebindRo = () => { if (ro) ro.disconnect(); ro = new ResizeObserver(onResize); if (navRef.value) ro.observe(navRef.value); };

const refreshAfterPositionChange = () => {
  skipTransition = true;
  nextTick(() => {
    rebindRo();
    measureAllGroups();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (props.position === 'Top') {
          lastSelectedEl = itemRefs[parentGroup.value];
          lastIsChild = false;
        } else {
          lastSelectedEl = itemRefs[val];
          lastIsChild = true;
        }
      } else {
        lastSelectedEl = itemRefs[val];
        lastIsChild = false;
      }
      calcIndicator();
    }
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

const initIndicator = () => {
  skipTransition = true;
  nextTick(() => {
    measureAllGroups();
    const val = props.selectedValue;
    if (val) {
      const parentGroup = findParentGroup(val);
      if (parentGroup) {
        if (props.position !== 'Top') {
          if (!groupExpanded[parentGroup.value]) {
            groupExpanded[parentGroup.value] = true;
            nextTick(() => {
              measureGroup(parentGroup.value);
              nextTick(() => {
                lastSelectedEl = itemRefs[val];
                lastIsChild = true;
                indicatorIsChild.value = true;
                calcIndicator();
                requestAnimationFrame(() => { skipTransition = false; });
              });
            });
            return;
          }
          lastSelectedEl = itemRefs[val];
          lastIsChild = true;
          indicatorIsChild.value = true;
        } else {
          lastSelectedEl = itemRefs[parentGroup.value];
          lastIsChild = false;
        }
      } else {
        lastSelectedEl = itemRefs[val];
        lastIsChild = false;
      }
      calcIndicator();
    }
    requestAnimationFrame(() => { skipTransition = false; });
  });
};

onMounted(() => {
  rebindRo();
  window.addEventListener('resize', onResize);
  initIndicator();
});

onBeforeUnmount(() => { if (ro) ro.disconnect(); window.removeEventListener('resize', onResize); });

watch(() => props.position, refreshAfterPositionChange);

watch(isCompact, (compact) => {
  if (compact) {
    const parentGroup = findParentGroup(props.selectedValue);
    let savedOldY = null;
    if (parentGroup && lastSelectedEl && navRef.value && indicatorTrack.value) {
      const trackRect = indicatorTrack.value.getBoundingClientRect();
      const elRect = lastSelectedEl.getBoundingClientRect();
      savedOldY = elRect.top - trackRect.top + elRect.height / 2 - 8;
    }
    const wasChild = lastIsChild;
    for (const item of props.menuItems) {
      if (item.children && groupExpanded[item.value]) {
        groupExpanded[item.value] = false;
      }
    }
    if (parentGroup) {
      let animating = true;
      const origOnResize = onResize;
      const guardedResize = () => { if (!animating) origOnResize(); };
      if (ro) { ro.disconnect(); ro = new ResizeObserver(guardedResize); if (navRef.value) ro.observe(navRef.value); }
      nextTick(() => {
        const header = itemRefs[parentGroup.value];
        if (header) {
          lastSelectedEl = header;
          lastIsChild = false;
          if (savedOldY !== null && wasChild) {
            const track = indicatorTrack.value;
            const indicatorEl = track?.querySelector('.win-nav-indicator');
            if (track && indicatorEl) {
              const trackRect = track.getBoundingClientRect();
              const headerRect = header.getBoundingClientRect();
              const newY = headerRect.top - trackRect.top + headerRect.height / 2 - 8;
              const targetR = { top: headerRect.top - trackRect.top, bottom: headerRect.bottom - trackRect.top };
              indicatorEl.getAnimations().forEach(a => a.cancel());
              track.style.clipPath = `polygon(0% ${Math.min(targetR.top, savedOldY)}px, 100% ${Math.min(targetR.top, savedOldY)}px, 100% ${Math.max(targetR.bottom, savedOldY + 16)}px, 0% ${Math.max(targetR.bottom, savedOldY + 16)}px)`;
              indicatorIsChild.value = false;
              indicatorStyle.value = { transform: `translateY(${savedOldY}px)`, height: '16px', opacity: '1', transition: 'none' };
              const collapseDur = 300; const expandDur = 300;
              const easeCollapse = 'cubic-bezier(0.4, 0.0, 0.7, 0.3)';
              const easeExpand = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
              const movingDown = newY > savedOldY;
              let collapseKf, expandKf;
              if (movingDown) {
                collapseKf = [{ transform: `translateY(${savedOldY}px)`, height: '16px', offset: 0, easing: easeCollapse }, { transform: `translateY(${savedOldY + 16}px)`, height: '0px', offset: 1 }];
                expandKf = [{ transform: `translateY(${newY}px)`, height: '0px', offset: 0, easing: easeExpand }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
              } else {
                collapseKf = [{ transform: `translateY(${savedOldY}px)`, height: '16px', offset: 0, easing: easeCollapse }, { transform: `translateY(${savedOldY}px)`, height: '0px', offset: 1 }];
                expandKf = [{ transform: `translateY(${newY + 16}px)`, height: '0px', offset: 0, easing: easeExpand }, { transform: `translateY(${newY}px)`, height: '16px', offset: 1 }];
              }
              const collapseAnim = indicatorEl.animate(collapseKf, { duration: collapseDur, fill: 'forwards' });
              collapseAnim.onfinish = () => {
                const freshTrackRect = track.getBoundingClientRect();
                const freshHeaderRect = header.getBoundingClientRect();
                const freshNewY = freshHeaderRect.top - freshTrackRect.top + freshHeaderRect.height / 2 - 8;
                const freshTargetR = { top: freshHeaderRect.top - freshTrackRect.top, bottom: freshHeaderRect.bottom - freshTrackRect.top };
                const finalExpandKf = [
                  { transform: `translateY(${freshNewY}px)`, height: '0px', offset: 0, easing: easeExpand },
                  { transform: `translateY(${freshNewY}px)`, height: '16px', offset: 1 }
                ];
                track.style.clipPath = `polygon(0% ${freshTargetR.top}px, 100% ${freshTargetR.top}px, 100% ${freshTargetR.bottom}px, 0% ${freshTargetR.bottom}px)`;
                const expandAnim = indicatorEl.animate(finalExpandKf, { duration: expandDur, fill: 'forwards' });
                expandAnim.onfinish = () => {
                  animating = false;
                  rebindRo();
                  const ft = track.getBoundingClientRect();
                  const fh = header.getBoundingClientRect();
                  const fy = fh.top - ft.top + fh.height / 2 - 8;
                  const ftr = { top: fh.top - ft.top, bottom: fh.bottom - ft.top };
                  track.style.clipPath = `polygon(0% ${ftr.top}px, 100% ${ftr.top}px, 100% ${ftr.bottom}px, 0% ${ftr.bottom}px)`;
                  indicatorStyle.value = { transform: `translateY(${fy}px)`, height: '16px', opacity: '1', transition: 'none' };
                };
              };
            } else {
              animating = false;
              rebindRo();
            }
          } else {
            animating = false;
            rebindRo();
            skipTransition = true;
            calcIndicator();
            requestAnimationFrame(() => { skipTransition = false; });
          }
        } else {
          animating = false;
          rebindRo();
        }
      });
    }
  } else {
    const parentGroup = findParentGroup(props.selectedValue);
    if (parentGroup) {
      groupExpanded[parentGroup.value] = true;
      nextTick(() => {
        measureGroup(parentGroup.value);
        setTimeout(() => {
          const sel = itemRefs[props.selectedValue];
          if (sel) {
            prevSelectedEl = lastSelectedEl;
            prevIsChild = lastIsChild;
            lastSelectedEl = sel;
            lastIsChild = true;
            skipTransition = false;
            calcIndicator();
          }
        }, 300);
      });
    }
  }
});

watch(() => props.selectedValue, (val) => {
  if (!val) return;
  const parentGroup = findParentGroup(val);
  if (props.position === 'Top' && parentGroup) {
    nextTick(() => {
      const groupEl = itemRefs[parentGroup.value];
      if (groupEl) {
        moveIndicatorToEl(groupEl, false);
      }
    });
  }
});</script>
<style>
  .win-nav-shell {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--app-bg);
  }

    .win-nav-shell.is-left {
      flex-direction: row;
    }

    .win-nav-shell.is-top {
      flex-direction: column;
    }

  .win-nav-content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    background: var(--layer-default);
    overflow-y: auto;
    overflow-x: hidden;
    transition: background var(--normal-duration) var(--fast-out-slow-in);
    scrollbar-width: thin;
  }

  .win-nav-shell.is-left .win-nav-content {
    border-radius: 8px 0 0 0;
    border-top: 1px solid var(--ctrl-border-rest);
    border-left: 1px solid var(--ctrl-border-rest);
  }

  .win-nav-shell.is-top .win-nav-content {
    border-top: 1px solid var(--ctrl-border-rest);
    border-radius: 0;
  }

  .win-nav-content-inner {
    padding: 24px 32px;
  }

  .win-nav-left-panel {
    position: relative;
    width: 320px;
    display: flex;
    flex-direction: column;
    padding: 4px 4px;
    transition: width var(--normal-duration) var(--fast-out-slow-in), background var(--normal-duration) var(--fast-out-slow-in);
    flex-shrink: 0;
    overflow: hidden;
  }

    .win-nav-left-panel.is-compact {
      width: 48px;
    }

    .win-nav-left-panel .win-nav-indicator-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: visible;
      z-index: 3;
    }

  .win-nav-left-scrollable {
    flex: 1;
    min-height: 0;
    overflow-y: overlay;
    overflow-x: hidden;
    position: relative;
    scrollbar-width: thin;
  }

  .win-nav-footer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
    padding-top: 4px;
    position: relative;
    z-index: 2;
    background: var(--app-bg);
  }

  .win-nav-hamburger {
    width: 40px;
    height: 36px;
    margin-bottom: 4px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

    .win-nav-hamburger:hover {
      background: var(--subtle-secondary);
    }

    .win-nav-hamburger:active {
      background: var(--subtle-tertiary);
    }

  .win-nav-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .win-nav-top-bar {
    position: relative;
    width: 100%;
    height: 48px;
    transition: width var(--normal-duration) var(--fast-out-slow-in), background var(--normal-duration) var(--fast-out-slow-in);
    display: flex;
    align-items: center;
  }

    .win-nav-top-bar .win-nav-indicator-track {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
    }

    .win-nav-top-bar .win-nav-menu {
      flex-direction: row;
      align-items: center;
      gap: 4px;
      height: 100%;
    }

  .win-nav-item {
    position: relative;
    height: 36px;
    padding: 0 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: transparent;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
    white-space: nowrap;
    user-select: none;
  }

    .win-nav-item:hover {
      background: var(--subtle-secondary);
    }

    .win-nav-item:active {
      background: var(--subtle-tertiary);
    }

  .win-nav-left-panel .win-nav-item:active {
    color: var(--text-secondary);
  }

  .win-nav-item.is-selected {
    background: var(--subtle-secondary);
  }

    .win-nav-item.is-selected:hover {
      background: var(--subtle-tertiary);
    }

    .win-nav-item.is-selected:active {
      background: var(--subtle-pressed);
    }

  .win-nav-item .icon {
    margin-right: 16px;
    min-width: 16px;
    width: 16px;
    text-align: center;
    font-size: 16px;
    line-height: 1;
    position: relative;
  }

  .win-nav-left-panel.is-compact .win-nav-item .label {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-left-panel.is-compact .win-nav-group-chevron {
    opacity: 0;
    pointer-events: none;
  }

  .win-nav-indicator {
    position: absolute;
    background: var(--accent-base);
    border-radius: 3px;
    pointer-events: none;
    z-index: 10;
  }

  .win-nav-left-panel .win-nav-indicator {
    left: 4px;
    top: 0;
    width: 3px;
    height: 16px;
    transition: left 200ms var(--fast-out-slow-in);
  }

    .win-nav-left-panel .win-nav-indicator.is-child {
      left: 36px;
    }

  .win-nav-top-bar .win-nav-indicator {
    top: auto;
    bottom: 4px;
    left: 0;
    height: 3px;
  }

  .win-nav-top-bar .win-nav-item {
    justify-content: center;
    padding: 0 16px;
  }

    .win-nav-top-bar .win-nav-item:hover {
      background: transparent;
      opacity: 0.8;
    }

    .win-nav-top-bar .win-nav-item:active {
      opacity: 0.6;
      transition: opacity 0.06s ease-out;
    }

    .win-nav-top-bar .win-nav-item.is-selected:active {
      opacity: 0.6;
    }

    .win-nav-top-bar .win-nav-item.is-selected {
      background: transparent;
    }

      .win-nav-top-bar .win-nav-item.is-selected:hover {
        background: transparent;
      }

    .win-nav-top-bar .win-nav-item .icon {
      margin-right: 8px;
      top: 0.5px;
    }

  .win-nav-top-bar .win-nav-settings-item .label {
    display: none;
  }

  .win-nav-top-bar .win-nav-settings-item .icon {
    margin-right: 0;
  }

  .win-nav-shell.has-titlebar.is-left .win-nav-left-panel {
    padding-top: calc(env(titlebar-area-height, 32px) + 8px);
  }

  .win-nav-shell.has-titlebar.is-left .win-nav-content {
    margin-top: env(titlebar-area-height, 32px);
    border-radius: 8px 0 0 0;
  }

  .win-nav-shell.has-titlebar.is-top {
    padding-top: env(titlebar-area-height, 32px);
  }

  .win-nav-group-header {
    position: relative;
  }

    .win-nav-group-header .win-nav-group-chevron {
      margin-left: auto;
      margin-right: 0;
      font-size: 12px;
      transition: transform 200ms var(--fast-out-slow-in), opacity var(--fast-duration) var(--fast-out-slow-in);
      transform: rotate(0deg);
    }

      .win-nav-group-header .win-nav-group-chevron.chevron-open {
        transform: rotate(180deg);
      }

      .win-nav-group-header .win-nav-group-chevron.chevron-close {
        transform: rotate(0deg);
      }

  .win-nav-group.is-expanded > .win-nav-group-header .win-nav-group-chevron {
    transform: rotate(180deg);
  }

  .win-nav-group-children {
    overflow: hidden;
    transition: height var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-nav-group-children-inner {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 2px;
  }

  .win-nav-group-child {
    padding-left: 44px;
  }

    .win-nav-group-child .icon {
      margin-right: 16px;
    }

  .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

    .win-nav-left-panel .win-nav-group.is-child-selected > .win-nav-group-header:hover {
      background: var(--subtle-secondary);
    }

  .win-nav-left-panel.is-compact .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron {
    margin-left: 8px;
    margin-right: 0;
    font-size: 10px;
    transform: rotate(0deg);
    transition: transform 200ms var(--fast-out-slow-in);
  }

    .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron.chevron-open {
      transform: rotate(180deg);
    }

    .win-nav-top-bar .win-nav-group-header .win-nav-group-chevron.chevron-close {
      transform: rotate(0deg);
    }

  .win-nav-top-bar .win-nav-group.is-child-selected > .win-nav-group-header {
    background: transparent;
  }

  .win-nav-top-bar .win-nav-group {
    display: flex;
    align-items: center;
    height: 100%;
  }
</style>
