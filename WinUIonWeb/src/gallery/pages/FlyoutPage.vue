<template>
  <Page>
    <Page.Resources>
      <Flyout x:Key="SharedFlyout">
        <StackPanel>
          <TextBlock Text="{x:Bind Strings.SharedFlyout, Mode=OneWay}" />
        </StackPanel>
      </Flyout>
    </Page.Resources>
  <ScrollViewer
    class="gallery-page-scroll"
    VerticalScrollBarVisibility="Auto"
    VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock
          class="page-header"
          Text="{x:Bind Strings.Title, Mode=OneWay}" />
        <TextBlock
          class="page-description"
          Text="{x:Bind Strings.Description, Mode=OneWay}"
          TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Strings.ChangeTheme, Mode=OneWay}">
            <TextBlock class="icon" Text="&#xE793;" />
          </Button>
          <ToggleButton
            IsChecked="{x:Bind isFavoriteState, Mode=OneWay}"
            class="header-action"
            ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}"
            Click="toggleFavorite">
            <TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" />
          </ToggleButton>
        </div>
      </div>

      <StackPanel class="gallery-page-content">
        <ControlExample
          HeaderText="{x:Bind Strings.ExampleHeader, Mode=OneWay}"
          SampleDefinition="Flyout\ButtonFlyout.txt"
          Theme="{x:Bind pageTheme, Mode=OneWay}"
          Xaml="{x:Bind buttonFlyoutCode, Mode=OneWay}"
          CSharp="{x:Bind buttonFlyoutCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <Button
              x:Name="Control1"
              Content="{x:Bind Strings.EmptyCart, Mode=OneWay}">
              <Button.Flyout>
                <Flyout>
                  <StackPanel>
                    <TextBlock
                      Margin="0,0,0,12"
                      Style="{ThemeResource BaseTextBlockStyle}"
                      Text="{x:Bind Strings.RemoveAll, Mode=OneWay}"
                      TextWrapping="WrapWholeWords" />
                    <Button
                      Click="DeleteConfirmation_Click"
                      Content="{x:Bind Strings.ConfirmEmpty, Mode=OneWay}" />
                  </StackPanel>
                </Flyout>
              </Button.Flyout>
            </Button>
          </ControlExample.Example>
          <ControlExample.Output />
          <ControlExample.Options />
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import ControlExample from '../../components/ControlExample.vue'
import Flyout from '../../components/Flyout.vue'
import Page from '../../components/Page.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { createPageState } from '../../utils/pageState'
import { useI18n } from '../../components/i18n/index'
import { xamlNameScopeKey } from '../../components/xamlRuntime'
import buttonFlyoutSample from '../samples/Flyout/ButtonFlyout.txt?raw'
import buttonFlyoutCSharpSample from '../samples/Flyout/FlyoutPage.xaml.cs?raw'

const { t } = useI18n()
const Strings = computed(() => ({
  Title: t('text.flyout'),
  Description: t('text.a-flyout-displays-lightweight-ui-that-is-either'),
  ExampleHeader: t('text.a-button-with-a-flyout'),
  EmptyCart: t('sample.flyout.empty-cart'),
  RemoveAll: t('sample.flyout.remove-all'),
  ConfirmEmpty: t('sample.flyout.confirm-empty'),
  SharedFlyout: t('sample.flyout.shared'),
  ChangeTheme: t('sample.navigationview.change-theme')
}))
const controls = shallowReactive({})
provide(xamlNameScopeKey, controls)

const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'flyout')
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value)
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'sample.navigationview.remove-favorite' : 'sample.navigationview.add-favorite'))

const DeleteConfirmation_Click = () => {
  controls.Control1?.Flyout?.Hide()
}

const buttonFlyoutCode = buttonFlyoutSample.split('--- xaml')[1].trim()
const buttonFlyoutCSharp = buttonFlyoutCSharpSample
</script>

<style scoped>
.page-heading {
  position: relative;
}

.page-header {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 600;
}

.page-description {
  margin: 0 72px 16px 0;
  color: var(--text-secondary);
  line-height: 20px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
}

.icon {
  font-size: 16px;
}
</style>
