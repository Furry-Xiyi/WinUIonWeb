<template>
  <div>
    <h1 class="page-header">Popup</h1>
    <p class="page-description">
      Displays content on top of existing content, within the bounds of the app window. Use a Popup for temporarily displaying content that should appear above other UI.
    </p>

    <WinControlExample headerText="Popup with offset positioning.">
      <template #example>
        <div class="popup-demo-container">
          <WinPopup
            :visible="showPopup"
            :verticalOffset="verticalOffset"
            :horizontalOffset="horizontalOffset"
            :lightDismiss="isLightDismissEnabled"
            @update:visible="showPopup = $event">
            <template #trigger>
              <WinButton @click="showPopup = !showPopup">
                Show Popup (using Offset)
              </WinButton>
            </template>
            <template #default>
              <div class="popup-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                  Simple Popup
                </div>
                <WinButton @click="showPopup = false">Close</WinButton>
              </div>
            </template>
          </WinPopup>
        </div>
      </template>
      <template #options>
        <div class="options-panel">
          <WinToggleSwitch
            v-model="isLightDismissEnabled"
            header="IsLightDismissEnabled"
            onContent="True"
            offContent="False" />

          <div class="input-section">
            <label class="input-label">VerticalOffset</label>
            <input
              type="number"
              v-model.number="verticalOffset"
              class="number-input"
              :min="-100"
              :max="100"
              :step="10" />
          </div>

          <div class="input-section">
            <label class="input-label">HorizontalOffset</label>
            <input
              type="number"
              v-model.number="horizontalOffset"
              class="number-input"
              :min="-100"
              :max="500"
              :step="10" />
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinPopup from '../components/WinPopup.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';

const showPopup = ref(false);
const isLightDismissEnabled = ref(true);
const verticalOffset = ref(0);
const horizontalOffset = ref(200);
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.popup-demo-container {
  display: inline-block;
  position: relative;
}

.popup-content {
  min-width: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
}

.number-input {
  padding: 6px 12px;
  border: 1px solid var(--control-stroke-default);
  border-radius: 4px;
  background: var(--control-fill-default);
  color: var(--text-primary);
  font-size: 14px;
  width: 100%;
}

.number-input:focus {
  outline: none;
  border-color: var(--accent-default);
}
</style>
