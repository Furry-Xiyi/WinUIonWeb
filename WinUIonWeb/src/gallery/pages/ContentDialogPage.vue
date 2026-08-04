<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.contentdialog')" />
          <WinTextBlock class="page-description" :Text="$t('text.use-a-contentdialog-to-show-relevant-information')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-basic-content-dialog-with-content')" :theme="pageTheme" :vue="basicCode">
              <template #example>
                <div class="sample-row">
                  <WinButton @Click="showDialog = true">
                    <WinTextBlock :Text="$t('text.show-dialog')" />
                  </WinButton>
                  <WinTextBlock class="output-text" :Text="dialogResult" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.contentdialog.no-default')" :theme="pageTheme" :vue="noDefaultCode">
              <template #example>
                <div class="sample-row">
                  <WinButton @Click="showDialogNoDefault = true">
                    <WinTextBlock :Text="$t('sample.contentdialog.show-no-default')" />
                  </WinButton>
                  <WinTextBlock class="output-text" :Text="dialogResultNoDefault" />
                </div>
              </template>
            </WinControlExample>

            <WinContentDialog
              v-model:IsOpen="showDialog"
              :Theme="pageTheme"
              :Title="$t('sample.contentdialog.save-title')"
              :PrimaryButtonText="$t('sample.contentdialog.save')"
              :SecondaryButtonText="$t('sample.contentdialog.dont-save')"
              :CloseButtonText="$t('sample.contentdialog.cancel')"
              DefaultButton="Primary"
              @PrimaryButtonClick="dialogResult = $t('sample.contentdialog.saved')"
              @SecondaryButtonClick="dialogResult = $t('sample.contentdialog.not-saved')"
              @CloseButtonClick="dialogResult = $t('sample.contentdialog.cancelled')">
              <ContentDialogContent />
            </WinContentDialog>

            <WinContentDialog
              v-model:IsOpen="showDialogNoDefault"
              :Theme="pageTheme"
              :Title="$t('sample.contentdialog.replace-title')"
              :PrimaryButtonText="$t('sample.contentdialog.save')"
              :SecondaryButtonText="$t('sample.contentdialog.dont-save')"
              :CloseButtonText="$t('sample.contentdialog.cancel')"
              DefaultButton="None"
              @PrimaryButtonClick="dialogResultNoDefault = $t('sample.contentdialog.saved')"
              @SecondaryButtonClick="dialogResultNoDefault = $t('sample.contentdialog.not-saved')"
              @CloseButtonClick="dialogResultNoDefault = $t('sample.contentdialog.cancelled')">
              <ContentDialogContent />
            </WinContentDialog>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, defineComponent, h, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinContentDialog from '../../components/WinContentDialog.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'contentdialog');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const showDialog = ref(false);
const showDialogNoDefault = ref(false);
const dialogResult = ref('');
const dialogResultNoDefault = ref('');

const ContentDialogContent = defineComponent({
  setup() {
    return () => h('div', { class: 'dialog-content-stack' }, [
      h(WinTextBlock, { Text: t('sample.contentdialog.body'), FontSize: 14, FontWeight: 400, TextWrapping: 'WrapWholeWords' }),
      h(WinCheckBox, null, { default: () => h(WinTextBlock, { Text: t('sample.contentdialog.upload'), FontSize: 14, FontWeight: 400 }) })
    ]);
  }
});

const basicCode = computed(() => `<WinButton @Click="showDialog = true">
  <WinTextBlock Text="${t('text.show-dialog')}" />
</WinButton>
<WinContentDialog
  v-model:IsOpen="showDialog"
  Title="${t('sample.contentdialog.save-title')}"
  PrimaryButtonText="${t('sample.contentdialog.save')}"
  SecondaryButtonText="${t('sample.contentdialog.dont-save')}"
  CloseButtonText="${t('sample.contentdialog.cancel')}"
  DefaultButton="Primary">
  <WinTextBlock Text="${t('sample.contentdialog.body')}" TextWrapping="WrapWholeWords" />
  <WinCheckBox>
    <WinTextBlock Text="${t('sample.contentdialog.upload')}" />
  </WinCheckBox>
</WinContentDialog>`);

const noDefaultCode = computed(() => `<WinButton @Click="showDialogNoDefault = true">
  <WinTextBlock Text="${t('sample.contentdialog.show-no-default')}" />
</WinButton>
<WinContentDialog
  v-model:IsOpen="showDialogNoDefault"
  Title="${t('sample.contentdialog.replace-title')}"
  PrimaryButtonText="${t('sample.contentdialog.save')}"
  SecondaryButtonText="${t('sample.contentdialog.dont-save')}"
  CloseButtonText="${t('sample.contentdialog.cancel')}"
  DefaultButton="None">
  <WinTextBlock Text="${t('sample.contentdialog.body')}" TextWrapping="WrapWholeWords" />
  <WinCheckBox>
    <WinTextBlock Text="${t('sample.contentdialog.upload')}" />
  </WinCheckBox>
</WinContentDialog>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-row { display: flex; align-items: center; gap: 16px; }
.output-text { color: var(--text-secondary); }
:global(.dialog-content-stack) { display: flex; flex-direction: column; gap: 12px; }
</style>
