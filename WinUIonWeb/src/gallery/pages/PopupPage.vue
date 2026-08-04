<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.popup')" />
          <WinTextBlock class="page-description" :Text="$t('text.displays-content-on-top-of-existing-content-with')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.popup-with-offset-positioning')" :theme="pageTheme" :vue="popupCode">
              <template #example>
                <div class="popup-output">
                  <WinPopup
                    v-model:IsOpen="isPopupOpen"
                    :HorizontalOffset="horizontalOffset"
                    :VerticalOffset="verticalOffset"
                    :IsLightDismissEnabled="isLightDismissEnabled">
                    <template #trigger>
                      <WinButton @click="showPopupOffsetClicked">
                        <WinTextBlock :Text="$t('text.show-popup-using-offset')" />
                      </WinButton>
                    </template>
                    <div class="popup-card">
                      <div class="popup-card-stack">
                        <WinTextBlock FontSize="16" :Text="$t('sample.popup.simple')" />
                        <WinButton @click="closePopupClicked">
                          <WinTextBlock :Text="$t('sample.popup.close')" />
                        </WinButton>
                      </div>
                    </div>
                  </WinPopup>
                </div>
              </template>
              <template #options>
                <div class="options-panel">
                  <WinToggleSwitch
                    :Header="$t('sample.popup.light-dismiss')"
                    :IsEnabled="!isPopupOpen"
                    v-model:IsOn="isLightDismissEnabled"
                    :OnContent="$t('sample.true')"
                    :OffContent="$t('sample.false')" />
                  <WinNumberBox
                    :Header="$t('sample.popup.vertical-offset')"
                    SpinButtonPlacementMode="Inline"
                    :LargeChange="100"
                    :SmallChange="10"
                    :Minimum="-100"
                    :Maximum="100"
                    v-model:Value="verticalOffset" />
                  <WinNumberBox
                    :Header="$t('sample.popup.horizontal-offset')"
                    SpinButtonPlacementMode="Inline"
                    :LargeChange="100"
                    :SmallChange="10"
                    :Minimum="-100"
                    :Maximum="500"
                    v-model:Value="horizontalOffset" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinPopup from '../../components/WinPopup.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'popup');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const isPopupOpen = ref(false);
const isLightDismissEnabled = ref(true);
const verticalOffset = ref(0);
const horizontalOffset = ref(200);

const showPopupOffsetClicked = () => {
  if (!isPopupOpen.value) isPopupOpen.value = true;
};

const closePopupClicked = () => {
  if (isPopupOpen.value) isPopupOpen.value = false;
};

const popupCode = `<WinPopup
  v-model:IsOpen="isPopupOpen"
  :VerticalOffset="verticalOffset"
  :HorizontalOffset="horizontalOffset"
  :IsLightDismissEnabled="isLightDismissEnabled">
  <template #trigger>
    <WinButton @click="isPopupOpen = true">
      <WinTextBlock Text="Show Popup (using Offset)" />
    </WinButton>
  </template>
  <div class="popup-card">
    <WinTextBlock FontSize="16" Text="Simple Popup" />
    <WinButton @click="isPopupOpen = false">
      <WinTextBlock Text="Close" />
    </WinButton>
  </div>
</WinPopup>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.popup-output { display: inline-flex; align-items: flex-start; justify-content: flex-start; min-width: 320px; min-height: 180px; }
.popup-card {
  position: relative;
  min-width: 240px;
  padding: 16px;
  color: var(--text-primary);
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--surface-stroke-color-default, var(--surface-stroke-color-flyout));
  border-radius: 8px;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}
.popup-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--flyout-background, var(--flyout-bg));
}
.popup-card-stack { display: flex; flex-direction: column; gap: 8px; }
.options-panel { display: flex; flex-direction: column; gap: 12px; width: 220px; }
</style>
