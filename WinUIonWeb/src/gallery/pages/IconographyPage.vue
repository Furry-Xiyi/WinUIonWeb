<template>
  <Page>
  <div class="gallery-item-page">
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <div class="page-description">
              <p>Browse and search the Fluent System Icons library. Click any icon to see usage details.</p>
            </div>

            <div class="icon-gallery-container">
              <AutoSuggestBox
                Text="{x:Bind searchText, Mode=TwoWay}"
                PlaceholderText="Search icons by name, code, or tags"
                QueryIcon="Find"
                class="search-box"
                TextChanged="onSearchTextChanged"
              />

              <div class="gallery-layout">
                <div class="icons-grid-container">
                  <ItemsView
                    ItemsSource="{x:Bind filteredIcons, Mode=OneWay}"
                    SelectionMode="Single"
                    SelectedItem="{x:Bind selectedIcon, Mode=TwoWay}"
                    SelectionChanged="onSelectionChanged"
                    Height="600"
                    MinWidth="100"
                    Padding="16"
                    class="icons-grid"
                  >
                    <ItemsView.Layout>
                      <UniformGridLayout MinItemWidth="96" MinItemHeight="96" MinColumnSpacing="8" MinRowSpacing="8" Orientation="Horizontal" />
                    </ItemsView.Layout>
                    <ItemsView.ItemTemplate>
                      <DataTemplate x:DataType="models:IconData">
                        <ItemContainer Width="96" Height="96" AutomationProperties.Name="{x:Bind name}" CornerRadius="{StaticResource ControlCornerRadius}" ToolTipService.ToolTip="{x:Bind name}">
                          <Grid Background="{ThemeResource CardBackgroundFillColorDefaultBrush}" BorderBrush="{ThemeResource CardStrokeColorDefaultBrush}" BorderThickness="1" CornerRadius="{StaticResource ControlCornerRadius}">
                            <FontIcon class="icon-glyph" FontFamily="{StaticResource SymbolThemeFontFamily}" FontSize="28" Margin="0,0,0,16" Glyph="{x:Bind character}" HorizontalAlignment="Center" VerticalAlignment="Center" />
                            <TextBlock class="icon-name" Margin="8,0,8,8" HorizontalAlignment="Center" VerticalAlignment="Bottom" Foreground="{ThemeResource TextFillColorSecondaryBrush}" Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind name}" TextTrimming="CharacterEllipsis" TextWrapping="NoWrap" />
                          </Grid>
                        </ItemContainer>
                      </DataTemplate>
                    </ItemsView.ItemTemplate>
                  </ItemsView>

                  <div v-if="filteredIcons.length === 0" class="no-results">
                    <p>No icons found.</p>
                  </div>
                </div>

                <ScrollViewer v-if="selectedIcon" class="side-panel" MaxHeight="800" Padding="16" VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto" HorizontalScrollMode="Disabled" HorizontalScrollBarVisibility="Disabled">
                  <div class="icon-details">
                    <div class="icon-preview-container">
                      <div class="icon-preview">
                        <FontIcon class="icon-preview-glyph" FontFamily="{StaticResource SymbolThemeFontFamily}" FontSize="48" Glyph="{x:Bind selectedIcon.character, Mode=OneWay}" />
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
                </ScrollViewer>
              </div>
            </div>
      </div>
    </ScrollViewer>
  </div>
  </Page>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import AutoSuggestBox from '../../components/AutoSuggestBox.vue';
import ItemsView from '../../components/ItemsView.vue';
import ItemContainer from '../../components/ItemContainer.vue';
import FontIcon from '../../components/FontIcon.vue';
import TextBlock from '../../components/TextBlock.vue';
import Grid from '../../components/Grid.vue';
import Page from '../../components/Page.vue';
import { DataTemplate, UniformGridLayout } from '../../components/CollectionProperties';
import iconsData from '../samples/Iconography/IconsData.json';

import ScrollViewer from '../../components/ScrollViewer.vue';
import { createPageState } from '../../utils/pageState';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'iconography');
const { pageTheme, isFavoriteState, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const searchText = ref('');
const selectedItems = ref([]);
const allIcons = ref([]);
// Use the official Gallery dataset instead of a missing deployment-relative
// request and a small fallback collection with unrelated glyph code points.
onMounted(() => {
    allIcons.value = iconsData.map(icon => ({
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

const selectedIcon = computed({
  get: () => selectedItems.value[0] ?? null,
  set: value => { selectedItems.value = value ? [value] : []; }
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

const onSelectionChanged = args => {
  selectedItems.value = args.SelectedItems ?? [];
};

const onTagClick = (tag) => {
  searchText.value = tag;
  onSearchTextChanged();
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
  min-width: 0;
  max-width: 100%;
}

.no-results {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}

.side-panel {
  width: 334px;
  flex: 0 0 334px;
  min-width: 0;
  max-width: 100%;
  background: var(--card-background-fill);
  border: 1px solid var(--divider-stroke-default);
  border-radius: 8px;
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
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: pre-wrap;
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
    flex-basis: auto;
    max-height: 600px;
  }
}
</style>
