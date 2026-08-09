<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.xamluicommand')" role="heading" aria-level="1" />
        <WinTextBlock class="page-description" :Text="$t('text.xamluicommand-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><WinTextBlock class="icon" Text="&#xE793;" /></WinButton>
          <WinToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite">
            <WinTextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </WinToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.xamluicommand.reusable-command')"
          HorizontalContentAlignment="Stretch"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <div class="xaml-command-example">
              <WinTextBlock
                class="sample-description"
                :Text="$t('sample.xamluicommand.description')"
                Margin="0,0,0,12"
                TextWrapping="Wrap" />
              <WinRelativePanel class="command-output-row">
                <WinAppBarButton :Command="customCommand" />
                <WinTextBlock
                  class="command-output"
                  :Text="commandOutput"
                  FontFamily="Global User Interface"
                  Margin="8,0,0,0"
                  aria-live="polite" />
              </WinRelativePanel>
            </div>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import { useI18n } from '../../components/i18n/index';
import WinRelativePanel from '../../components/WinRelativePanel.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { XamlUICommand } from '../../components/WinXamlUICommand';
import { createPageState } from '../../utils/pageState';

const currentPage = inject<{ value: string }>('currentPage');
const { t } = useI18n();
const pageKey = computed(() => currentPage?.value || 'xamluicommand');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const commandOutput = ref('');
let detachAccelerator: (() => void) | undefined;

const customCommand = new XamlUICommand({
  Label: t('sample.xamluicommand.custom-label'),
  Description: t('sample.xamluicommand.custom-description'),
  IconSource: { Symbol: 'Favorite' },
  KeyboardAccelerators: [{ Key: 'D', Modifiers: ['Control'] }],
  ExecuteRequested: () => { commandOutput.value = t('sample.xamluicommand.executed'); }
});

onMounted(() => { detachAccelerator = customCommand.AttachKeyboardAccelerators(); });
onBeforeUnmount(() => detachAccelerator?.());

const exampleCode = computed(() => `<WinRelativePanel>
  <WinAppBarButton Command="customCommand" />
  <WinTextBlock Margin="8,0,0,0" Text="commandOutput" />
</WinRelativePanel>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); font-size: 14px; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.xaml-command-example { width: 100%; }
.sample-description { display: block; color: var(--text-primary); font-size: 14px; line-height: 20px; }
.command-output-row { display: flex; align-items: center; }
.command-output { color: var(--text-primary); font-size: 14px; line-height: 20px; }
</style>
