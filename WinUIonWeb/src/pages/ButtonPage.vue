<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Button</h1>
      <p class="page-description">
        The Button control provides a Click event to respond to user input from a touch, mouse, keyboard, stylus, or other input device. You
        can put different kinds of content in a button, such as text or an image, or you can restyle a button to give it a new look.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Simple Button with text content -->
    <p class="control-example-description">A simple Button with text content.</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example1Template">
      <template #example>
        <WinButton
          :IsEnabled="!disableControl1"
          AutomationProperties.Name="Standard XAML"
          Content="Standard XAML button"
          @click="onButton1Click" />
      </template>
      <template #options>
        <WinTextBlock FontFamily="Global User Interface" :Text="control1Output" />

        <WinCheckBox v-model="disableControl1">
          Disable button
        </WinCheckBox>
      </template>
    </WinControlExample>

    <!-- Example 2: Button with graphical content -->
    <p class="control-example-description">A Button with graphical content.</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example2Template">
      <template #example>
        <WinButton
          Width="50"
          Height="50"
          AutomationProperties.Name="Pie"
          @click="onButton2Click"
          style="padding: 4px;">
          <img
            :src="pieSliceImageUrl"
            alt="Pie slice"
            style="width: 100%; height: 100%; object-fit: contain;" />
        </WinButton>
      </template>
      <template #options>
        <WinTextBlock :Text="control2Output" />
      </template>
    </WinControlExample>

    <!-- Example 3: Accent and Subtle styles -->
    <p class="control-example-description">Accent and Subtle styles</p>
    <WinControlExample class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="example3Template">
      <template #example>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <WinButton Style="{StaticResource AccentButtonStyle}" Content="Accent style button"/>
          <WinButton Style="{StaticResource SubtleButtonStyle}" Content="Subtle style button"/>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 4: Text wrapping -->
    <p class="control-example-description">Text wrapping</p>
    <WinControlExample class="basic-input-example-theme" :theme="pageTheme" :vue="example4Template">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
          <WinTextBlock Margin="0,0,0,8" Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers." TextWrapping="Wrap" />
          <WinTextBlock Margin="0,0,0,8" Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:" TextWrapping="Wrap" />
          <WinButton HorizontalAlignment="Stretch" Margin="0,0,0,5" style="width: 100%; max-width: 400px; margin-bottom: 5px;">
            This is some text that is too long and will get cut off
          </WinButton>
          <WinButton HorizontalAlignment="Stretch" style="width: 100%; max-width: 400px;">
            This is another text that would result in being cut off
          </WinButton>

          <WinTextBlock Margin="0,8,0,8" Text="Another option is to explicitly wrap the Button's content" />
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <WinButton MaxWidth="240" Margin="0,0,8,0" style="max-width: 240px;">
              <WinTextBlock Text="This is some text that is too long and will get cut off without wrapping" TextWrapping="WrapWholeWords" />
            </WinButton>
            <WinButton MaxWidth="240" style="max-width: 240px;">
              <WinTextBlock Text="This is another text that would result in being cut off without wrapping" TextWrapping="WrapWholeWords" />
            </WinButton>
          </div>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';
import WinControlExample from '../components/WinControlExample.vue';
import WinCheckBox from '../components/WinCheckBox.vue';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'button');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const disableControl1 = ref(false);
const control1Output = ref('');
const control2Output = ref('');
const pieSliceImageUrl = 'https://raw.githubusercontent.com/Furry-Xiyi/WinUIonWeb/master/WinUI-Gallery/WinUIGallery/Assets/SampleMedia/Slices.png';

const onButton1Click = () => {
  control1Output.value = `You clicked: Button1`;
};

const onButton2Click = () => {
  control2Output.value = `You clicked: Button2`;
};

// 示例代码
const example1Template = `<WinButton
  :IsEnabled="!disableControl"
  AutomationProperties.Name="Standard XAML"
  Content="Standard XAML button"
  @click="onButtonClick" />

<WinTextBlock FontFamily="Global User Interface" :Text="controlOutput" />`;

const example2Template = `<WinButton
  Width="50"
  Height="50"
  AutomationProperties.Name="Pie"
  @click="onButtonClick"
  style="padding: 4px;">
  <img src="${pieSliceImageUrl}" alt="Pie slice" />
</WinButton>

<WinTextBlock :Text="controlOutput" />`;

const example3Template = `<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <WinButton Style="{StaticResource AccentButtonStyle}" Content="Accent style button" />
  <WinButton Style="{StaticResource SubtleButtonStyle}" Content="Subtle style button" />
</div>`;

const example4Template = `<div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
  <WinTextBlock
    Margin="0,0,0,8"
    Text="The following buttons' content may get clipped if we don't pay careful attention to their layout containers."
    TextWrapping="Wrap" />
  <WinTextBlock
    Margin="0,0,0,8"
    Text="One option to mitigate clipped content is to place Buttons underneath each other, allowing for more space to grow horizontally:"
    TextWrapping="Wrap" />
  <WinButton HorizontalAlignment="Stretch" Margin="0,0,0,5">
    This is some text that is too long and will get cut off
  </WinButton>
  <WinButton HorizontalAlignment="Stretch">
    This is another text that would result in being cut off
  </WinButton>

  <WinTextBlock Margin="0,8,0,8" Text="Another option is to explicitly wrap the Button's content" />
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <WinButton MaxWidth="240" Margin="0,0,8,0">
      <WinTextBlock
        Text="This is some text that is too long and will get cut off without wrapping"
        TextWrapping="WrapWholeWords" />
    </WinButton>
    <WinButton MaxWidth="240">
      <WinTextBlock
        Text="This is another text that would result in being cut off without wrapping"
        TextWrapping="WrapWholeWords" />
    </WinButton>
  </div>
</div>`;
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




