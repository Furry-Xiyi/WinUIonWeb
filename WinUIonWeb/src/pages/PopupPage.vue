<template>
  <div class="page-container">
    <h1 class="page-header">Popup</h1>
    <div class="content-split">
      <div class="left-pane">
        <WinSettingsCard>
          <template #header>Popup with Offset Positioning</template>
          <template #description>Show a popup positioned below the button.</template>
          <WinPopup :visible="showPopup"
                    :verticalOffset="verticalOffset"
                    :horizontalOffset="horizontalOffset"
                    :lightDismiss="isLightDismissEnabled"
                    @update:visible="showPopup = $event">
            <template #trigger>
              <WinButton data-popup-trigger @click="showPopup = !showPopup">Show Popup (using Offset)</WinButton>
            </template>
            <div class="popup-sample">
              <p>This is a popup with offset positioning.</p>
              <WinButton @click="showPopup = false">Close Popup</WinButton>
            </div>
          </WinPopup>
        </WinSettingsCard>
      </div>
      <div class="right-pane">
        <WinSettingsCard contentPlacement="bottom">
          <div class="options-list">
            <WinToggleSwitch v-model="isLightDismissEnabled">IsLightDismissEnabled</WinToggleSwitch>
            <div class="input-group">
              <label>VerticalOffset</label>
              <input type="number" class="win-input" v-model.number="verticalOffset" />
            </div>
            <div class="input-group">
              <label>HorizontalOffset</label>
              <input type="number" class="win-input" v-model.number="horizontalOffset" />
            </div>
          </div>
        </WinSettingsCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinButton from '../components/WinButton.vue';
import WinPopup from '../components/WinPopup.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';

const showPopup = ref(false);
const isLightDismissEnabled = ref(true);
const verticalOffset = ref(0);
const horizontalOffset = ref(0);
</script>

<style scoped>
.page-container {
  padding: 0;
}

.content-split {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.left-pane {
  flex: 1;
}

.right-pane {
  flex: 0 0 320px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 14px;
  color: var(--text-primary);
}

.win-input {
  height: 32px;
  padding: 0 11px;
  border-radius: 4px;
  border: 1px solid var(--ctrl-border);
  border-bottom: 1px solid var(--ctrl-border-accent);
  background: var(--ctrl-fill-default);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border var(--fast-duration);
}

.win-input:focus {
  border-bottom: 2px solid var(--accent-base);
}

.popup-sample {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-sample p {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}
</style>
