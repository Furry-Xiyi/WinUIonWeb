<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Button</h1>
      <p class="page-description">
        A button gives the user a way to trigger an immediate action.
      </p>
      <div class="page-header-actions">
        <WinButton
          subtle
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Simple Button with text content -->
    <WinControlExample
      headerText="A simple Button with text content."
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
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
    <WinControlExample
      headerText="A Button with graphical content."
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
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
    <WinControlExample
      headerText="Accent and Subtle styles"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <WinButton primary>Accent style button</WinButton>
          <WinButton subtle>Subtle style button</WinButton>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Text wrapping -->
    <WinControlExample headerText="Text wrapping" :theme="pageTheme">
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
import { ref, inject, computed, watch } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'button');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

const example1Enabled = ref(true);
const control1Output = ref('');
const control2Output = ref('');

const onButton1Click = () => {
  control1Output.value = `You clicked: Standard XAML button`;
};

const onButton2Click = () => {
  control2Output.value = `You clicked: The image button`;
};

// 示例代码
const example1Template = `<WinButton
  :disabled="!isEnabled"
  @click="onClick">
  Standard XAML button
</WinButton>`;

const example1Vue = `const isEnabled = ref(true);

const onClick = () => {
  console.log('Button clicked');
};`;

const example2Template = `<WinButton
  @click="onClick"
  style="width: 50px; height: 50px;">
  <img src="icon.png" alt="Icon" />
</WinButton>`;

const example2Vue = `const onClick = () => {
  console.log('Image button clicked');
};`;

const example3Template = `<WinButton primary>Accent style button</WinButton>
<WinButton subtle>Subtle style button</WinButton>`;

const example3Vue = `// Accent style uses 'primary' prop
// Subtle style uses 'subtle' prop`;
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

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
