<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.breadcrumbbar')" />
        <TextBlock
          class="page-description"
          :Text="$t('text.breadcrumbbar-description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton
            :IsChecked="isFavoriteState"
            class="header-action"
            @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <StackPanel>
          <ControlExample
            class="basic-input-example-theme"
            :theme="pageTheme"
            :vue="BreadcrumbBarControlVue"
            :headerText="$t('sample.breadcrumbbar.control')">
            <template #example>
              <BreadcrumbBar :ItemsSource="FoldersString" />
            </template>
          </ControlExample>

          <ControlExample
            class="basic-input-example-theme"
            :theme="pageTheme"
            :vue="BreadcrumbBarCustomDataTemplateVue"
            :headerText="$t('sample.breadcrumbbar.custom-data-template')">
            <template #example>
              <BreadcrumbBar
                :ItemsSource="Folders"
                @ItemClicked="BreadcrumbBar2_ItemClicked">
                <template #ItemTemplate="{ Item }">
                  <TextBlock
                    :Text="Item.Name"
                    :aria-label="Item.Name"
                    v-bind="{ 'AutomationProperties.Name': Item.Name }" />
                </template>
              </BreadcrumbBar>
            </template>

            <template #options>
              <Button @Click="ResetSampleButton_Click">
                <TextBlock :Text="$t('sample.breadcrumbbar.reset-sample')" />
              </Button>
              <TextBlock
                class="accessibility-announcement"
                :Text="ResetAnnouncement"
                aria-live="polite"
                AutomationProperties.LiveSetting="Polite" />
            </template>
          </ControlExample>
        </StackPanel>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import BreadcrumbBar from '../../components/BreadcrumbBar.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'breadcrumbbar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const _defaultFolders = [
  { Name: t('sample.breadcrumbbar.home') },
  { Name: t('sample.breadcrumbbar.folder-1') },
  { Name: t('sample.breadcrumbbar.folder-2') },
  { Name: t('sample.breadcrumbbar.folder-3') }
];

const Folders = ref([]);
const ResetAnnouncement = ref('');
const FoldersString = [
  t('sample.breadcrumbbar.home'),
  t('sample.breadcrumbbar.documents'),
  t('sample.breadcrumbbar.design'),
  t('sample.breadcrumbbar.northwind'),
  t('sample.breadcrumbbar.images'),
  t('sample.breadcrumbbar.folder-1'),
  t('sample.breadcrumbbar.folder-2'),
  t('sample.breadcrumbbar.folder-3')
];

for (const folder of _defaultFolders) {
  Folders.value.push(folder);
}

const BreadcrumbBar2_ItemClicked = (sender, args) => {
  const items = sender.ItemsSource;
  for (let Index = items.length - 1; Index >= args.Index + 1; Index -= 1) {
    items.splice(Index, 1);
  }
};

const ResetSampleButton_Click = () => {
  const items = Folders.value;
  for (const folder of _defaultFolders) {
    if (!items.includes(folder)) {
      items.push(folder);
    }
  }

  ResetAnnouncement.value = '';
  nextTick(() => {
    ResetAnnouncement.value = t('sample.breadcrumbbar.reset-success');
  });
};

const BreadcrumbBarControlVue = `<BreadcrumbBar :ItemsSource="FoldersString" />

<script setup>
const FoldersString = ${JSON.stringify(FoldersString, null, 2)};
<\/script>`;

const BreadcrumbBarCustomDataTemplateVue = `<BreadcrumbBar
  :ItemsSource="Folders"
  @ItemClicked="BreadcrumbBar2_ItemClicked">
  <template #ItemTemplate="{ Item }">
    <TextBlock
      :Text="Item.Name"
      v-bind="{ 'AutomationProperties.Name': Item.Name }" />
  </template>
</BreadcrumbBar>

<script setup>
import { ref } from 'vue';

const Folders = ref(${JSON.stringify(_defaultFolders, null, 2)});

const BreadcrumbBar2_ItemClicked = (sender, args) => {
  const items = sender.ItemsSource;
  for (let Index = items.length - 1; Index >= args.Index + 1; Index -= 1) {
    items.splice(Index, 1);
  }
};
<\/script>`;
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 600;
}

.page-description {
  margin: 0 72px 16px 0;
  color: var(--text-secondary);
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  color: inherit;
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons');
  font-size: 16px;
  line-height: 16px;
}

.accessibility-announcement {
  position: fixed;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
