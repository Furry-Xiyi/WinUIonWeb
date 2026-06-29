<template>
  <div class="home-page">
    <div class="home-hero">
      <img class="home-hero-image" :src="heroImage" alt="" />
      <div class="home-hero-mask"></div>
      <div class="home-hero-text">
        <div class="home-hero-subtitle">WinUI on Web 1.0-Insider</div>
        <div class="home-hero-title">WinUI on Web Gallery</div>
      </div>
      <div class="home-hero-tiles-wrap">
        <div class="home-hero-tiles">
          <a v-for="t in tiles" :key="t.title" class="home-hero-tile" :href="t.link" target="_blank" rel="noopener">
            <div class="home-hero-tile-icon"><span class="icon">{{ t.icon }}</span></div>
            <div class="home-hero-tile-body">
              <div class="home-hero-tile-title">{{ t.title }}</div>
              <div class="home-hero-tile-desc">{{ t.desc }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="home-selector-bar">
      <div class="home-selector-item" :class="{ active: filter === 'recent' }" @click="filter = 'recent'">
        <span class="icon">&#xE823;</span>
        <span>Recent</span>
      </div>
      <div class="home-selector-item" :class="{ active: filter === 'favorites' }" @click="filter = 'favorites'">
        <span class="icon">&#xE734;</span>
        <span>Favorites</span>
      </div>
    </div>

    <template v-if="filter === 'recent'">
      <div class="home-section">
        <div class="home-section-title">Recently visited</div>
        <div class="home-h-scroll">
          <div class="home-card-row">
            <div v-for="item in recentVisited" :key="item.key" class="home-card home-card-fixed" @click="currentPage = item.key">
              <div class="home-card-icon-wrap"><span class="icon">{{ item.icon }}</span></div>
              <div class="home-card-text">
                <div class="home-card-title">{{ item.title }}</div>
                <div class="home-card-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-section">
        <div class="home-section-title">Recently added or updated</div>
        <div class="home-card-grid">
          <div v-for="item in recentAdded" :key="item.key" class="home-card" @click="currentPage = item.key">
            <div class="home-card-icon-wrap"><span class="icon">{{ item.icon }}</span></div>
            <div class="home-card-text">
              <div class="home-card-title">{{ item.title }}</div>
              <div class="home-card-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="home-section">
        <div v-if="favoriteItems.length === 0" class="home-favorites-empty">
          <span class="icon home-favorites-empty-icon">&#xE734;</span>
          <div class="home-favorites-empty-title">No favorites yet</div>
          <div class="home-favorites-empty-desc">Favorite samples by clicking the star icon on the sample page.</div>
        </div>
        <div v-else class="home-card-grid">
          <div v-for="item in favoriteItems" :key="item.key" class="home-card" @click="currentPage = item.key">
            <div class="home-card-icon-wrap"><span class="icon">{{ item.icon }}</span></div>
            <div class="home-card-text">
              <div class="home-card-title">{{ item.title }}</div>
              <div class="home-card-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue';
import splashLight from '../assets/HomePage/Splash-Light.png';
import splashDark from '../assets/HomePage/Splash-Dark.png';
import { useFavorites } from '../composables/useFavorites';

const currentPage = inject('currentPage');

const { favorites } = useFavorites();

const isDark = ref(false);

const detectTheme = () => {
  const html = document.documentElement;

  const isManualLight = html.classList.contains('theme-light') || html.classList.contains('light') || html.getAttribute('data-theme') === 'light' || html.getAttribute('theme') === 'light';

  const isManualDark = html.classList.contains('theme-dark') || html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark' || html.getAttribute('theme') === 'dark' || document.body.classList.contains('dark');

  if (isManualLight) {
    isDark.value = false;
  } else if (isManualDark) {
    isDark.value = true;
  } else {
    isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
};

let themeObserver = null;
let mediaQueryList = null;

const onSystemThemeChange = () => {
  detectTheme();
};

onMounted(() => {
  detectTheme();

  themeObserver = new MutationObserver(detectTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'theme', 'class'] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'theme', 'class'] });

  if (window.matchMedia) {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addEventListener('change', onSystemThemeChange);
  }
});

onUnmounted(() => {
  themeObserver?.disconnect();
  if (mediaQueryList) {
    mediaQueryList.removeEventListener('change', onSystemThemeChange);
  }
});

const heroImage = computed(() => isDark.value ? splashDark : splashLight);

const filter = ref('recent');

const tiles = [
  { icon: '\uE7C3', title: 'Getting started', desc: 'Get started with WinUI and explore detailed documentation.', link: 'https://aka.ms/winui-getstarted' },
  { icon: '\uE790', title: 'Design', desc: 'Guidelines and toolkits for creating stunning WinUI experiences.', link: 'https://learn.microsoft.com/windows/apps/design/' },
  { icon: '\uE71B', title: 'WinUI on GitHub', desc: 'Explore the WinUI source code and repository.', link: 'https://github.com/microsoft/microsoft-ui-xaml' },
  { icon: '\uE74C', title: 'Community Toolkit', desc: 'A collection of helper functions, controls, and app services.', link: 'https://learn.microsoft.com/windows/communitytoolkit/' },
  { icon: '\uE943', title: 'Code samples', desc: 'Find samples that demonstrate specific tasks, features, and APIs.', link: 'https://learn.microsoft.com/windows/apps/get-started/samples' },
  { icon: '\uE7B8', title: 'Partner Center', desc: 'Upload your app to the Store.', link: 'https://developer.microsoft.com/windows/' }
];

const openTile = (t) => { window.open(t.link, '_blank'); };

const recentVisited = [
  { key: 'button', icon: '\uE71A', title: 'Button', desc: 'A control that responds to user input and triggers an event.' },
  { key: 'combobox', icon: '\uE7FB', title: 'ComboBox', desc: 'Lets users pick one item from a list, with the option to enter custom text.' },
  { key: 'slider', icon: '\uE9E9', title: 'Slider', desc: 'A control that lets the user select from a range of values by moving a thumb.' },
  { key: 'toggleswitch', icon: '\uF19F', title: 'ToggleSwitch', desc: 'Switch that can be toggled between two states.' },
  { key: 'splitview', icon: '\uE8A4', title: 'SplitView', desc: 'A container with two views: one for primary content and one for navigation.' }
];

const recentAdded = [
  { key: 'colorpicker', icon: '\uEF3C', title: 'ColorPicker', desc: 'Lets the user pick a color using a color spectrum, sliders, and text input.' },
  { key: 'expander', icon: '\uE8C4', title: 'Expander', desc: 'A control with a header that shows or hides content.' },
  { key: 'rating', icon: '\uE734', title: 'RatingControl', desc: 'Allows users to view and set ratings.' },
  { key: 'flipview', icon: '\uF1CB', title: 'FlipView', desc: 'Lets people browse images or other items, one at a time.' },
  { key: 'pulltorefresh', icon: '\uE72C', title: 'PullToRefresh', desc: 'Refresh content with a pulling gesture.' },
  { key: 'treeview', icon: '\uED41', title: 'TreeView', desc: 'Display hierarchical data.' },
  { key: 'splitbutton', icon: '\uE90D', title: 'SplitButton', desc: 'A two-part button that displays a flyout when its secondary part is clicked.' },
  { key: 'calendarview', icon: '\uE787', title: 'CalendarView', desc: 'Shows a calendar that lets a user choose a date.' },
  { key: 'teachingtip', icon: '\uEC42', title: 'TeachingTip', desc: 'A flyout-like control used to deliver contextual information.' },
  { key: 'contentdialog', icon: '\uE8BD', title: 'ContentDialog', desc: 'A dialog that can be customized to contain any UI content.' },
  { key: 'rating', icon: '\uE735', title: 'Rating', desc: 'Capture user sentiment with stars.' },
  { key: 'gridview', icon: '\uF0E2', title: 'GridView', desc: 'Items in a flexible grid.' }
];

// \u6240\u6709\u9875\u9762\u7684\u5B8C\u6574\u5143\u6570\u636E
const allPagesMetadata = [
  ...recentVisited,
  ...recentAdded,
  { key: 'datepicker', icon: '\uE8BF', title: 'DatePicker', desc: 'A control that lets users pick a date value.' },
  { key: 'timepicker', icon: '\uE823', title: 'TimePicker', desc: 'A control that lets users pick a time value.' },
  { key: 'calendardatepicker', icon: '\uE787', title: 'CalendarDatePicker', desc: 'A control that lets users pick a date from a calendar.' },
  { key: 'togglebutton', icon: '\uEF1F', title: 'ToggleButton', desc: 'A button that can be on or off.' },
  { key: 'checkbox', icon: '\uE73D', title: 'CheckBox', desc: 'A control that a user can select or clear.' },
  { key: 'radiobuttons', icon: '\uECCB', title: 'RadioButtons', desc: 'A control that allows a user to select a single option from a group of options.' },
  { key: 'togglesplitbutton', icon: '\uE90D', title: 'ToggleSplitButton', desc: 'A toggleable split button.' },
  { key: 'dropdownbutton', icon: '\uE70D', title: 'DropDownButton', desc: 'A button that displays a flyout of choices when clicked.' },
  { key: 'hyperlinkbutton', icon: '\uE71B', title: 'HyperlinkButton', desc: 'A button that appears as a hyperlink.' },
  { key: 'listview', icon: '\uE8FD', title: 'ListView', desc: 'A control that presents a collection of items in a vertical list.' },
  { key: 'listbox', icon: '\uEA37', title: 'ListBox', desc: 'A control that presents an inline list of items that the user can select from.' },
  { key: 'splitview', icon: '\uE8BC', title: 'SplitView', desc: 'A container with two views: one for primary content and one for navigation.' },
  { key: 'flyout', icon: '\uE8A8', title: 'Flyout', desc: 'A lightweight popup container.' },
  { key: 'popup', icon: '\uE7C4', title: 'Popup', desc: 'Displays content on top of existing content.' },
  { key: 'animatedvisualplayer', icon: '\uF5B0', title: 'AnimatedVisualPlayer', desc: 'Plays animated content.' },
  { key: 'captureelement', icon: '\uE722', title: 'Capture Element / Camera', desc: 'Captures media from a camera.' },
  { key: 'image', icon: '\uE8B9', title: 'Image', desc: 'Displays an image.' },
  { key: 'mediaplayerelement', icon: '\uE714', title: 'MediaPlayerElement', desc: 'Plays media content.' },
  { key: 'personpicture', icon: '\uE77B', title: 'PersonPicture', desc: 'Displays a person\'s picture.' }
];

// \u6839\u636E\u6536\u85CF\u7684key\u751F\u6210\u5B8C\u6574\u7684\u6536\u85CF\u9879\u4FE1\u606F
const favoriteItems = computed(() => {
  return favorites.value
    .map(key => allPagesMetadata.find(item => item.key === key))
    .filter(Boolean);
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  margin: -24px -32px 0 -32px;
}

.home-hero {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  flex-shrink: 0;
}

.home-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.9;
}

.home-hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, transparent 75%, var(--app-bg) 100%);
  pointer-events: none;
}

.home-hero-text {
  position: absolute;
  left: 36px;
  top: 48px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.home-hero-subtitle {
  font-size: 18px;
  color: var(--text-primary);
}

.home-hero-title {
  font-size: 40px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--text-primary);
}

.home-hero-tiles-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ctrl-strong-stroke) 58%, transparent) transparent;
  z-index: 1;
}

/* 注释掉 webkit-scrollbar 自定义样式，让 Edge FluentScrollBarStyle 完全接管 */
/*
.home-hero-tiles-wrap::-webkit-scrollbar {
  display: block;
}

.home-hero-tiles-wrap::-webkit-scrollbar-track {
  background: transparent;
}

.home-hero-tiles-wrap::-webkit-scrollbar-thumb {
  background-color: color-mix(in srgb, var(--ctrl-strong-stroke) 58%, transparent);
  background-clip: content-box;
  border: 4px solid transparent;
  border-radius: 8px;
}
*/

.home-hero-tiles {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 0 36px 12px 36px;
  width: max-content;
}

  .home-hero-tile {
    width: 220px;
    height: 88px;
    padding: 16px;
    border-radius: 8px;
    background: var(--card-bg);
    backdrop-filter: var(--flyout-backdrop);
    border: 1px solid var(--card-stroke);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    flex-shrink: 0;
    transition: background var(--fast-duration) var(--fast-out-slow-in);
  }

.home-hero-tile:hover {
  background: var(--subtle-secondary);
}

.home-hero-tile-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: var(--subtle-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-hero-tile-icon .icon {
  font-size: 20px;
  color: var(--text-primary);
}

.home-hero-tile-body {
  flex: 1;
  min-width: 0;
}

.home-hero-tile-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-hero-tile-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-selector-bar {
  display: flex;
  flex-direction: row;
  align-self: center;
  gap: 8px;
  margin: 24px 0 16px 0;
  padding: 0;
  background: transparent;
  border: 0;
}

.home-selector-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--ctrl-fill-secondary);
  border: 1px solid var(--ctrl-border);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: background var(--fast-duration) var(--fast-out-slow-in), border-color var(--fast-duration) var(--fast-out-slow-in);
}

.home-selector-item:hover {
  background: var(--ctrl-fill-tertiary);
}

.home-selector-item.active {
  background: var(--accent-base);
  border-color: var(--accent-border);
  color: var(--accent-text);
}

.home-selector-item .icon {
  font-size: 14px;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 36px;
  margin-bottom: 16px;
}

.home-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.home-h-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0 -36px;
  padding: 0 36px 12px 36px;
  scrollbar-width: thin;
}

.home-card-row {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: max-content;
}

.home-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.home-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--card-stroke);
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
}

.home-card:hover {
  background: var(--subtle-secondary);
}

.home-card-fixed {
  width: 280px;
  flex-shrink: 0;
}

.home-card-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: var(--subtle-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-card-icon-wrap .icon {
  font-size: 18px;
  color: var(--text-primary);
}

.home-card-text {
  flex: 1;
  min-width: 0;
}

.home-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
}

.home-favorites-empty-icon {
  font-size: 36px;
  color: var(--text-secondary);
}

.home-favorites-empty-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.home-favorites-empty-desc {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}
</style>
