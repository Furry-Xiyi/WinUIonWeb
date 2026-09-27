<template>
  <Page>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" TextWrapping="Wrap" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button class="header-action" Click="toggleTheme" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
              <FontIcon Glyph="&#xE793;" FontSize="16" />
            </Button>
            <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}">
              <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
            </ToggleButton>
          </StackPanel>
        </StackPanel>

        <StackPanel class="gallery-page-content">
          <ControlExample x:Name="Example1" SampleDefinition="MenuFlyout\AppbarbuttonMenuflyout.txt" HeaderText="{x:Bind Labels.AppBarHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind AppBarXaml}" CSharp="{x:Bind SortCSharp}">
            <ControlExample.Example>
              <StackPanel x:Name="Control1" class="menu-example-row" Orientation="Horizontal">
                <AppBarButton AutomationProperties.Name="{x:Bind Labels.Sort, Mode=OneWay}" Icon="Sort" IsCompact="True" ToolTipService.ToolTip="{x:Bind Labels.Sort, Mode=OneWay}">
                  <Button.Flyout>
                    <MenuFlyout>
                      <MenuFlyoutItem Click="MenuFlyoutItem_Click" Tag="rating" Text="{x:Bind Labels.ByRating, Mode=OneWay}" />
                      <MenuFlyoutItem Click="MenuFlyoutItem_Click" Tag="match" Text="{x:Bind Labels.ByMatch, Mode=OneWay}" />
                      <MenuFlyoutItem Click="MenuFlyoutItem_Click" Tag="distance" Text="{x:Bind Labels.ByDistance, Mode=OneWay}" />
                    </MenuFlyout>
                  </Button.Flyout>
                </AppBarButton>
                <TextBlock x:Name="Control1Output" class="menu-output" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind SortOutput, Mode=OneWay}" TextWrapping="Wrap" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example2" SampleDefinition="MenuFlyout\MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt" HeaderText="{x:Bind Labels.ToggleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind ToggleXaml}">
            <ControlExample.Example>
              <Button x:Name="Control2" Content="{x:Bind Labels.Options, Mode=OneWay}">
                <Button.Flyout>
                  <MenuFlyout>
                    <MenuFlyoutItem Text="{x:Bind Labels.Reset, Mode=OneWay}" />
                    <MenuFlyoutSeparator />
                    <ToggleMenuFlyoutItem x:Name="RepeatToggleMenuFlyoutItem" IsChecked="True" Text="{x:Bind Labels.Repeat, Mode=OneWay}" />
                    <ToggleMenuFlyoutItem x:Name="ShuffleToggleMenuFlyoutItem" IsChecked="True" Text="{x:Bind Labels.Shuffle, Mode=OneWay}" />
                  </MenuFlyout>
                </Button.Flyout>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="RepeatToggle" Value="{x:Bind RepeatToggleMenuFlyoutItem.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="ShuffleToggle" Value="{x:Bind ShuffleToggleMenuFlyoutItem.IsChecked, Mode=OneWay}" />
            </ControlExample.Substitutions>
          </ControlExample>

          <ControlExample x:Name="Example3" SampleDefinition="MenuFlyout\MenuflyoutCascadingMenus.txt" HeaderText="{x:Bind Labels.CascadingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind CascadingXaml}">
            <ControlExample.Example>
              <Button x:Name="Control3" Content="{x:Bind Labels.FileOptions, Mode=OneWay}">
                <Button.Flyout>
                  <MenuFlyout>
                    <MenuFlyoutItem Text="{x:Bind Labels.Open, Mode=OneWay}" />
                    <MenuFlyoutSubItem Text="{x:Bind Labels.SendTo, Mode=OneWay}">
                      <MenuFlyoutItem Text="{x:Bind Labels.Bluetooth, Mode=OneWay}" />
                      <MenuFlyoutItem Text="{x:Bind Labels.DesktopShortcut, Mode=OneWay}" />
                      <MenuFlyoutSubItem Text="{x:Bind Labels.CompressedFile, Mode=OneWay}">
                        <MenuFlyoutItem Text="{x:Bind Labels.CompressEmail, Mode=OneWay}" />
                        <MenuFlyoutItem Text="{x:Bind Labels.Compress7z, Mode=OneWay}" />
                        <MenuFlyoutItem Text="{x:Bind Labels.CompressZip, Mode=OneWay}" />
                      </MenuFlyoutSubItem>
                    </MenuFlyoutSubItem>
                  </MenuFlyout>
                </Button.Flyout>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example3b" SampleDefinition="MenuFlyout\MenuflyoutSplitmenuflyoutitems.txt" HeaderText="{x:Bind Labels.SplitHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SplitXaml}" CSharp="{x:Bind SplitCSharp}">
            <ControlExample.Example>
              <StackPanel x:Name="Control3b" class="menu-example-row" Orientation="Horizontal">
                <Button Content="{x:Bind Labels.FileOptions, Mode=OneWay}">
                  <Button.Flyout>
                    <MenuFlyout>
                      <SplitMenuFlyoutItem x:Name="SaveSplitItem" Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.Save, Mode=OneWay}">
                        <SplitMenuFlyoutItem.Icon>
                          <FontIcon Glyph="&#xE74E;" />
                        </SplitMenuFlyoutItem.Icon>
                        <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.SaveDocx, Mode=OneWay}" />
                        <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.SavePdf, Mode=OneWay}" />
                        <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.SaveTxt, Mode=OneWay}" />
                      </SplitMenuFlyoutItem>
                      <SplitMenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Icon="Share" Text="{x:Bind Labels.Share, Mode=OneWay}">
                        <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.ShareEmail, Mode=OneWay}" />
                        <MenuFlyoutItem Click="SplitMenuFlyoutItem_Click" Text="{x:Bind Labels.ShareLink, Mode=OneWay}" />
                      </SplitMenuFlyoutItem>
                    </MenuFlyout>
                  </Button.Flyout>
                </Button>
                <TextBlock x:Name="Control3bOutput" class="menu-output" Style="{StaticResource OutputTextBlockStyle}" Text="{x:Bind SplitOutput, Mode=OneWay}" TextWrapping="Wrap" />
              </StackPanel>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example4" SampleDefinition="MenuFlyout\MenuflyoutIcons.txt" HeaderText="{x:Bind Labels.IconsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind IconsXaml}">
            <ControlExample.Example>
              <Button x:Name="Control4" Content="{x:Bind Labels.EditOptions, Mode=OneWay}">
                <Button.Flyout>
                  <MenuFlyout>
                    <MenuFlyoutItem Text="{x:Bind Labels.Share, Mode=OneWay}">
                      <MenuFlyoutItem.Icon>
                        <FontIcon Glyph="&#xE72D;" />
                      </MenuFlyoutItem.Icon>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem Icon="Copy" Text="{x:Bind Labels.Copy, Mode=OneWay}" />
                    <MenuFlyoutItem Icon="Delete" Text="{x:Bind Labels.Delete, Mode=OneWay}" />
                    <MenuFlyoutSeparator />
                    <MenuFlyoutItem Text="{x:Bind Labels.Rename, Mode=OneWay}" />
                    <MenuFlyoutItem Text="{x:Bind Labels.Select, Mode=OneWay}" />
                  </MenuFlyout>
                </Button.Flyout>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example5" FontFamily="Segoe UI" SampleDefinition="MenuFlyout\MenuflyoutIconsKeyboardAccelerators.txt" Loaded="Example5_Loaded" HeaderText="{x:Bind Labels.KeyboardHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind KeyboardXaml}">
            <ControlExample.Example>
              <Button x:Name="Control5" Content="{x:Bind Labels.EditOptions, Mode=OneWay}">
                <Button.Flyout>
                  <MenuFlyout>
                    <MenuFlyoutItem Text="{x:Bind Labels.Share, Mode=OneWay}">
                      <MenuFlyoutItem.Icon>
                        <FontIcon Glyph="&#xE72D;" />
                      </MenuFlyoutItem.Icon>
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="S" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem FontFamily="Consolas" Icon="Copy" Text="{x:Bind Labels.Copy, Mode=OneWay}">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="C" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem FontFamily="Segoe UI" Icon="Delete" Text="{x:Bind Labels.Delete, Mode=OneWay}">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="Delete" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutSeparator />
                    <MenuFlyoutItem Text="{x:Bind Labels.Rename, Mode=OneWay}" />
                    <MenuFlyoutItem Text="{x:Bind Labels.Select, Mode=OneWay}" />
                  </MenuFlyout>
                </Button.Flyout>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>

          <ControlExample x:Name="Example6" SampleDefinition="MenuFlyout\MenuflyoutRadiomenuflyoutitems.txt" HeaderText="{x:Bind Labels.RadioHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind RadioXaml}">
            <ControlExample.Example>
              <Button x:Name="Control6" Content="{x:Bind Labels.Options, Mode=OneWay}">
                <Button.Flyout>
                  <MenuFlyout>
                    <RadioMenuFlyoutItem GroupName="OrientationGroup" Text="{x:Bind Labels.Landscape, Mode=OneWay}" />
                    <RadioMenuFlyoutItem GroupName="OrientationGroup" IsChecked="True" Text="{x:Bind Labels.Portrait, Mode=OneWay}" />
                    <MenuFlyoutSeparator />
                    <RadioMenuFlyoutItem GroupName="SizeGroup" Text="{x:Bind Labels.SmallIcons, Mode=OneWay}" />
                    <RadioMenuFlyoutItem GroupName="SizeGroup" IsChecked="True" Text="{x:Bind Labels.MediumIcons, Mode=OneWay}" />
                    <RadioMenuFlyoutItem GroupName="SizeGroup" Text="{x:Bind Labels.LargeIcons, Mode=OneWay}" />
                  </MenuFlyout>
                </Button.Flyout>
              </Button>
            </ControlExample.Example>
            <ControlExample.Output />
            <ControlExample.Options />
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive, shallowRef } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import FontIcon from '../../components/FontIcon.vue';
import MenuFlyout from '../../components/MenuFlyout.vue';
import { KeyboardAccelerator, MenuFlyoutItem, MenuFlyoutSeparator, MenuFlyoutSubItem, RadioMenuFlyoutItem, SplitMenuFlyoutItem, ToggleMenuFlyoutItem } from '../../components/MenuFlyoutItems';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import appBarSample from '../samples/MenuFlyout/AppbarbuttonMenuflyout.txt?raw';
import toggleSample from '../samples/MenuFlyout/MenuflyoutTogglemenuflyoutitemsMenuflyoutseparator.txt?raw';
import cascadingSample from '../samples/MenuFlyout/MenuflyoutCascadingMenus.txt?raw';
import splitSample from '../samples/MenuFlyout/MenuflyoutSplitmenuflyoutitems.txt?raw';
import iconsSample from '../samples/MenuFlyout/MenuflyoutIcons.txt?raw';
import keyboardSample from '../samples/MenuFlyout/MenuflyoutIconsKeyboardAccelerators.txt?raw';
import radioSample from '../samples/MenuFlyout/MenuflyoutRadiomenuflyoutitems.txt?raw';
import officialCodeBehind from '../samples/MenuFlyout/MenuFlyoutPage.xaml.cs?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'menuflyout');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);

const Labels = computed(() => ({
  Title: t('text.menuflyout'),
  Description: t('text.a-menuflyout-displays-a-lightweight-menu-of-comm'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  AppBarHeader: t('text.a-menuflyout-attached-to-an-appbarbutton'),
  ToggleHeader: t('sample.menuflyout.toggle-items'),
  CascadingHeader: t('sample.menuflyout.cascading'),
  SplitHeader: t('sample.menuflyout.split-items'),
  IconsHeader: t('sample.menuflyout.icons'),
  KeyboardHeader: t('sample.menuflyout.keyboard'),
  RadioHeader: t('sample.menuflyout.radio'),
  Sort: t('sample.menuflyout.sort'),
  ByRating: t('sample.menuflyout.by-rating'),
  ByMatch: t('sample.menuflyout.by-match'),
  ByDistance: t('sample.menuflyout.by-distance'),
  Options: t('sample.menuflyout.options'),
  Reset: t('sample.menuflyout.reset'),
  Repeat: t('sample.menuflyout.repeat'),
  Shuffle: t('sample.menuflyout.shuffle'),
  FileOptions: t('sample.menuflyout.file-options'),
  Open: t('sample.menuflyout.open'),
  SendTo: t('sample.menuflyout.send-to'),
  Bluetooth: t('sample.menuflyout.bluetooth'),
  DesktopShortcut: t('sample.menuflyout.desktop-shortcut'),
  CompressedFile: t('sample.menuflyout.compressed-file'),
  CompressEmail: t('sample.menuflyout.compress-email'),
  Compress7z: t('sample.menuflyout.compress-7z'),
  CompressZip: t('sample.menuflyout.compress-zip'),
  Save: t('sample.menuflyout.save'),
  SaveDocx: t('sample.menuflyout.save-docx'),
  SavePdf: t('sample.menuflyout.save-pdf'),
  SaveTxt: t('sample.menuflyout.save-txt'),
  Share: t('sample.menuflyout.share'),
  ShareEmail: t('sample.menuflyout.share-email'),
  ShareLink: t('sample.menuflyout.share-link'),
  EditOptions: t('sample.menuflyout.edit-options'),
  Copy: t('sample.menuflyout.copy'),
  Delete: t('sample.menuflyout.delete'),
  Rename: t('sample.menuflyout.rename'),
  Select: t('sample.menuflyout.select'),
  Landscape: t('sample.menuflyout.landscape'),
  Portrait: t('sample.menuflyout.portrait'),
  SmallIcons: t('sample.menuflyout.small-icons'),
  MediumIcons: t('sample.menuflyout.medium-icons'),
  LargeIcons: t('sample.menuflyout.large-icons')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');

const SelectedSort = ref('');
const SelectedSplitItem = shallowRef(null);
const sortResourceKeys = {
  rating: 'sample.menuflyout.rating',
  match: 'sample.menuflyout.match',
  distance: 'sample.menuflyout.distance'
};
const SortOutput = computed(() => SelectedSort.value
  ? t('sample.menuflyout.sort-output', { value: t(sortResourceKeys[SelectedSort.value]) }) : '');
const SplitOutput = computed(() => SelectedSplitItem.value
  ? t('sample.menuflyout.clicked-output', { value: SelectedSplitItem.value.Text }) : '');
const MenuFlyoutItem_Click = (sender) => {
  if (Object.prototype.hasOwnProperty.call(sortResourceKeys, sender?.Tag)) SelectedSort.value = sender.Tag;
};
const SplitMenuFlyoutItem_Click = (sender) => {
  if (sender?.Text) SelectedSplitItem.value = sender;
};
const Example5_Loaded = () => {};

const sampleSection = (source, section) => {
  const content = source.split(/^--- /m).find(value => value.startsWith(`${section}\n`) || value.startsWith(`${section}\r\n`));
  return content?.slice(section.length).trim() ?? '';
};
const officialHandler = (name) => {
  const start = officialCodeBehind.indexOf(`    private void ${name}(`);
  if (start < 0) return '';
  const bodyStart = officialCodeBehind.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < officialCodeBehind.length; index += 1) {
    if (officialCodeBehind[index] === '{') depth += 1;
    else if (officialCodeBehind[index] === '}') {
      depth -= 1;
      if (depth === 0) return officialCodeBehind.slice(start, index + 1).replace(/^ {4}/gm, '').trim();
    }
  }
  return '';
};
const AppBarXaml = sampleSection(appBarSample, 'xaml');
const ToggleXaml = sampleSection(toggleSample, 'xaml');
const CascadingXaml = sampleSection(cascadingSample, 'xaml');
const SplitXaml = sampleSection(splitSample, 'xaml');
const IconsXaml = sampleSection(iconsSample, 'xaml');
const KeyboardXaml = sampleSection(keyboardSample, 'xaml');
const RadioXaml = sampleSection(radioSample, 'xaml');
const SortCSharp = officialHandler('MenuFlyoutItem_Click');
const SplitCSharp = officialHandler('SplitMenuFlyoutItem_Click');

provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  SortOutput, SplitOutput, MenuFlyoutItem_Click, SplitMenuFlyoutItem_Click, Example5_Loaded,
  AppBarXaml, ToggleXaml, CascadingXaml, SplitXaml, IconsXaml, KeyboardXaml, RadioXaml, SortCSharp, SplitCSharp
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { color: var(--text-secondary); margin: 0 0 16px; }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content, .menu-example-row { min-width: 0; max-width: 100%; }
.menu-output { min-width: 0; overflow-wrap: anywhere; flex: 1 1 auto; }
</style>
