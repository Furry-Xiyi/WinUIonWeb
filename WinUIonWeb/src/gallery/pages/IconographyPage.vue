<template>
  <div class="gallery-item-page">
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <WinPageHeader
              title="Iconography"
              :showFavoriteButton="true"
              :showThemeButton="true"
            />

            <div class="page-description">
              <p>Browse and search the Fluent System Icons library. Click any icon to see usage details.</p>
            </div>

            <div class="icon-gallery-container">
              <WinAutoSuggestBox
                v-model:Text="searchText"
                PlaceholderText="Search icons by name, code, or tags"
                queryIcon="🔍"
                class="search-box"
                @TextChanged="onSearchTextChanged"
              />

              <div class="gallery-layout">
                <div class="icons-grid-container">
                  <WinItemsView
                    :itemsSource="filteredIcons"
                    layout="Grid"
                    selectionMode="Single"
                    :selectedItems="selectedItems"
                    @update:selectedItems="onSelectionChanged"
                    class="icons-grid"
                  >
                    <template #item="{ item }">
                      <div class="icon-card">
                        <div class="icon-display">
                          <span class="icon-glyph" v-html="item.textGlyph"></span>
                        </div>
                        <div class="icon-name">{{ item.name }}</div>
                      </div>
                    </template>
                  </WinItemsView>

                  <div v-if="filteredIcons.length === 0" class="no-results">
                    <p>No icons found.</p>
                  </div>
                </div>

                <div v-if="selectedIcon" class="side-panel">
                  <div class="icon-details">
                    <div class="icon-preview-container">
                      <div class="icon-preview">
                        <span class="icon-preview-glyph" v-html="selectedIcon.textGlyph"></span>
                      </div>
                      <div v-if="selectedIcon.isSegoeFluentOnly" class="icon-warning">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-text">Only supported in Segoe Fluent Icons</span>
                      </div>
                    </div>

                    <div class="detail-section">
                      <div class="detail-label">Icon name</div>
                      <div class="code-display">{{ selectedIcon.name }}</div>
                    </div>

                    <div class="detail-section">
                      <div class="detail-label">Text glyph</div>
                      <div class="code-display">{{ selectedIcon.textGlyph }}</div>
                    </div>

                    <div class="detail-section">
                      <div class="detail-label">Code glyph</div>
                      <div class="code-display">{{ selectedIcon.codeGlyph }}</div>
                    </div>

                    <div class="detail-section">
                      <div class="detail-label">FontIcon XAML</div>
                      <div class="code-display">&lt;FontIcon Glyph="{{ selectedIcon.textGlyph }}" /&gt;</div>
                    </div>

                    <div class="detail-section">
                      <div class="detail-label">FontIcon C#</div>
                      <div class="code-display code-multiline">
                        FontIcon icon = new FontIcon();<br>
                        icon.Glyph = "{{ selectedIcon.codeGlyph }}";
                      </div>
                    </div>

                    <div v-if="selectedIcon.symbolName" class="detail-section">
                      <div class="detail-label">SymbolIcon XAML</div>
                      <div class="code-display">&lt;SymbolIcon Symbol="{{ selectedIcon.symbolName }}" /&gt;</div>
                    </div>

                    <div v-if="selectedIcon.symbolName" class="detail-section">
                      <div class="detail-label">SymbolIcon C#</div>
                      <div class="code-display code-multiline">
                        SymbolIcon icon = new SymbolIcon();<br>
                        icon.Symbol = Symbol.{{ selectedIcon.symbolName }};
                      </div>
                    </div>

                    <div v-if="selectedIcon.tags && selectedIcon.tags.length > 0" class="detail-section">
                      <div class="detail-label">Tags</div>
                      <div class="tags-container">
                        <button
                          v-for="(tag, idx) in selectedIcon.tags"
                          :key="idx"
                          class="tag-chip"
                          @click="onTagClick(tag)"
                        >
                          {{ tag }}
                        </button>
                      </div>
                    </div>

                    <div v-if="!selectedIcon.tags || selectedIcon.tags.length === 0" class="detail-section">
                      <div class="no-tags">No tags available.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import WinPageHeader from '../../components/WinPageHeader.vue';
import WinAutoSuggestBox from '../../components/WinAutoSuggestBox.vue';
import WinItemsView from '../../components/WinItemsView.vue';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const searchText = ref('');
const selectedItems = ref([]);
const allIcons = ref([]);
const isLoading = ref(true);

// Load icons data
onMounted(async () => {
  try {
    const response = await fetch('/assets/data/icons.json');
    const data = await response.json();
    allIcons.value = data.map(icon => ({
      name: icon.Name,
      code: icon.Code,
      tags: icon.Tags || [],
      isSegoeFluentOnly: icon.IsSegoeFluentOnly || false,
      character: String.fromCodePoint(parseInt(icon.Code, 16)),
      codeGlyph: '\\u' + icon.Code,
      textGlyph: '&#x' + icon.Code + ';',
      symbolName: getSymbolName(icon.Name)
    }));

    // Select first icon by default
    if (allIcons.value.length > 0) {
      selectedItems.value = [allIcons.value[0]];
    }
  } catch (error) {
    console.error('Failed to load icons:', error);
    // Fallback to sample icons
    allIcons.value = getSampleIcons();
    if (allIcons.value.length > 0) {
      selectedItems.value = [allIcons.value[0]];
    }
  } finally {
    isLoading.value = false;
  }
});

// Check if icon name matches a Symbol enum value
const getSymbolName = (name) => {
  // Simplified - in real implementation, check against Symbol enum
  const commonSymbols = [
    'Accept', 'Add', 'Admin', 'Attach', 'Back', 'Bold', 'Bookmark', 'Calculator',
    'Calendar', 'Camera', 'Cancel', 'Caption', 'Character', 'Clear', 'Clock',
    'Close', 'ClosedCaption', 'Comment', 'Contact', 'Copy', 'Crop', 'Delete',
    'Edit', 'Emoji', 'Favorite', 'Filter', 'Find', 'Flag', 'Folder', 'Font',
    'Forward', 'Globe', 'GoToToday', 'Hamburger', 'Help', 'Hide', 'Home',
    'Import', 'Italic', 'Like', 'Link', 'List', 'Mail', 'Map', 'Message',
    'Microphone', 'More', 'MusicInfo', 'Mute', 'NewWindow', 'Next', 'OpenFile',
    'Page', 'Paste', 'Pause', 'People', 'Phone', 'Pin', 'Play', 'Preview',
    'Previous', 'Print', 'Priority', 'Read', 'Redo', 'Refresh', 'Remote',
    'Remove', 'Rename', 'Repair', 'Rotate', 'Save', 'SaveLocal', 'Search',
    'SelectAll', 'Send', 'SetLockScreen', 'Setting', 'Share', 'Shop', 'ShowBcc',
    'ShowResults', 'Shuffle', 'SlideShow', 'Sort', 'Stop', 'Street', 'Switch',
    'Sync', 'Tag', 'Target', 'Underline', 'Undo', 'UnFavorite', 'UnPin',
    'UnSyncFolder', 'Up', 'Upload', 'Video', 'View', 'Volume', 'WebCam',
    'World', 'ZeroBars', 'Zoom', 'ZoomIn', 'ZoomOut'
  ];
  return commonSymbols.includes(name) ? name : null;
};

// Filter icons based on search
const filteredIcons = computed(() => {
  if (!searchText.value.trim()) {
    return allIcons.value;
  }

  const filters = searchText.value.toLowerCase().split(' ');
  return allIcons.value.filter(icon => {
    return filters.every(filter => {
      const matchName = icon.name.toLowerCase().includes(filter);
      const matchCode = icon.code.toLowerCase().includes(filter);
      const matchTags = icon.tags.some(tag => tag.toLowerCase().includes(filter));
      return matchName || matchCode || matchTags;
    });
  });
});

const selectedIcon = computed(() => {
  return selectedItems.value.length > 0 ? selectedItems.value[0] : null;
});

const onSearchTextChanged = () => {
  // Search is handled by computed property
  // If there are filtered results, select the first one
  if (filteredIcons.value.length > 0) {
    selectedItems.value = [filteredIcons.value[0]];
  } else {
    selectedItems.value = [];
  }
};

const onSelectionChanged = (newSelection) => {
  selectedItems.value = newSelection;
};

const onTagClick = (tag) => {
  searchText.value = tag;
  onSearchTextChanged();
};

// Sample icons for fallback
const getSampleIcons = () => {
  return [
    {
      name: 'GlobalNavButton',
      code: 'E700',
      tags: ['menu', 'hamburger', 'line', 'three'],
      isSegoeFluentOnly: false,
      character: '󰜀',
      codeGlyph: '\\uE700',
      textGlyph: '&#xE700;',
      symbolName: null
    },
    {
      name: 'Wifi',
      code: 'E701',
      tags: ['wireless', 'connect', 'internet', 'network'],
      isSegoeFluentOnly: false,
      character: '󰜁',
      codeGlyph: '\\uE701',
      textGlyph: '&#xE701;',
      symbolName: null
    },
    {
      name: 'Bluetooth',
      code: 'E702',
      tags: ['device', 'connection'],
      isSegoeFluentOnly: false,
      character: '󰜂',
      codeGlyph: '\\uE702',
      textGlyph: '&#xE702;',
      symbolName: null
    },
    {
      name: 'Accept',
      code: 'E8FB',
      tags: ['check', 'confirm', 'yes', 'ok'],
      isSegoeFluentOnly: false,
      character: '󰣻',
      codeGlyph: '\\uE8FB',
      textGlyph: '&#xE8FB;',
      symbolName: 'Accept'
    },
    {
      name: 'Cancel',
      code: 'E711',
      tags: ['close', 'x', 'no'],
      isSegoeFluentOnly: false,
      character: '󰜑',
      codeGlyph: '\\uE711',
      textGlyph: '&#xE711;',
      symbolName: 'Cancel'
    },
    {
      name: 'Home',
      code: 'E80F',
      tags: ['house', 'main'],
      isSegoeFluentOnly: false,
      character: '󰠏',
      codeGlyph: '\\uE80F',
      textGlyph: '&#xE80F;',
      symbolName: 'Home'
    },
    {
      name: 'Search',
      code: 'E721',
      tags: ['find', 'magnify'],
      isSegoeFluentOnly: false,
      character: '󰜡',
      codeGlyph: '\\uE721',
      textGlyph: '&#xE721;',
      symbolName: 'Find'
    },
    {
      name: 'Settings',
      code: 'E713',
      tags: ['gear', 'config'],
      isSegoeFluentOnly: false,
      character: '󰜓',
      codeGlyph: '\\uE713',
      textGlyph: '&#xE713;',
      symbolName: 'Setting'
    }
  ];
};
</script>

<style scoped>
.iconography-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-description {
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.icon-gallery-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  max-width: 320px;
}

.gallery-layout {
  display: flex;
  gap: 16px;
  min-height: 600px;
}

.icons-grid-container {
  flex: 1;
  min-width: 0;
}

.icons-grid {
  width: 100%;
}

.icons-grid :deep(.win-items-viewport) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
  padding: 16px;
  background: var(--layer-fill-alt);
  border: 1px solid var(--control-stroke-default);
  border-radius: 8px;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: var(--card-background-fill);
  border: 1px solid var(--card-stroke-default);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 96px;
}

.icon-card:hover {
  background: var(--subtle-fill-secondary);
  border-color: var(--control-stroke-secondary);
}

.icons-grid :deep(.win-items-container.selected) .icon-card {
  background: var(--accent-fill-default);
  border-color: var(--accent-fill-default);
}

.icons-grid :deep(.win-items-container.selected) .icon-card .icon-name {
  color: var(--text-on-accent-primary);
}

.icon-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.icon-glyph {
  font-size: 28px;
  color: var(--text-primary);
}

.icons-grid :deep(.win-items-container.selected) .icon-glyph {
  color: var(--text-on-accent-primary);
}

.icon-name {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.no-results {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}

.side-panel {
  width: 334px;
  background: var(--card-background-fill);
  border: 1px solid var(--divider-stroke-default);
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  max-height: 800px;
}

.icon-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icon-preview-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--control-fill-default);
  border: 1px solid var(--control-stroke-default);
  border-radius: 8px;
  height: 80px;
}

.icon-preview-glyph {
  font-size: 48px;
  color: var(--text-primary);
}

.icon-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--system-fill-caution-background);
  border-radius: 4px;
}

.warning-icon {
  font-size: 12px;
}

.warning-text {
  font-size: 12px;
  color: var(--system-fill-caution);
  flex: 1;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.code-display {
  padding: 8px;
  background: var(--control-fill-default);
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  font-family: 'Cascadia Mono', 'Consolas', monospace;
  font-size: 13px;
  color: var(--text-primary);
  overflow-x: auto;
  white-space: nowrap;
}

.code-multiline {
  white-space: pre-wrap;
  word-break: break-all;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-chip {
  padding: 4px 8px;
  background: var(--card-background-fill);
  border: 1px solid var(--card-stroke-default);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tag-chip:hover {
  background: var(--subtle-fill-secondary);
  border-color: var(--control-stroke-secondary);
}

.no-tags {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 13px;
}

@media (max-width: 1200px) {
  .gallery-layout {
    flex-direction: column;
  }

  .side-panel {
    width: 100%;
    max-height: 600px;
  }
}
</style>
