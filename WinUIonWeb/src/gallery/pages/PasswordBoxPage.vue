<template>
  <Page>

    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
        <StackPanel>
          <ControlExample x:Name="Example1" SampleDefinition="PasswordBox\SimplePasswordbox.txt" HeaderText="{x:Bind Labels.Header0, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[0].Xaml}" CSharp="{x:Bind Sources[0].CSharp}">
            <ControlExample.Example>
              <StackPanel>
                <PasswordBox Width="300" AutomationProperties.Name="{x:Bind Labels.Text4, Mode=OneWay}" PasswordChanged="PasswordBox_PasswordChanged" />
                <TextBlock x:Name="Control1Output" FontFamily="Global User Interface" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind PasswordMessage, Mode=OneWay}" Visibility="{x:Bind PasswordOutputVisibility, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample x:Name="Example2" SampleDefinition="PasswordBox\PasswordboxHeaderPlaceholderText.txt" HeaderText="{x:Bind Labels.Header1, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[1].Xaml}" CSharp="{x:Bind Sources[1].CSharp}">
            <ControlExample.Example>
              <PasswordBox Width="300" Header="{x:Bind Labels.Text6, Mode=OneWay}" PasswordChar="#" PlaceholderText="{x:Bind Labels.Text7, Mode=OneWay}" />
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
          <ControlExample SampleDefinition="PasswordBox\PasswordboxRevealMode.txt" HeaderText="{x:Bind Labels.Header2, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Sources[2].Xaml}" CSharp="{x:Bind Sources[2].CSharp}">
            <ControlExample.Example>
              <StackPanel Orientation="Horizontal">
                <PasswordBox x:Name="passworBoxWithRevealmode" Width="250" Margin="0,0,8,0" AutomationProperties.Name="{x:Bind Labels.Text9, Mode=OneWay}" PasswordRevealMode="Hidden" />
                <CheckBox x:Name="revealModeCheckBox" Checked="RevealModeCheckbox_Changed" Content="{x:Bind Labels.Text10, Mode=OneWay}" IsChecked="False" Unchecked="RevealModeCheckbox_Changed" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />

          </ControlExample>
        </StackPanel>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>

  </Page>
</template>

<script setup>
import { computed, inject, onMounted, provide, ref, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import FontIcon from '../../components/FontIcon.vue';
import ControlExample from '../../components/ControlExample.vue';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import Grid from '../../components/Grid.vue';
import RowDefinition from '../../components/RowDefinition.vue';
import ColumnDefinition from '../../components/ColumnDefinition.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import AutoSuggestBox from '../../components/AutoSuggestBox.vue';
import NumberBox from '../../components/NumberBox.vue';
import PasswordBox from '../../components/PasswordBox.vue';
import RichEditBox from '../../components/RichEditBox.vue';
import RichTextBlock from '../../components/RichTextBlock.vue';
import RelativePanel from '../../components/RelativePanel.vue';
import Image from '../../components/Image.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import RadioButton from '../../components/RadioButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import CheckBox from '../../components/CheckBox.vue';
import ComboBox from '../../components/ComboBox.vue';
import DropDownButton from '../../components/DropDownButton.vue';
import Flyout from '../../components/Flyout.vue';
import VariableSizedWrapGrid from '../../components/VariableSizedWrapGrid.vue';
import Rectangle from '../../components/Rectangle.vue';
import SymbolIcon from '../../components/SymbolIcon.vue';
import RichTextBlockOverflow from '../../components/RichTextBlockOverflow.vue';
import SampleCodePresenter from '../../components/SampleCodePresenter.vue';
import { Run, Span, Bold, Italic, Underline, LineBreak, Hyperlink, Paragraph } from '../../components/TextInline';
import { ComboBoxItem, XamlString } from '../../components/inlineControlProperties';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import { ResourceDictionary } from '../../components/xamlPrimitives';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import Sample0 from '../samples/PasswordBox/SimplePasswordbox.txt?raw';
import Sample1 from '../samples/PasswordBox/PasswordboxHeaderPlaceholderText.txt?raw';
import Sample2 from '../samples/PasswordBox/PasswordboxRevealMode.txt?raw';
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'passwordbox');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ Title: t('text.passwordbox'), Description: t('text.a-passwordbox-is-a-text-input-box-that-conceals'), ToggleTheme: t('gallery.page-header.toggle-theme'), Header0: t('text.a-simple-passwordbox'), Text4: t('TextControls.PasswordBox.Label1'), Header1: t('sample.passwordbox.header-placeholder-character'), Text6: t('sample.passwordbox.password'), Text7: t('sample.passwordbox.enter-password'), Header2: t('sample.passwordbox.reveal-mode'), Text9: t('TextControls.PasswordBox.Label2'), Text10: t('sample.passwordbox.show-password') }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const Sources = [Sample0,Sample1,Sample2].map(sample => ({ Xaml: sample.split(/^--- xaml\r?\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\r?\n/m)[1]?.trim() ?? '' }));
const PasswordBox_PasswordChanged = sender => {
  passwordInvalid.value = !sender.Password || sender.Password === 'Password';
  if (passwordInvalid.value && sender.Password) sender.Password = '';
};
const passwordInvalid = ref(false);
const PasswordMessage = computed(() => passwordInvalid.value ? t('sample.passwordbox.not-allowed') : '');
const PasswordOutputVisibility = computed(() => passwordInvalid.value ? 'Visible' : 'Collapsed');
const RevealModeCheckbox_Changed = sender => { controls.passworBoxWithRevealmode.PasswordRevealMode = sender.IsChecked ? 'Visible' : 'Hidden'; };

provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite, PasswordMessage, PasswordOutputVisibility, PasswordBox_PasswordChanged, RevealModeCheckbox_Changed });
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
