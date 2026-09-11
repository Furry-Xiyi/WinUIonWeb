<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind $t('text.splitbutton'), Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind $t('text.the-splitbutton-is-a-dropdown-button-but-with-an'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" SampleDefinition="SplitButton\SplitButtonColorPicker.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind splitButtonColorPickerVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.splitbutton.color-picker'), Mode=OneWay}">
              <Grid ColumnSpacing="24">
                  <SplitButton MinWidth="0" MinHeight="0" Padding="0" VerticalAlignment="Top" Theme="{x:Bind pageTheme, Mode=OneWay}" AutomationProperties.Name="Font color" Click="applyCurrentColor">
                    <Border class="color-swatch current-swatch" Background="{x:Bind currentColor, Mode=OneWay}" />
                    <SplitButton.Flyout>
                      <Flyout Placement="Bottom">
                        <VariableSizedWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal">
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Red" Click="SelectRed_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Red" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Orange" Click="SelectOrange_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Orange" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Yellow" Click="SelectYellow_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Yellow" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Green" Click="SelectGreen_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Green" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Blue" Click="SelectBlue_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Blue" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Indigo" Click="SelectIndigo_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Indigo" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Violet" Click="SelectViolet_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Violet" /></Button>
                        <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Gray" Click="SelectGray_Click"><Rectangle Width="32" Height="32" RadiusX="4" RadiusY="4" Fill="Gray" /></Button>
                        </VariableSizedWrapGrid>
                      </Flyout>
                    </SplitButton.Flyout>
                  </SplitButton>
              </Grid>
              <ControlExample.Options>
                <RichEditBox
                  ref="richEditBoxRef"
                  Text="{x:Bind richText, Mode=TwoWay}"
                  class="sample-editor"
                  AcceptsReturn
                  TextWrapping="Wrap"
                  PlaceholderText="{x:Bind $t('sample.type-something-here'), Mode=OneWay}"
                  />
              </ControlExample.Options>
            </ControlExample>
            <ControlExample class="basic-input-example-theme" SampleDefinition="SplitButton\SplitButtonText.txt" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind splitButtonTextVue, Mode=OneWay}" HeaderText="{x:Bind $t('sample.splitbutton.text'), Mode=OneWay}">
              <ControlExample.Example>
                <SplitButton MinWidth="0" MinHeight="0" Padding="5" VerticalAlignment="Top" Theme="{x:Bind pageTheme, Mode=OneWay}" AutomationProperties.Name="Font color with text">
                  <TextBlock Text="{x:Bind $t('sample.choose-color'), Mode=OneWay}" />
                  <SplitButton.Flyout>
                    <Flyout Placement="Bottom">
                      <VariableSizedWrapGrid MaximumRowsOrColumns="3" Orientation="Horizontal">
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Red" Click="SelectTextRed_Click"><Border class="color-swatch" Background="Red" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Orange" Click="SelectTextOrange_Click"><Border class="color-swatch" Background="Orange" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Yellow" Click="SelectTextYellow_Click"><Border class="color-swatch" Background="Yellow" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Green" Click="SelectTextGreen_Click"><Border class="color-swatch" Background="Green" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Blue" Click="SelectTextBlue_Click"><Border class="color-swatch" Background="Blue" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Indigo" Click="SelectTextIndigo_Click"><Border class="color-swatch" Background="Indigo" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Violet" Click="SelectTextViolet_Click"><Border class="color-swatch" Background="Violet" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Gray" Click="SelectTextGray_Click"><Border class="color-swatch" Background="Gray" /></Button>
                      <Button Padding="0" MinWidth="0" MinHeight="0" Margin="6" AutomationProperties.Name="Black" Click="SelectTextBlack_Click"><Border class="color-swatch" Background="Black" /></Button>
                      </VariableSizedWrapGrid>
                    </Flyout>
                  </SplitButton.Flyout>
                </SplitButton>
              </ControlExample.Example>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import Border from '../../components/Border.vue';
import Grid from '../../components/Grid.vue';
import Flyout from '../../components/Flyout.vue';
import SplitButton from '../../components/SplitButton.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'splitbutton');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const currentColor = ref('Green');
const selectedTextColor = ref('Green');
const richText = ref(t('sample.splitbutton.rich-text'));
const richEditBoxRef = ref(null);

const colorOptions = computed(() => [
  { text: t('text.red'), value: 'Red' },
  { text: t('sample.orange'), value: 'Orange' },
  { text: t('text.yellow'), value: 'Yellow' },
  { text: t('text.green'), value: 'Green' },
  { text: t('text.blue'), value: 'Blue' },
  { text: t('sample.indigo'), value: 'Indigo' },
  { text: t('sample.violet'), value: 'Violet' },
  { text: t('sample.gray'), value: 'Gray' }
]);
const textColorOptions = computed(() => [...colorOptions.value, { text: t('sample.black'), value: 'Black' }]);

const selectColor = (color, close) => {
  currentColor.value = color;
  richEditBoxRef.value?.applyForegroundColor?.(color, true);
  close?.();
};

const selectTextColor = (color, close) => {
  selectedTextColor.value = color;
  close?.();
};

const SelectRed_Click = () => selectColor('Red');
const SelectOrange_Click = () => selectColor('Orange');
const SelectYellow_Click = () => selectColor('Yellow');
const SelectGreen_Click = () => selectColor('Green');
const SelectBlue_Click = () => selectColor('Blue');
const SelectIndigo_Click = () => selectColor('Indigo');
const SelectViolet_Click = () => selectColor('Violet');
const SelectGray_Click = () => selectColor('Gray');
const SelectTextRed_Click = () => selectTextColor('Red');
const SelectTextOrange_Click = () => selectTextColor('Orange');
const SelectTextYellow_Click = () => selectTextColor('Yellow');
const SelectTextGreen_Click = () => selectTextColor('Green');
const SelectTextBlue_Click = () => selectTextColor('Blue');
const SelectTextIndigo_Click = () => selectTextColor('Indigo');
const SelectTextViolet_Click = () => selectTextColor('Violet');
const SelectTextGray_Click = () => selectTextColor('Gray');
const SelectTextBlack_Click = () => selectTextColor('Black');

const applyCurrentColor = () => {
  richEditBoxRef.value?.applyForegroundColor?.(currentColor.value, true);
};

onMounted(() => {
  nextTick(() => richEditBoxRef.value?.applyForegroundColor?.('Green', true));
});

const splitButtonColorPickerVue = `<SplitButton MinWidth="0" MinHeight="0" Padding="0" VerticalAlignment="Top" AutomationProperties.Name="Font color" Click="applyCurrentColor">
  <Border Width="32" Height="32" Background="{x:Bind currentColor}" CornerRadius="4,0,0,4" />
  <SplitButton.Flyout>
    <Flyout Placement="Bottom">
      <GridView IsItemClickEnabled="True" ItemClick="ColorOption_Click" ItemsSource="{x:Bind colorOptions}" />
    </Flyout>
  </SplitButton.Flyout>
</SplitButton>`;

const splitButtonTextVue = `<SplitButton MinWidth="0" MinHeight="0" Padding="5" VerticalAlignment="Top" AutomationProperties.Name="Font color with text">
                  <TextBlock Text="{x:Bind $t('sample.choose-color'), Mode=OneWay}" />
  <SplitButton.Flyout>
    <Flyout Placement="Bottom">
      <GridView IsItemClickEnabled="True" ItemClick="TextColorOption_Click" ItemsSource="{x:Bind textColorOptions}" />
    </Flyout>
  </SplitButton.Flyout>
</SplitButton>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.color-swatch { display: block; width: 32px; height: 32px; border-radius: 4px; }
.current-swatch { border-radius: 4px 0 0 4px; }
.swatch-grid { display: grid; grid-template-columns: repeat(3, 44px); gap: 0; padding: 4px; }
.sample-editor { width: 100%; min-width: 240px; min-height: 96px; }

.sample-editor :deep(.win-textbox-textarea) {
  min-height: 96px;
}
</style>
