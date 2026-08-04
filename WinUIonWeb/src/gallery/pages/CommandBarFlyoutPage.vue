<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.commandbarflyout')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-commandbarflyout-lets-you-provide-users-with')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.commandbarflyout.object')"
          :theme="pageTheme"
          :vue="commandBarFlyoutCode"
          :xaml="commandBarFlyoutXaml">
              <template #example>
                <div class="commandbarflyout-stack">
                  <WinTextBlock :Text="$t('sample.commandbarflyout.open-hint')" TextWrapping="WrapWholeWords" />
                  <button
                    ref="myImageButton"
                    class="image-button"
                    type="button"
                    :aria-label="$t('sample.mountain')"
                    @click="myImageButtonClick"
                    @contextmenu.prevent="myImageButtonContextRequested">
                    <img ref="image1" class="sample-image" :src="rainierImageUrl" :alt="$t('sample.mountain')" />
                  </button>
                  <WinTextBlock :Text="selectedOptionText" />
                </div>
              </template>
            </WinControlExample>

            <WinCommandBarFlyout
              ref="commandBarFlyout1"
              :PrimaryCommands="primaryCommands"
              :SecondaryCommands="secondaryCommands"
              Placement="Right"
              :ShowPrimaryLabels="true"
              :Theme="pageTheme" />
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCommandBarFlyout from '../../components/WinCommandBarFlyout.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbarflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const commandBarFlyout1 = ref(null);
const image1 = ref(null);
const myImageButton = ref(null);
const selectedOptionText = ref('');
const rainierImageUrl = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg';

const primaryCommands = computed(() => [
  { Label: t('sample.share'), Icon: 'Share', 'ToolTipService.ToolTip': t('sample.share'), Click: onElementClicked },
  { Label: t('sample.save'), Icon: 'Save', 'ToolTipService.ToolTip': t('sample.save'), Click: onElementClicked },
  { Label: t('sample.delete'), Icon: 'Delete', 'ToolTipService.ToolTip': t('sample.delete'), Click: onElementClicked }
]);

const secondaryCommands = computed(() => [
  { Name: 'ResizeButton1', Label: t('sample.resize'), Click: onElementClicked },
  { Name: 'MoveButton1', Label: t('sample.move'), Click: onElementClicked }
]);

const onElementClicked = (command) => {
  selectedOptionText.value = t('sample.you-clicked', { name: command.Label });
};

const showMenu = (isTransient) => {
  const target = image1.value ?? myImageButton.value;
  if (!target) return;
  commandBarFlyout1.value?.showAt(target, {
    ShowMode: isTransient ? 'Transient' : 'Standard',
    Placement: 'RightEdgeAlignedTop'
  });
};

const myImageButtonContextRequested = () => {
  showMenu(false);
};

const myImageButtonClick = () => {
  showMenu(true);
};

const commandBarFlyoutCode = `<WinCommandBarFlyout
  :PrimaryCommands="[
    { Label: 'Share', Icon: 'Share', 'ToolTipService.ToolTip': 'Share', Click: onElementClicked },
    { Label: 'Save', Icon: 'Save', 'ToolTipService.ToolTip': 'Save', Click: onElementClicked },
    { Label: 'Delete', Icon: 'Delete', 'ToolTipService.ToolTip': 'Delete', Click: onElementClicked }
  ]"
  :SecondaryCommands="[
    { Name: 'ResizeButton1', Label: 'Resize', Click: onElementClicked },
    { Name: 'MoveButton1', Label: 'Move', Click: onElementClicked }
  ]"
  Placement="Right"
  :ShowPrimaryLabels="true" />

<button @click="showMenu(true)" @contextmenu.prevent="showMenu(false)">
  <img src="${rainierImageUrl}" height="300" />
</button>`;

const commandBarFlyoutXaml = `<Page.Resources>
    <CommandBarFlyout Placement="Right" x:Name="CommandBarFlyout1">
        <AppBarButton Label="Share" Icon="Share" ToolTipService.ToolTip="Share" Click="OnElementClicked" />
        <AppBarButton Label="Save" Icon="Save" ToolTipService.ToolTip="Save" Click="OnElementClicked" />
        <AppBarButton Label="Delete" Icon="Delete" ToolTipService.ToolTip="Delete" Click="OnElementClicked" />
        <CommandBarFlyout.SecondaryCommands>
            <AppBarButton x:Name="ResizeButton1" Label="Resize" Click="OnElementClicked" />
            <AppBarButton x:Name="MoveButton1" Label="Move" Click="OnElementClicked" />
        </CommandBarFlyout.SecondaryCommands>
    </CommandBarFlyout>
</Page.Resources>

<Button x:Name="myImageButton" AutomationProperties.Name="mountain" Padding="0"
    Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested" >
    <Image x:Name="Image1" Height="300" Source="/Assets/SampleMedia/rainier.jpg"/>
</Button>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.commandbarflyout-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.image-button { padding: 0; border: 0; background: transparent; cursor: pointer; }
.sample-image { height: 300px; display: block; }
</style>
