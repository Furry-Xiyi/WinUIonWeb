<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.commandbarflyout')" />
          <TextBlock class="page-description" :Text="$t('text.the-commandbarflyout-lets-you-provide-users-with')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('sample.commandbarflyout.object')"
          :theme="pageTheme"
          :vue="commandBarFlyoutCode">
              <template #example>
                <div class="commandbarflyout-stack">
                  <TextBlock :Text="$t('sample.commandbarflyout.open-hint')" TextWrapping="WrapWholeWords" />
                  <Button
                    ref="myImageButton"
                    v-bind="{ 'AutomationProperties.Name': $t('sample.mountain') }"
                    Margin="0,12,0,12"
                    Padding="0"
                    @Click="myImageButtonClick"
                    @contextmenu.prevent="myImageButtonContextRequested">
                    <Image Height="300" :Source="rainierImageUrl" />
                  </Button>
                  <TextBlock :Text="selectedOptionText" />
                </div>
              </template>
            </ControlExample>

            <CommandBarFlyout
              ref="commandBarFlyout1"
              :PrimaryCommands="primaryCommands"
              :SecondaryCommands="secondaryCommands"
              Placement="Right"
              :Theme="pageTheme" />
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CommandBarFlyout from '../../components/CommandBarFlyout.vue';
import ControlExample from '../../components/ControlExample.vue';
import Image from '../../components/Image.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbarflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const commandBarFlyout1 = ref(null);
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
  const target = myImageButton.value?.$el ?? myImageButton.value;
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

const commandBarFlyoutCode = `<CommandBarFlyout Name="CommandBarFlyout1" Placement="Right">
  <AppBarButton Label="Share" Icon="Share" ToolTipService.ToolTip="Share" Click="OnElementClicked" />
  <AppBarButton Label="Save" Icon="Save" ToolTipService.ToolTip="Save" Click="OnElementClicked" />
  <AppBarButton Label="Delete" Icon="Delete" ToolTipService.ToolTip="Delete" Click="OnElementClicked" />
  <CommandBarFlyout.SecondaryCommands>
    <AppBarButton Name="ResizeButton1" Label="Resize" Click="OnElementClicked" />
    <AppBarButton Name="MoveButton1" Label="Move" Click="OnElementClicked" />
  </CommandBarFlyout.SecondaryCommands>
</CommandBarFlyout>

<Button Name="myImageButton" AutomationProperties.Name="mountain" Margin="0,12,0,12" Padding="0" Click="MyImageButton_Click" ContextRequested="MyImageButton_ContextRequested">
  <Image Name="Image1" Height="300" Source="/Assets/SampleMedia/rainier.jpg" />
</Button>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.commandbarflyout-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
</style>
