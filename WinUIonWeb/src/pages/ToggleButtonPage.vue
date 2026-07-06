<template>
  <div>
    <div style="position: relative;">
      <WinTextBlock class="page-header" Text="ToggleButton" />
      <WinTextBlock
        class="page-description"
        Text="A ToggleButton looks like a Button, but works like a CheckBox. It typically has two states, checked (on) or unchecked (off), but can be indeterminate if the IsThreeState property is true. You can determine it's state by checking the IsChecked property."
        TextWrapping="WrapWholeWords" />
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

    <WinControlExample
      class="basic-input-example-theme"
      :theme="pageTheme"
      :vue="toggleButtonVue"
      :xaml="toggleButtonXaml"
      :cSharp="toggleButtonCSharp">
      <template #example>
        <WinToggleButton
          v-model:IsChecked="Toggle1"
          Content="ToggleButton"
          :IsEnabled="DisableToggle1 !== true"
          @Checked="ToggleButton_Checked"
          @Unchecked="ToggleButton_Unchecked" />
      </template>

      <template #options>
        <WinTextBlock class="output-text" :Text="Control1Output" />
        <WinCheckBox v-model="DisableToggle1">
          Disable ToggleButton
        </WinCheckBox>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinCheckBox from '../components/WinCheckBox.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinTextBlock from '../components/WinTextBlock.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { createPageState } from '../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'togglebutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const Toggle1 = ref(false);
const DisableToggle1 = ref(false);
const Control1Output = ref(Toggle1.value === true ? 'On' : 'Off');

const ToggleButton_Checked = () => {
  Control1Output.value = 'On';
};

const ToggleButton_Unchecked = () => {
  Control1Output.value = 'Off';
};

const toggleButtonVue = `<WinToggleButton
  v-model:IsChecked="Toggle1"
  Content="ToggleButton"
  :IsEnabled="DisableToggle1 !== true"
  @Checked="ToggleButton_Checked"
  @Unchecked="ToggleButton_Unchecked" />`;

const toggleButtonXaml = `<ToggleButton
    x:Name="Toggle1"
    Checked="ToggleButton_Checked"
    Content="ToggleButton"
    IsEnabled="{x:Bind DisableToggle1.IsChecked.Value.Equals(x:False), Mode=OneWay}"
    Unchecked="ToggleButton_Unchecked" />`;

const toggleButtonCSharp = `public sealed partial class ToggleButtonPage : Page
{
    public ToggleButtonPage()
    {
        this.InitializeComponent();

        // Set initial output value.
        Control1Output.Text = Toggle1.IsChecked is true ? "On" : "Off";
    }

    private void ToggleButton_Checked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "On";
    }

    private void ToggleButton_Unchecked(object sender, RoutedEventArgs e)
    {
        Control1Output.Text = "Off";
    }
}`;
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
