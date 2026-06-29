<template>
  <div>
    <h1 class="page-header">Expander</h1>
    <p class="page-description">
      The Expander control lets you show or hide less important content that's related to a piece of primary content that's always visible. Items contained in the Header are always visible. The user can expand and collapse the Content area to display the body content.
    </p>

    <WinControlExample headerText="An Expander with text in the header and content.">
      <template #example>
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
    </WinControlExample>

    <WinControlExample headerText="Modifying an Expander's content alignment.">
      <template #example>
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
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinExpander from '../components/WinExpander.vue';
import WinControlExample from '../components/WinControlExample.vue';
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
