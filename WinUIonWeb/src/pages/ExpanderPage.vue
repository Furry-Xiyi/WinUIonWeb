<template>
  <div class="control-page">
    <h1 class="page-header">Expander</h1>
    <p class="page-description">
      The Expander control lets you show or hide less important content that's related to a piece of primary content that's always visible. Items contained in the Header are always visible. The user can expand and collapse the Content area to display the body content.
    </p>

    <!-- Example 1: Text in header and content -->
    <WinSettingsCard
      header="An Expander with text in the header and content."
      description="Click the header to expand and collapse the content.">
      <template #default>
        <WinExpander
          v-model:isExpanded="expander1Expanded"
          :expandDirection="expandDirection">
          <template #header>
            This text is in the header
          </template>
          <template #default>
            This is in the content
          </template>
        </WinExpander>
      </template>
      <template #options>
        <div class="options-panel">
          <label class="option-label">ExpandDirection</label>
          <WinComboBox
            :options="expandDirections"
            v-model="expandDirectionIndex"
            style="width: 100%;" />
        </div>
      </template>
    </WinSettingsCard>

    <!-- Example 2: Modifying content alignment -->
    <WinSettingsCard
      header="Modifying an Expander's content alignment."
      description="The header is centered, but the content is left-aligned.">
      <template #default>
        <WinExpander style="width: 500px; max-width: 100%;">
          <template #header>
            <div style="text-align: center; width: 100%;">
              This text is centered
            </div>
          </template>
          <template #default>
            <div style="padding: 4px;">
              And this text is left aligned
            </div>
          </template>
        </WinExpander>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinExpander from '../components/WinExpander.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinComboBox from '../components/WinComboBox.vue';

const expander1Expanded = ref(false);

const expandDirections = [
  { label: 'Down' },
  { label: 'Up' }
];
const expandDirectionIndex = ref(0);
const expandDirection = computed(() => expandDirections[expandDirectionIndex.value].label);
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.options-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
}
</style>
