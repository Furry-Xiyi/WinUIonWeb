<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" Text="CommandBarFlyout" />
      <WinTextBlock
        class="page-description"
        Text="The CommandBarFlyout lets you provide users with easy access to common tasks by showing commands in a floating toolbar related to an element on your UI canvas."
        TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton @click="toggleTheme" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">&#xE793;</span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" @update:IsChecked="toggleFavorite" style="width: 32px; height: 32px; padding: 0; min-width: 0;"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></WinToggleButton>
      </div>
    </div>

    <WinControlExample
      class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="exampleTemplate">
      <template #example>
        <div class="commandbarflyout-sample">
          <button
            ref="myImageButton"
            class="image-button"
            type="button"
            aria-label="mountain"
            @click="myImageButtonClick"
            @contextmenu.prevent="myImageButtonContextRequested">
            <img ref="image1" class="sample-image" :src="rainierImageUrl" alt="mountain" />
          </button>
        </div>
      </template>
      <template #options>
        <div class="options-stack">
          <WinTextBlock Text="Click or right click the image to open a CommandBarFlyout" TextWrapping="WrapWholeWords" />
          <WinTextBlock :Text="selectedOptionText || 'You clicked:'" TextWrapping="WrapWholeWords" />
        </div>
      </template>
    </WinControlExample>

    <WinCommandBarFlyout
      ref="commandBarFlyout1"
      :PrimaryCommands="primaryCommands"
      :SecondaryCommands="secondaryCommands"
      Placement="Right"
      :ShowPrimaryLabels="true"
      :Theme="pageTheme"
      @Command="onElementClicked" />
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinCommandBarFlyout from '../components/WinCommandBarFlyout.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbarflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const commandBarFlyout1 = ref(null);
const image1 = ref(null);
const myImageButton = ref(null);
const selectedOptionText = ref('');
const rainierImageUrl = 'https://raw.githubusercontent.com/Furry-Xiyi/WinUIonWeb/master/WinUI-Gallery/WinUIGallery/Assets/SampleMedia/rainier.jpg';

const primaryCommands = [
  { Icon: 'Share', Label: 'Share', ToolTipServiceToolTip: 'Share' },
  { Icon: 'Save', Label: 'Save', ToolTipServiceToolTip: 'Save' },
  { Icon: 'Delete', Label: 'Delete', ToolTipServiceToolTip: 'Delete' }
];

const secondaryCommands = [
  { Label: 'Resize' },
  { Label: 'Move' }
];

const onElementClicked = (command) => {
  selectedOptionText.value = `You clicked: ${command.Label}`;
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

const exampleTemplate = `<WinCommandBarFlyout
  :PrimaryCommands="[
    { Icon: 'Share', Label: 'Share', ToolTipServiceToolTip: 'Share' },
    { Icon: 'Save', Label: 'Save', ToolTipServiceToolTip: 'Save' },
    { Icon: 'Delete', Label: 'Delete', ToolTipServiceToolTip: 'Delete' }
  ]"
  :SecondaryCommands="[
    { Label: 'Resize' },
    { Label: 'Move' }
  ]"
  Placement="Right"
  :ShowPrimaryLabels="true" />

<WinButton Padding="0" AutomationProperties.Name="mountain">
  <img Height="300" src="${rainierImageUrl}" />
</WinButton>`;
</script>

<style scoped>
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px 0; color: var(--text-primary); }
.page-description { font-size: 14px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; align-items: center; }
.icon { font-size: 16px; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; }
.commandbarflyout-sample { display: flex; flex-direction: column; align-items: flex-start; color: var(--text-primary); }
.image-button { margin: 12px 0; padding: 0; border: 0; background: transparent; cursor: pointer; }
.sample-image { height: 300px; display: block; }
.options-stack { display: flex; flex-direction: column; gap: 8px; }
</style>
