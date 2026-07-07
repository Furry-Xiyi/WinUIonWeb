<template>
  <div>
    <div class="page-heading">
      <WinTextBlock class="page-header" :Text="$t('text.expander')" />
      <WinTextBlock
        class="page-description"
        :Text="$t('text.the-expander-control-lets-you-show-or-hide-less')"
        TextWrapping="WrapWholeWords" />
      <div class="page-header-actions">
        <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
        <WinToggleButton v-model:IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <WinTextBlock
      class="control-example-description"
      Text="An Expander with text in the header and content areas" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example1Template">
      <template #example>
        <WinExpander
          v-model:IsExpanded="expander1Expanded"
          Header="This text is in the header"
          Description="This is in the description"
          :ExpandDirection="expandDirection"
          VerticalAlignment="Top">
          <WinTextBlock Text="This is in the content" />
        </WinExpander>
      </template>
      <template #options>
        <div class="options-panel">
          <WinTextBlock class="option-label" Text="ExpandDirection" />
          <WinComboBox
            :options="expandDirections"
            v-model="expandDirectionIndex"
            style="width: 100%;" />
        </div>
      </template>
    </WinControlExample>

    <WinTextBlock
      class="control-example-description"
      Text="Modifying Expanders content alignment" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example2Template">
      <template #example>
        <WinExpander
          Width="500"
          MaxWidth="100%"
          Padding="0"
          HorizontalContentAlignment="Left">
          <template #Header>
            <WinTextBlock
              class="centered-header-text"
              HorizontalTextAlignment="Center"
              Text="This text is centered" />
          </template>
          <WinTextBlock Margin="4" Text="And this text is left aligned" />
        </WinExpander>
      </template>
    </WinControlExample>

    <WinTextBlock
      class="control-example-description"
      Text="An Expander with a HeaderIcon slot" />
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example3Template">
      <template #example>
        <WinExpander
          Header="Network settings"
          Description="Manage wireless, proxy, and metered connection options."
          HeaderIcon="&#xE968;">
          <WinTextBlock Text="Network options are shown here." />
        </WinExpander>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinExpander from '../../components/WinExpander.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'expander');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const expander1Expanded = ref(false);

const expandDirections = [
  { label: 'Down', value: 'Down' },
  { label: 'Up', value: 'Up' }
];
const expandDirectionIndex = ref(0);
const expandDirection = computed(() => expandDirections[expandDirectionIndex.value].value);

const example1Template = `<WinExpander
  IsExpanded="False"
  ExpandDirection="Down"
  Header="This text is in the header"
  Description="This is in the description">
  <WinTextBlock Text="This is in the content" />
</WinExpander>`;

const example2Template = `<WinExpander Width="500" HorizontalContentAlignment="Left" Padding="0">
  <template #Header>
    <WinTextBlock HorizontalTextAlignment="Center" Text="This text is centered" />
  </template>
  <WinTextBlock Margin="4" Text="And this text is left aligned" />
</WinExpander>`;

const example3Template = `<WinExpander
  Header="Network settings"
  Description="Manage wireless, proxy, and metered connection options."
  HeaderIcon="&#xE968;">
  <WinTextBlock Text="Network options are shown here." />
</WinExpander>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.header-action { width: 32px; height: 32px; min-width: 0; padding: 0; }
.icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 16px; }
.control-example-description { margin-top: 16px; }
.options-panel { display: flex; flex-direction: column; gap: 8px; }
.option-label { font-size: 14px; font-weight: 600; }
.centered-header-text { width: 100%; }
.slot-icon { font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets"; font-size: 20px; line-height: 20px; }
</style>
