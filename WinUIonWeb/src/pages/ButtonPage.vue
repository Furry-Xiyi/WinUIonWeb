<template>
  <div>
    <h1 class="page-header">Button</h1>
    <p class="page-description">
      A button gives the user a way to trigger an immediate action.
    </p>

    <!-- Example 1: Simple Button with text content -->
    <WinControlExample headerText="A simple Button with text content.">
      <template #example>
        <WinButton
          :disabled="!example1Enabled"
          @click="onButton1Click">
          Standard XAML button
        </WinButton>
      </template>
      <template #output>
        <p class="output-text">{{ control1Output || 'Click the button' }}</p>
      </template>
      <template #options>
        <WinCheckBox v-model="example1Enabled">
          Enable button
        </WinCheckBox>
      </template>
    </WinControlExample>

    <!-- Example 2: Button with graphical content -->
    <WinControlExample headerText="A Button with graphical content.">
      <template #example>
        <WinButton
          @click="onButton2Click"
          style="width: 50px; height: 50px; padding: 4px;">
          <img
            src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/Slices.png"
            alt="Pie slice"
            style="width: 100%; height: 100%; object-fit: contain;" />
        </WinButton>
      </template>
      <template #output>
        <p class="output-text">{{ control2Output || 'Click the button' }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: Accent and Subtle styles -->
    <WinControlExample headerText="Accent and Subtle styles">
      <template #example>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <WinButton primary>Accent style button</WinButton>
          <WinButton subtle>Subtle style button</WinButton>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Text wrapping -->
    <WinControlExample headerText="Text wrapping">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
            The following buttons' content may get clipped if we don't pay careful attention to their layout containers.
          </p>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
            One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:
          </p>
          <WinButton style="width: 100%; max-width: 400px; margin-bottom: 5px;">
            This is some text that is too long and will get cut off
          </WinButton>
          <WinButton style="width: 100%; max-width: 400px;">
            This is another text that would result in being cut off
          </WinButton>

          <p style="margin: 12px 0 8px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
            Another option is to explicitly wrap the Button's content:
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <WinButton :wrap="true" style="max-width: 240px;">
              This is some text that is too long and will get cut off without wrapping
            </WinButton>
            <WinButton :wrap="true" style="max-width: 240px;">
              This is another text that would result in being cut off without wrapping
            </WinButton>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const example1Enabled = ref(true);
const control1Output = ref('');
const control2Output = ref('');

const onButton1Click = () => {
  control1Output.value = `You clicked: Standard XAML button`;
};

const onButton2Click = () => {
  control2Output.value = `You clicked: The image button`;
};
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
