<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.infobar')" />
        <TextBlock
          class="page-description"
          :Text="$t('sample.infobar.description')"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button
            class="header-action"
            v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }"
            @Click="toggleTheme">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton
            class="header-action"
            :IsChecked="isFavoriteState"
            v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }"
            @update:IsChecked="toggleFavorite">
            <TextBlock class="icon" :Text="isFavoriteState ? '&#xE735;' : '&#xE734;'" />
          </ToggleButton>
        </div>
      </div>

      <StackPanel class="gallery-page-content" Spacing="0">
        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobar.closable-options-change')"
          :theme="pageTheme"
          :vue="example1Code">
          <template #example>
            <InfoBar
              v-model:IsOpen="example1IsOpen"
              :Severity="example1Severity"
              :Title="$t('sample.infobar.title')"
              :Message="$t('sample.infobar.essential-message')" />
          </template>
          <template #options>
            <StackPanel Width="150">
              <CheckBox v-model:IsChecked="example1IsOpen">
                <TextBlock :Text="$t('sample.infobar.is-open')" />
              </CheckBox>
              <ComboBox
                v-model:SelectedValue="example1Severity"
                :Header="$t('sample.infobar.severity')"
                :ItemsSource="severityItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value"
                Width="150" />
            </StackPanel>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobar.long-short-message-buttons')"
          :theme="pageTheme"
          :vue="example2Code">
          <template #example>
            <InfoBar
              v-model:IsOpen="example2IsOpen"
              :Title="$t('sample.infobar.title')"
              :Message="example2Message">
              <template v-if="example2ActionButton !== 'None'" #ActionButton>
                <Button v-if="example2ActionButton === 'Button'" @Click="onActionButtonClick">
                  <TextBlock :Text="$t('sample.infobar.action')" />
                </Button>
                <HyperlinkButton v-else NavigateUri="http://www.microsoft.com/">
                  <TextBlock :Text="$t('sample.infobar.informational-link')" />
                </HyperlinkButton>
              </template>
            </InfoBar>
          </template>
          <template #options>
            <StackPanel Width="150">
              <CheckBox v-model:IsChecked="example2IsOpen">
                <TextBlock :Text="$t('sample.infobar.is-open')" />
              </CheckBox>
              <ComboBox
                v-model:SelectedValue="example2MessageLength"
                :Header="$t('sample.infobar.message-length')"
                :ItemsSource="messageLengthItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value"
                Width="150" />
              <ComboBox
                v-model:SelectedValue="example2ActionButton"
                :Header="$t('sample.infobar.action-button')"
                :ItemsSource="actionButtonItems"
                DisplayMemberPath="Text"
                SelectedValuePath="Value"
                Width="150" />
            </StackPanel>
          </template>
        </ControlExample>

        <ControlExample
          class="basic-input-example-theme"
          HorizontalContentAlignment="Stretch"
          :headerText="$t('sample.infobar.display-options')"
          :theme="pageTheme"
          :vue="example3Code">
          <template #example>
            <InfoBar
              v-model:IsOpen="example3IsOpen"
              :IsIconVisible="example3IsIconVisible"
              :IsClosable="example3IsClosable"
              :Title="$t('sample.infobar.title')"
              :Message="$t('sample.infobar.essential-message')" />
          </template>
          <template #options>
            <StackPanel Width="150">
              <CheckBox v-model:IsChecked="example3IsOpen">
                <TextBlock :Text="$t('sample.infobar.is-open')" />
              </CheckBox>
              <CheckBox v-model:IsChecked="example3IsIconVisible">
                <TextBlock :Text="$t('sample.infobar.is-icon-visible')" />
              </CheckBox>
              <CheckBox v-model:IsChecked="example3IsClosable">
                <TextBlock :Text="$t('sample.infobar.is-closable')" />
              </CheckBox>
            </StackPanel>
          </template>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import CheckBox from '../../components/CheckBox.vue';
import ComboBox from '../../components/ComboBox.vue';
import ControlExample from '../../components/ControlExample.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import InfoBar from '../../components/InfoBar.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'infobar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const example1IsOpen = ref(true);
const example1Severity = ref('Informational');
const severityItems = computed(() => [
  { Text: t('sample.infobar.severity-informational'), Value: 'Informational' },
  { Text: t('sample.infobar.severity-success'), Value: 'Success' },
  { Text: t('sample.infobar.severity-warning'), Value: 'Warning' },
  { Text: t('sample.infobar.severity-error'), Value: 'Error' }
]);

const example2IsOpen = ref(true);
const example2MessageLength = ref('Long');
const example2ActionButton = ref('None');
const messageLengthItems = computed(() => [
  { Text: t('sample.infobar.short'), Value: 'Short' },
  { Text: t('sample.infobar.long'), Value: 'Long' }
]);
const actionButtonItems = computed(() => [
  { Text: t('text.none'), Value: 'None' },
  { Text: t('text.button'), Value: 'Button' },
  { Text: t('sample.infobar.hyperlink'), Value: 'Hyperlink' }
]);
const example2Message = computed(() => example2MessageLength.value === 'Short'
  ? t('sample.infobar.short-message')
  : t('sample.infobar.long-message'));

const example3IsOpen = ref(true);
const example3IsIconVisible = ref(true);
const example3IsClosable = ref(true);

const onActionButtonClick = () => {};

const example1Code = computed(() => `<InfoBar
  v-model:IsOpen="isOpen"
  Severity="${example1Severity.value}"
  Title="${t('sample.infobar.title')}"
  Message="${t('sample.infobar.essential-message')}" />`);

const actionButtonVue = computed(() => {
  if (example2ActionButton.value === 'Button') {
    return `  <template #ActionButton>
    <Button @Click="onActionButtonClick">
      <TextBlock Text="${t('sample.infobar.action')}" />
    </Button>
  </template>`;
  }
  if (example2ActionButton.value === 'Hyperlink') {
    return `  <template #ActionButton>
    <HyperlinkButton NavigateUri="http://www.microsoft.com/">
      <TextBlock Text="${t('sample.infobar.informational-link')}" />
    </HyperlinkButton>
  </template>`;
  }
  return '';
});

const example2Code = computed(() => `<InfoBar
  v-model:IsOpen="isOpen"
  Title="${t('sample.infobar.title')}"
  Message="${example2MessageLength.value === 'Short' ? t('sample.infobar.short-message') : t('sample.infobar.long-message-placeholder')}">
${actionButtonVue.value}
</InfoBar>`);

const example3Code = computed(() => `<InfoBar
  v-model:IsOpen="isOpen"
  :IsIconVisible="${example3IsIconVisible.value}"
  :IsClosable="${example3IsClosable.value}"
  Title="${t('sample.infobar.title')}"
  Message="${t('sample.infobar.essential-message')}" />`);
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.page-description {
  color: var(--text-secondary);
  margin: 0 72px 16px 0;
  line-height: 20px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}
</style>
