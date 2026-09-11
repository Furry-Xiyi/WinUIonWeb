<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.xamluicommand')" role="heading" aria-level="1" />
        <TextBlock class="page-description" :Text="$t('text.xamluicommand-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
          <ToggleButton class="header-action" :IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '\uE735' : '\uE734'" />
          </ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.xamluicommand.reusable-command')"
          HorizontalContentAlignment="Stretch"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <div class="xaml-command-example">
              <TextBlock
                class="sample-description"
                :Text="$t('sample.xamluicommand.description')"
                Margin="0,0,0,12"
                TextWrapping="Wrap" />
              <RelativePanel class="command-output-row">
                <AppBarButton :Command="customCommand" />
                <TextBlock
                  class="command-output"
                  :Text="commandOutput"
                  FontFamily="Global User Interface"
                  Margin="8,0,0,0"
                  aria-live="polite" />
              </RelativePanel>
            </div>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import { useI18n } from '../../components/i18n/index';
import RelativePanel from '../../components/RelativePanel.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { XamlUICommand } from '../../components/XamlUICommand';
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

const exampleCode = computed(() => `<RelativePanel>
  <AppBarButton Command="customCommand" />
  <TextBlock Margin="8,0,0,0" Text="commandOutput" />
</RelativePanel>`);
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
