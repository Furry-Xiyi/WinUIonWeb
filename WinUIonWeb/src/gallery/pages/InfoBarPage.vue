<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <StackPanel class="gallery-item-page">
      <StackPanel class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="36" Margin="0,0,80,8" />
        <TextBlock class="page-description" Text="{x:Bind PageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" Margin="0,0,0,16" />
        <StackPanel class="page-header-actions" Orientation="Horizontal">
          <Button class="header-action" AutomationProperties.Name="{x:Bind ThemeButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind ThemeButtonLabel, Mode=OneWay}" Click="toggleTheme"><FontIcon Glyph="&#xE793;" FontSize="16" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteButtonLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteButtonLabel, Mode=OneWay}" Click="toggleFavorite"><FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" FontSize="16" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></ToggleButton>
        </StackPanel>
      </StackPanel>
      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="infobar-example" SampleDefinition="InfoBar\ClosableInfobarOptionsChange.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Example1Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Example1Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <InfoBar x:Name="TestInfoBar1" IsOpen="True" Severity="Informational" Title="{x:Bind InfoBarTitle, Mode=OneWay}" Message="{x:Bind EssentialMessage, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Width="200" class="infobar-output-text" Text="{x:Bind Example1Output, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel Width="150">
              <CheckBox x:Name="IsOpenCheckBox1" Content="{x:Bind IsOpenLabel, Mode=OneWay}" IsChecked="{x:Bind TestInfoBar1.IsOpen, Mode=TwoWay}" />
              <ComboBox x:Name="SeverityComboBox" HorizontalAlignment="Stretch" Header="{x:Bind SeverityLabel, Mode=OneWay}" SelectedIndex="0" SelectionChanged="SeverityComboBox_SelectionChanged">
                <ComboBoxItem Content="{x:Bind InformationalLabel}" /><ComboBoxItem Content="{x:Bind SuccessLabel}" /><ComboBoxItem Content="{x:Bind WarningLabel}" /><ComboBoxItem Content="{x:Bind ErrorLabel}" />
              </ComboBox>
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
        <ControlExample x:Name="Example2" class="infobar-example" SampleDefinition="InfoBar\ClosableInfobarLongShort.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Example2Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Example2Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <InfoBar x:Name="TestInfoBar2" IsOpen="True" Title="{x:Bind InfoBarTitle, Mode=OneWay}" Message="{x:Bind example2Message, Mode=OneWay}" ActionButton="{x:Bind example2ActionControl, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Width="200" class="infobar-output-text" Text="{x:Bind Example2Output, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel Width="150">
              <CheckBox x:Name="IsOpenCheckBox2" Content="{x:Bind IsOpenLabel, Mode=OneWay}" IsChecked="{x:Bind TestInfoBar2.IsOpen, Mode=TwoWay}" />
              <ComboBox x:Name="MessageComboBox" HorizontalAlignment="Stretch" Header="{x:Bind MessageLengthLabel, Mode=OneWay}" SelectedIndex="1" SelectionChanged="MessageComboBox_SelectionChanged"><ComboBoxItem Content="{x:Bind ShortLabel}" /><ComboBoxItem Content="{x:Bind LongLabel}" /></ComboBox>
              <ComboBox x:Name="ActionButtonComboBox" HorizontalAlignment="Stretch" Header="{x:Bind ActionButtonLabel, Mode=OneWay}" SelectedIndex="0" SelectionChanged="ActionButtonComboBox_SelectionChanged"><ComboBoxItem Content="{x:Bind NoneLabel}" /><ComboBoxItem Content="{x:Bind ButtonLabel}" /><ComboBoxItem Content="{x:Bind HyperlinkLabel}" /></ComboBox>
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
        <ControlExample x:Name="Example3" class="infobar-example" SampleDefinition="InfoBar\ClosableInfobarOptionsDisplay.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind Example3Header, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind Example3Xaml, Mode=OneWay}">
          <ControlExample.Example>
            <InfoBar x:Name="TestInfoBar3" IsOpen="True" IsClosable="True" IsIconVisible="True" Title="{x:Bind InfoBarTitle, Mode=OneWay}" Message="{x:Bind EssentialMessage, Mode=OneWay}" />
          </ControlExample.Example>
          <ControlExample.Output><TextBlock Width="200" class="infobar-output-text" Text="{x:Bind Example3Output, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          <ControlExample.Options>
            <StackPanel Width="150">
              <CheckBox x:Name="IsOpenCheckBox3" Content="{x:Bind IsOpenLabel, Mode=OneWay}" IsChecked="{x:Bind TestInfoBar3.IsOpen, Mode=TwoWay}" />
              <CheckBox x:Name="IsIconVisibleCheckBox" Content="{x:Bind IsIconVisibleLabel, Mode=OneWay}" IsChecked="{x:Bind TestInfoBar3.IsIconVisible, Mode=TwoWay}" />
              <CheckBox x:Name="IsClosableCheckBox" Content="{x:Bind IsClosableLabel, Mode=OneWay}" IsChecked="{x:Bind TestInfoBar3.IsClosable, Mode=TwoWay}" />
            </StackPanel>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </StackPanel>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, h, inject, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ComboBox from '../../components/ComboBox.vue'
import { ComboBoxItem } from '../../components/inlineControlProperties'
import ControlExample from '../../components/ControlExample.vue'
import FontIcon from '../../components/FontIcon.vue'
import HyperlinkButton from '../../components/HyperlinkButton.vue'
import InfoBar from '../../components/InfoBar.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject<{ value?: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'infobar')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const PageTitle = computed(() => t('text.infobar'))
const PageDescription = computed(() => t('sample.infobar.description'))
const ThemeButtonLabel = computed(() => t('sample.navigationview.change-theme'))
const FavoriteButtonLabel = computed(() => t(isFavoriteState.value ? 'sample.navigationview.remove-favorite' : 'sample.navigationview.add-favorite'))
const Example1Header = computed(() => t('sample.infobar.closable-options-change'))
const Example2Header = computed(() => t('sample.infobar.long-short-message-buttons'))
const Example3Header = computed(() => t('sample.infobar.display-options'))
const InfoBarTitle = computed(() => t('sample.infobar.title'))
const EssentialMessage = computed(() => t('sample.infobar.essential-message'))
const IsOpenLabel = computed(() => t('sample.infobar.is-open'))
const SeverityLabel = computed(() => t('sample.infobar.severity'))
const InformationalLabel = computed(() => t('sample.infobar.severity-informational'))
const SuccessLabel = computed(() => t('sample.infobar.severity-success'))
const WarningLabel = computed(() => t('sample.infobar.severity-warning'))
const ErrorLabel = computed(() => t('sample.infobar.severity-error'))
const MessageLengthLabel = computed(() => t('sample.infobar.message-length'))
const ActionButtonLabel = computed(() => t('sample.infobar.action-button'))
const IsIconVisibleLabel = computed(() => t('sample.infobar.is-icon-visible'))
const IsClosableLabel = computed(() => t('sample.infobar.is-closable'))
const ShortLabel = computed(() => t('sample.infobar.short'))
const LongLabel = computed(() => t('sample.infobar.long'))
const NoneLabel = computed(() => t('text.none'))
const ButtonLabel = computed(() => t('text.button'))
const HyperlinkLabel = computed(() => t('sample.infobar.hyperlink'))
const ActionLabel = computed(() => t('sample.infobar.action'))
const InformationalLinkLabel = computed(() => t('sample.infobar.informational-link'))
type InfoBarApi = { IsOpen: boolean; Severity: string; Message: string; IsIconVisible: boolean; IsClosable: boolean }
const names = shallowReactive<Record<string, InfoBarApi>>({})
provide(xamlNameScopeKey, names)
const example2MessageLength = ref(1)
const example2ActionButton = ref(0)
const actionInvocations = ref(0)
const example2Message = computed(() => t(example2MessageLength.value === 0 ? 'sample.infobar.short-message' : 'sample.infobar.long-message'))
const example2ActionControl = computed(() => example2ActionButton.value === 1
  ? h(Button, { Content: ActionLabel.value, onClick: InfoBarButton_Click })
  : example2ActionButton.value === 2 ? h(HyperlinkButton, { Content: InformationalLinkLabel.value, NavigateUri: 'http://www.microsoft.com/', onClick: InfoBarButton_Click }) : null)
const severityNames = ['Informational', 'Success', 'Warning', 'Error']
const SeverityComboBox_SelectionChanged = (sender: { SelectedIndex: number }) => { if (names.TestInfoBar1) names.TestInfoBar1.Severity = severityNames[sender.SelectedIndex] ?? 'Informational' }
const MessageComboBox_SelectionChanged = (sender: { SelectedIndex: number }) => { example2MessageLength.value = sender.SelectedIndex }
const ActionButtonComboBox_SelectionChanged = (sender: { SelectedIndex: number }) => { example2ActionButton.value = sender.SelectedIndex; actionInvocations.value = 0 }
function InfoBarButton_Click() { actionInvocations.value += 1 }
const booleanLabel = (value: unknown) => t(value ? 'sample.infobar.state-true' : 'sample.infobar.state-false')
const Example1Output = computed(() => t('sample.infobar.output-severity', { open: booleanLabel(names.TestInfoBar1?.IsOpen), severity: t(`sample.infobar.severity-${String(names.TestInfoBar1?.Severity ?? 'Informational').toLowerCase()}`) }))
const Example2Output = computed(() => t('sample.infobar.output-message', { open: booleanLabel(names.TestInfoBar2?.IsOpen), length: example2MessageLength.value === 0 ? ShortLabel.value : LongLabel.value, action: [NoneLabel.value, ButtonLabel.value, HyperlinkLabel.value][example2ActionButton.value], count: actionInvocations.value }))
const Example3Output = computed(() => t('sample.infobar.output-display', { open: booleanLabel(names.TestInfoBar3?.IsOpen), icon: booleanLabel(names.TestInfoBar3?.IsIconVisible), closable: booleanLabel(names.TestInfoBar3?.IsClosable) }))
const escapeXaml = (value: unknown) => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const xamlBoolean = (value: unknown) => value ? 'True' : 'False'
const Example1Xaml = computed(() => `<InfoBar
    IsOpen="${xamlBoolean(names.TestInfoBar1?.IsOpen)}"
    Severity="${names.TestInfoBar1?.Severity ?? 'Informational'}"
    Title="${escapeXaml(InfoBarTitle.value)}"
    Message="${escapeXaml(EssentialMessage.value)}" />`)
const Example2Xaml = computed(() => {
  const action = example2ActionButton.value === 1 ? `    <InfoBar.ActionButton>
        <Button Content="${escapeXaml(ActionLabel.value)}" Click="InfoBarButton_Click" />
    </InfoBar.ActionButton>` : example2ActionButton.value === 2 ? `    <InfoBar.ActionButton>
        <HyperlinkButton Content="${escapeXaml(InformationalLinkLabel.value)}" NavigateUri="http://www.microsoft.com/" />
    </InfoBar.ActionButton>` : ''
  return `<InfoBar
    IsOpen="${xamlBoolean(names.TestInfoBar2?.IsOpen)}"
    Title="${escapeXaml(InfoBarTitle.value)}"
    Message="${escapeXaml(t(example2MessageLength.value === 0 ? 'sample.infobar.short-message' : 'sample.infobar.long-message-placeholder'))}">
${action}
</InfoBar>`
})
const Example3Xaml = computed(() => `<InfoBar
    IsOpen="${xamlBoolean(names.TestInfoBar3?.IsOpen)}"
    IsIconVisible="${xamlBoolean(names.TestInfoBar3?.IsIconVisible)}"
    IsClosable="${xamlBoolean(names.TestInfoBar3?.IsClosable)}"
    Title="${escapeXaml(InfoBarTitle.value)}"
    Message="${escapeXaml(EssentialMessage.value)}" />`)
</script>

<style scoped>
.page-heading { position: relative; }
.page-description { color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.infobar-example :deep(.example-display) { min-width: 0; overflow: hidden; }
.infobar-output-text { min-width: 0; overflow-wrap: anywhere; }
</style>
