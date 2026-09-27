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
          <ControlExample SampleDefinition="MenuBar\SimpleMenubar.txt" HeaderText="{x:Bind Labels.SimpleHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SimpleXaml}">
            <ControlExample.Example>
              <StackPanel class="menubar-example-stack">
                <TextBlock x:Name="SelectedOptionText" class="menubar-output" Text="{x:Bind Outputs.Simple, Mode=OneWay}" TextWrapping="Wrap" />
                <MenuBar x:Name="Example1">
                  <MenuBarItem x:Uid="MenuBarSample_File" Title="{x:Bind Labels.File, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="o1" x:Uid="MenuBarSample_New" Text="{x:Bind Labels.New, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o2" x:Uid="MenuBarSample_Open" Text="{x:Bind Labels.Open, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o3" x:Uid="MenuBarSample_Save" Text="{x:Bind Labels.Save, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o4" x:Uid="MenuBarSample_Exit" Text="{x:Bind Labels.Exit, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Edit" Title="{x:Bind Labels.Edit, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="o5" x:Uid="MenuBarSample_Undo" Text="{x:Bind Labels.Undo, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o6" x:Uid="MenuBarSample_Cut" Text="{x:Bind Labels.Cut, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o7" x:Uid="MenuBarSample_Copy" Text="{x:Bind Labels.Copy, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="o8" x:Uid="MenuBarSample_Paste" Text="{x:Bind Labels.Paste, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Help" Title="{x:Bind Labels.Help, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="o9" x:Uid="MenuBarSample_About" Text="{x:Bind Labels.About, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                </MenuBar>
              </StackPanel>
            </ControlExample.Example>
          </ControlExample>

          <ControlExample SampleDefinition="MenuBar\MenubarKeyboardAccelerators.txt" HeaderText="{x:Bind Labels.KeyboardHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind KeyboardXaml}">
            <ControlExample.Example>
              <StackPanel class="menubar-example-stack">
                <TextBlock x:Name="SelectedOptionText1" class="menubar-output" Text="{x:Bind Outputs.Keyboard, Mode=OneWay}" TextWrapping="Wrap" />
                <MenuBar x:Name="Example2">
                  <MenuBarItem x:Uid="MenuBarSample_File" Title="{x:Bind Labels.File, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="t2" x:Uid="MenuBarSample_New" Text="{x:Bind Labels.New, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="N" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t1" x:Uid="MenuBarSample_Open" Text="{x:Bind Labels.Open, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="O" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t3" x:Uid="MenuBarSample_Save" Text="{x:Bind Labels.Save, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="S" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t4" x:Uid="MenuBarSample_Exit" Text="{x:Bind Labels.Exit, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="E" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Edit" Title="{x:Bind Labels.Edit, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="t5" x:Uid="MenuBarSample_Undo" Text="{x:Bind Labels.Undo, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="Z" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t6" x:Uid="MenuBarSample_Cut" Text="{x:Bind Labels.Cut, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="X" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t7" x:Uid="MenuBarSample_Copy" Text="{x:Bind Labels.Copy, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="C" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                    <MenuFlyoutItem x:Name="t8" x:Uid="MenuBarSample_Paste" Text="{x:Bind Labels.Paste, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="V" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Help" Title="{x:Bind Labels.Help, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="t9" x:Uid="MenuBarSample_About" Text="{x:Bind Labels.About, Mode=OneWay}" Click="OnElementClicked">
                      <MenuFlyoutItem.KeyboardAccelerators>
                        <KeyboardAccelerator Key="I" Modifiers="Control" />
                      </MenuFlyoutItem.KeyboardAccelerators>
                    </MenuFlyoutItem>
                  </MenuBarItem>
                </MenuBar>
              </StackPanel>
            </ControlExample.Example>
          </ControlExample>

          <ControlExample SampleDefinition="MenuBar\MenubarSubmenusSeparatorsRadio.txt" HeaderText="{x:Bind Labels.SubmenusHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SubmenusXaml}">
            <ControlExample.Example>
              <StackPanel class="menubar-example-stack">
                <TextBlock x:Name="SelectedOptionText2" class="menubar-output" Text="{x:Bind Outputs.Submenus, Mode=OneWay}" TextWrapping="Wrap" />
                <MenuBar x:Name="Example3">
                  <MenuBarItem x:Uid="MenuBarSample_File" Title="{x:Bind Labels.File, Mode=OneWay}">
                    <MenuFlyoutSubItem x:Uid="MenuBarSample_New" Text="{x:Bind Labels.New, Mode=OneWay}">
                      <MenuFlyoutItem x:Name="z1" x:Uid="MenuBarSample_PlainText" Text="{x:Bind Labels.PlainText, Mode=OneWay}" Click="OnElementClicked" />
                      <MenuFlyoutItem x:Name="z2" x:Uid="MenuBarSample_RichText" Text="{x:Bind Labels.RichText, Mode=OneWay}" Click="OnElementClicked" />
                      <MenuFlyoutItem x:Name="z3" x:Uid="MenuBarSample_OtherFormats" Text="{x:Bind Labels.OtherFormats, Mode=OneWay}" Click="OnElementClicked" />
                    </MenuFlyoutSubItem>
                    <MenuFlyoutItem x:Name="z4" x:Uid="MenuBarSample_Open" Text="{x:Bind Labels.Open, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="z5" x:Uid="MenuBarSample_Save" Text="{x:Bind Labels.Save, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutSeparator />
                    <MenuFlyoutItem x:Name="z6" x:Uid="MenuBarSample_Exit" Text="{x:Bind Labels.Exit, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Edit" Title="{x:Bind Labels.Edit, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="z7" x:Uid="MenuBarSample_Undo" Text="{x:Bind Labels.Undo, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="z8" x:Uid="MenuBarSample_Cut" Text="{x:Bind Labels.Cut, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="z9" x:Uid="MenuBarSample_Copy" Text="{x:Bind Labels.Copy, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutItem x:Name="z11" x:Uid="MenuBarSample_Paste" Text="{x:Bind Labels.Paste, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_View" Title="{x:Bind Labels.View, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="z12" x:Uid="MenuBarSample_Output" Text="{x:Bind Labels.Output, Mode=OneWay}" Click="OnElementClicked" />
                    <MenuFlyoutSeparator />
                    <RadioMenuFlyoutItem x:Name="z13" x:Uid="MenuBarSample_Landscape" Text="{x:Bind Labels.Landscape, Mode=OneWay}" Click="OnElementClicked" GroupName="OrientationGroup" />
                    <RadioMenuFlyoutItem x:Name="z14" x:Uid="MenuBarSample_Portrait" Text="{x:Bind Labels.Portrait, Mode=OneWay}" Click="OnElementClicked" GroupName="OrientationGroup" IsChecked="True" />
                    <MenuFlyoutSeparator />
                    <RadioMenuFlyoutItem x:Name="z15" x:Uid="MenuBarSample_SmallIcons" Text="{x:Bind Labels.SmallIcons, Mode=OneWay}" Click="OnElementClicked" GroupName="SizeGroup" />
                    <RadioMenuFlyoutItem x:Name="z16" x:Uid="MenuBarSample_MediumIcons" Text="{x:Bind Labels.MediumIcons, Mode=OneWay}" Click="OnElementClicked" GroupName="SizeGroup" IsChecked="True" />
                    <RadioMenuFlyoutItem x:Name="z17" x:Uid="MenuBarSample_LargeIcons" Text="{x:Bind Labels.LargeIcons, Mode=OneWay}" Click="OnElementClicked" GroupName="SizeGroup" />
                  </MenuBarItem>
                  <MenuBarItem x:Uid="MenuBarSample_Help" Title="{x:Bind Labels.Help, Mode=OneWay}">
                    <MenuFlyoutItem x:Name="z18" x:Uid="MenuBarSample_About" Text="{x:Bind Labels.About, Mode=OneWay}" Click="OnElementClicked" />
                  </MenuBarItem>
                </MenuBar>
              </StackPanel>
            </ControlExample.Example>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import MenuBar from '../../components/MenuBar.vue';
import MenuBarItem from '../../components/MenuBarItem.vue';
import { KeyboardAccelerator, MenuFlyoutItem, MenuFlyoutSeparator, MenuFlyoutSubItem, RadioMenuFlyoutItem } from '../../components/MenuFlyoutItems';
import Page from '../../components/Page.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import simpleSample from '../samples/MenuBar/SimpleMenubar.txt?raw';
import keyboardSample from '../samples/MenuBar/MenubarKeyboardAccelerators.txt?raw';
import submenusSample from '../samples/MenuBar/MenubarSubmenusSeparatorsRadio.txt?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'menubar');
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);

const Labels = computed(() => ({
  Title: t('text.menubar'),
  Description: t('text.the-menubar-simplifies-the-creation-of-basic-men'),
  ToggleTheme: t('gallery.page-header.toggle-theme'),
  SimpleHeader: t('text.a-simple-menubar'),
  KeyboardHeader: t('sample.menubar.keyboard'),
  SubmenusHeader: t('sample.menubar.submenus'),
  File: t('MenuBarSample_File.Title'),
  Edit: t('MenuBarSample_Edit.Title'),
  View: t('MenuBarSample_View.Title'),
  Help: t('MenuBarSample_Help.Title'),
  New: t('MenuBarSample_New.Text'),
  Open: t('MenuBarSample_Open.Text'),
  Save: t('MenuBarSample_Save.Text'),
  Exit: t('MenuBarSample_Exit.Text'),
  Undo: t('MenuBarSample_Undo.Text'),
  Cut: t('MenuBarSample_Cut.Text'),
  Copy: t('MenuBarSample_Copy.Text'),
  Paste: t('MenuBarSample_Paste.Text'),
  About: t('MenuBarSample_About.Text'),
  PlainText: t('MenuBarSample_PlainText.Text'),
  RichText: t('MenuBarSample_RichText.Text'),
  OtherFormats: t('MenuBarSample_OtherFormats.Text'),
  Output: t('MenuBarSample_Output.Text'),
  Landscape: t('MenuBarSample_Landscape.Text'),
  Portrait: t('MenuBarSample_Portrait.Text'),
  SmallIcons: t('MenuBarSample_SmallIcons.Text'),
  MediumIcons: t('MenuBarSample_MediumIcons.Text'),
  LargeIcons: t('MenuBarSample_LargeIcons.Text')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');
const SelectedItems = shallowReactive({ o: null, t: null, z: null });
const selectedOutput = (item) => item ? t('sample.menubar.clicked-output', { value: item.Text }) : '';
const Outputs = computed(() => ({
  Simple: selectedOutput(SelectedItems.o),
  Keyboard: selectedOutput(SelectedItems.t),
  Submenus: selectedOutput(SelectedItems.z)
}));
const OnElementClicked = (sender) => {
  const example = String(sender?.Name ?? '').slice(0, 1);
  if (Object.prototype.hasOwnProperty.call(SelectedItems, example)) SelectedItems[example] = sender;
};
const sampleXaml = (source) => source.split(/^--- xaml\s*\r?\n/m)[1]?.trim() ?? '';
const SimpleXaml = sampleXaml(simpleSample);
const KeyboardXaml = sampleXaml(keyboardSample);
const SubmenusXaml = sampleXaml(submenusSample);

provide(xamlScopeKey, {
  Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, toggleTheme, toggleFavorite,
  Outputs, OnElementClicked, SimpleXaml, KeyboardXaml, SubmenusXaml
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); overflow-wrap: anywhere; }
.page-description { color: var(--text-secondary); margin: 0 0 16px; }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content, .menubar-example-stack { min-width: 0; max-width: 100%; }
.menubar-output { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
</style>
