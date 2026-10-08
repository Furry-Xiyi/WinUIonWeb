<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="36" Margin="0,0,80,8" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" Margin="0,0,0,16" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" ToolTipService.ToolTip="{x:Bind themeButtonName, Mode=OneWay}" Click="toggleTheme"><FontIcon Glyph="&#xE793;" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="16" /></Button>
            <ToggleButton class="header-action" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><FontIcon Glyph="{x:Bind favoriteGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="InfoBadge\InfobadgeEmbeddedNavigationview.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind embeddedHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind embeddedXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Grid HorizontalAlignment="Stretch">
                <Grid.RowDefinitions><RowDefinition Height="Auto" /></Grid.RowDefinitions>
                <NavigationView x:Name="nvSample1" Height="300" PaneDisplayMode="{x:Bind navigationPaneDisplayMode, Mode=OneWay}" IsPaneOpen="{x:Bind navigationIsPaneOpen, Mode=OneWay}" HorizontalAlignment="Stretch">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind homeText, Mode=OneWay}" Icon="Home" />
                    <NavigationViewItem Content="{x:Bind accountText, Mode=OneWay}" Icon="Contact" />
                    <NavigationViewItem x:Name="InboxPage" AutomationProperties.Name="{x:Bind inboxAutomationName, Mode=OneWay}" Content="{x:Bind inboxText, Mode=OneWay}" Icon="Mail">
                      <NavigationViewItem.InfoBadge><InfoBadge x:Name="infoBadge1" Opacity="{x:Bind infoBadgeOpacity, Mode=OneWay}" Value="5" /></NavigationViewItem.InfoBadge>
                    </NavigationViewItem>
                  </NavigationView.MenuItems>
                  <Frame x:Name="contentFrame" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Width="200" Text="{x:Bind embeddedOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Width="160">
                <ToggleSwitch x:Name="ToggleInfoBadgeOpacity" Header="{x:Bind opacityLabel, Mode=OneWay}" IsOn="True" Toggled="ToggleInfoBadgeOpacity_Toggled" />
                <ComboBox x:Name="NavigationViewDisplayMode" Header="{x:Bind displayModeLabel, Mode=OneWay}" SelectedValue="LeftExpanded" SelectedValuePath="Tag" SelectionChanged="NavigationViewDisplayMode_SelectionChanged">
                  <ComboBoxItem Content="{x:Bind leftExpandedText, Mode=OneWay}" Tag="LeftExpanded" /><ComboBoxItem Content="{x:Bind leftCompactText, Mode=OneWay}" Tag="LeftCompact" /><ComboBoxItem Content="{x:Bind topText, Mode=OneWay}" Tag="Top" />
                </ComboBox>
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>

          <ControlExample x:Name="Example2" SampleDefinition="InfoBadge\DifferentInfobadgeStyles.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind stylesHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind stylesXaml, Mode=OneWay}">
            <ControlExample.Example>
              <StackPanel HorizontalAlignment="Center" Spacing="20" Orientation="Horizontal">
                <InfoBadge x:Name="infoBadge2" HorizontalAlignment="Right" Style="{x:Bind iconInfoBadgeStyle, Mode=OneWay}" />
                <InfoBadge x:Name="infoBadge3" HorizontalAlignment="Right" Style="{x:Bind valueInfoBadgeStyle, Mode=OneWay}" Value="10" />
                <InfoBadge x:Name="infoBadge4" VerticalAlignment="Center" Style="{x:Bind dotInfoBadgeStyle, Mode=OneWay}" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Width="200" Text="{x:Bind stylesOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Width="160">
                <ComboBox x:Name="InfoBadgeStyleComboBox" Header="{x:Bind stylesLabel, Mode=OneWay}" SelectedValue="Attention" SelectedValuePath="Tag" SelectionChanged="InfoBadgeStyleComboBox_SelectionChanged">
                  <ComboBoxItem Content="{x:Bind attentionText, Mode=OneWay}" Tag="Attention" /><ComboBoxItem Content="{x:Bind informationalText, Mode=OneWay}" Tag="Informational" /><ComboBoxItem Content="{x:Bind successText, Mode=OneWay}" Tag="Success" /><ComboBoxItem Content="{x:Bind criticalText, Mode=OneWay}" Tag="Critical" />
                </ComboBox>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions><ControlExampleSubstitution Key="Style" Value="{x:Bind infoBadgeStyle, Mode=OneWay}" /></ControlExample.Substitutions>
          </ControlExample>

          <ControlExample x:Name="Example3" SampleDefinition="InfoBadge\PlacingInfobadgeInsideAnother.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind insideHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind insideXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Button x:Name="Example3Button" Width="200" Height="60" Padding="0" HorizontalAlignment="Center" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch" ToolTipService.ToolTip="{x:Bind refreshRequired, Mode=OneWay}" Click="Example3Button_Click">
                <Grid Width="Auto" Height="Auto" HorizontalAlignment="Stretch" VerticalAlignment="Stretch">
                  <SymbolIcon HorizontalAlignment="Center" Symbol="Sync" />
                  <InfoBadge Background="#C42B1C" HorizontalAlignment="Right" VerticalAlignment="Top">
                    <InfoBadge.IconSource><FontIconSource FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xF13C;" /></InfoBadge.IconSource>
                  </InfoBadge>
                </Grid>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock Width="200" Text="{x:Bind insideOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample x:Name="Example4" SampleDefinition="InfoBadge\InfobadgeDynamicValue.txt" HorizontalContentAlignment="Stretch" HeaderText="{x:Bind dynamicHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind dynamicXaml, Mode=OneWay}" CSharp="{x:Bind dynamicCSharp, Mode=OneWay}">
            <ControlExample.Example><InfoBadge x:Name="DynamicInfoBadge" HorizontalAlignment="Center" Value="{x:Bind dynamicValue, Mode=TwoWay}" /></ControlExample.Example>
            <ControlExample.Output><TextBlock Width="200" Text="{x:Bind dynamicOutput, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
            <ControlExample.Options>
              <StackPanel Width="160">
                <NumberBox x:Name="ValueNumberBox" Header="{x:Bind valueLabel, Mode=OneWay}" Minimum="-1" SpinButtonPlacementMode="Inline" ValueChanged="ValueNumberBox_ValueChanged" Value="1" />
              </StackPanel>
            </ControlExample.Options>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue'
import Button from '../../components/Button.vue'
import ComboBox from '../../components/ComboBox.vue'
import { ComboBoxItem } from '../../components/inlineControlProperties'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import Frame from '../../components/Frame.vue'
import FontIcon from '../../components/FontIcon.vue'
import Grid from '../../components/Grid.vue'
import RowDefinition from '../../components/RowDefinition.vue'
import { FontIconSource } from '../../components/IconSource'
import InfoBadge from '../../components/InfoBadge.vue'
import NavigationView from '../../components/NavigationView.vue'
import { NavigationViewItem } from '../../components/NavigationViewProperties'
import NumberBox from '../../components/NumberBox.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIcon from '../../components/SymbolIcon.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import ToggleSwitch from '../../components/ToggleSwitch.vue'
import { useI18n } from '../../components/i18n/index'
import { xamlScopeKey } from '../../components/xamlRuntime'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject<{ value: string }>('currentPage')
const pageKey = computed(() => currentPage?.value || 'infobadge')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const pageTitle = computed(() => t('text.infobadge'))
const pageDescription = computed(() => t('sample.infobadge.description'))
const themeButtonName = computed(() => t('gallery.toggle-theme'))
const favoriteButtonName = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const embeddedHeader = computed(() => t('sample.infobadge.embedded-navigationview'))
const opacityLabel = computed(() => t('sample.infobadge.opacity'))
const displayModeLabel = computed(() => t('sample.infobadge.display-mode'))
const stylesHeader = computed(() => t('sample.infobadge.different-styles'))
const stylesLabel = computed(() => t('sample.infobadge.styles'))
const insideHeader = computed(() => t('sample.infobadge.inside-another-control'))
const dynamicHeader = computed(() => t('sample.infobadge.dynamic-value'))
const valueLabel = computed(() => t('sample.infobadge.value'))
const refreshRequired = computed(() => t('sample.infobadge.refresh-required'))
const homeText = computed(() => t('text.home'))
const accountText = computed(() => t('text.account'))
const inboxText = computed(() => t('sample.infobadge.inbox'))
const inboxAutomationName = computed(() => t('sample.infobadge.inbox-notifications', { value: 5 }))
const leftExpandedText = computed(() => t('sample.infobadge.left-expanded'))
const leftCompactText = computed(() => t('sample.infobadge.left-compact'))
const topText = computed(() => t('sample.infobadge.top'))
const attentionText = computed(() => t('sample.infobadge.attention'))
const informationalText = computed(() => t('sample.infobadge.informational'))
const successText = computed(() => t('sample.infobadge.success'))
const criticalText = computed(() => t('sample.infobadge.critical'))
const infoBadgeOpacityOn = ref(true)
const infoBadgeOpacity = computed(() => infoBadgeOpacityOn.value ? 1 : 0)
const navigationDisplayMode = ref('LeftExpanded')
const navigationPaneDisplayMode = computed(() => navigationDisplayMode.value === 'LeftCompact' ? 'LeftCompact' : navigationDisplayMode.value === 'Top' ? 'Top' : 'Left')
const navigationIsPaneOpen = computed(() => navigationDisplayMode.value !== 'LeftCompact')
const infoBadgeStyle = ref('Attention')
const iconInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}IconInfoBadgeStyle}`)
const valueInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}ValueInfoBadgeStyle}`)
const dotInfoBadgeStyle = computed(() => `{StaticResource ${infoBadgeStyle.value}DotInfoBadgeStyle}`)
const dynamicValue = ref(1)
const buttonClickCount = ref(0)
const embeddedOutput = computed(() => t('sample.infobadge.embedded-output', { opacity: infoBadgeOpacityOn.value ? '100%' : '0%', mode: t(`sample.infobadge.${navigationDisplayMode.value === 'LeftExpanded' ? 'left-expanded' : navigationDisplayMode.value === 'LeftCompact' ? 'left-compact' : 'top'}`) }))
const stylesOutput = computed(() => t('sample.infobadge.styles-output', { style: t(`sample.infobadge.${infoBadgeStyle.value.toLowerCase()}`) }))
const insideOutput = computed(() => t('sample.infobadge.inside-output', { count: buttonClickCount.value }))
const dynamicOutput = computed(() => dynamicValue.value < 0 ? t('sample.infobadge.dynamic-dot-output') : t('sample.infobadge.dynamic-output', { value: dynamicValue.value }))

const SelectionValue = (args: any) => { const item = args?.AddedItems?.[0]; return String(item?.Tag ?? item ?? '') }
const NavigationViewDisplayMode_SelectionChanged = (_sender: any, args: any) => { const next = SelectionValue(args); if (next) navigationDisplayMode.value = next }
const ToggleInfoBadgeOpacity_Toggled = (args: any) => { infoBadgeOpacityOn.value = args?.IsOn !== undefined ? Boolean(args.IsOn) : !infoBadgeOpacityOn.value }
const InfoBadgeStyleComboBox_SelectionChanged = (_sender: any, args: any) => { const next = SelectionValue(args); if (next) infoBadgeStyle.value = next }
const ValueNumberBox_ValueChanged = (sender: any, args?: any) => { const next = Number((args ?? sender)?.NewValue); if (Number.isFinite(next) && next >= -1) dynamicValue.value = Math.trunc(next) }
const Example3Button_Click = () => { buttonClickCount.value += 1 }

const embeddedXaml = computed(() => `<NavigationViewItem x:Name="InboxPage" Content="${inboxText.value}" Icon="Mail" AutomationProperties.Name="${inboxAutomationName.value}">\n    <NavigationViewItem.InfoBadge>\n        <InfoBadge x:Name="infoBadge1" Value="5" Opacity="{x:Bind InfoBadgeOpacity, Mode=OneWay}" />\n    </NavigationViewItem.InfoBadge>\n</NavigationViewItem>`)
const stylesXaml = computed(() => `<StackPanel Orientation="Horizontal" Spacing="20" HorizontalAlignment="Center">\n    <InfoBadge x:Name="infoBadge2" Style="{StaticResource ${infoBadgeStyle.value}IconInfoBadgeStyle}" HorizontalAlignment="Right" />\n    <InfoBadge x:Name="infoBadge3" Style="{StaticResource ${infoBadgeStyle.value}ValueInfoBadgeStyle}" HorizontalAlignment="Right" Value="10" />\n    <InfoBadge x:Name="infoBadge4" Style="{StaticResource ${infoBadgeStyle.value}DotInfoBadgeStyle}" VerticalAlignment="Center" />\n</StackPanel>`)
const insideXaml = computed(() => `<Button Padding="0" Width="200" Height="60" ToolTipService.ToolTip="${refreshRequired.value}" HorizontalAlignment="Center" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch">\n  <Grid HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Width="Auto" Height="Auto">\n    <SymbolIcon Symbol="Sync" HorizontalAlignment="Center" />\n    <InfoBadge Background="#C42B1C" HorizontalAlignment="Right" VerticalAlignment="Top">\n      <InfoBadge.IconSource><FontIconSource FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xF13C;" /></InfoBadge.IconSource>\n    </InfoBadge>\n  </Grid>\n</Button>`)
const dynamicXaml = computed(() => `<InfoBadge Value="{Binding ElementName=ValueNumberBox, Path=Value, Mode=TwoWay}" />\n<NumberBox x:Name="ValueNumberBox" Header="${valueLabel.value}" Value="1" Minimum="-1"\n    SpinButtonPlacementMode="Inline" ValueChanged="ValueNumberBox_ValueChanged" />`)
const dynamicCSharp = "private void ValueNumberBox_ValueChanged(Microsoft.UI.Xaml.Controls.NumberBox sender, Microsoft.UI.Xaml.Controls.NumberBoxValueChangedEventArgs args)\n{\n    if ((int)args.NewValue >= -1)\n    {\n        DynamicInfoBadge.Value = (int)args.NewValue;\n    }\n}"

provide(xamlScopeKey, { homeText, accountText, inboxText, inboxAutomationName, leftExpandedText, leftCompactText, topText, attentionText, informationalText, successText, criticalText, pageTitle, pageDescription, themeButtonName, favoriteButtonName, favoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite, embeddedHeader, opacityLabel, displayModeLabel, stylesHeader, stylesLabel, insideHeader, dynamicHeader, valueLabel, refreshRequired, infoBadgeOpacity, navigationPaneDisplayMode, navigationIsPaneOpen, infoBadgeStyle, iconInfoBadgeStyle, valueInfoBadgeStyle, dotInfoBadgeStyle, dynamicValue, embeddedOutput, stylesOutput, insideOutput, dynamicOutput, embeddedXaml, stylesXaml, insideXaml, dynamicXaml, dynamicCSharp, NavigationViewDisplayMode_SelectionChanged, ToggleInfoBadgeOpacity_Toggled, InfoBadgeStyleComboBox_SelectionChanged, ValueNumberBox_ValueChanged, Example3Button_Click })
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 80px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; }
</style>
