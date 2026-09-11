<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.commandbar')" />
        <TextBlock class="page-description" :Text="$t('text.commandbar-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </ToggleButton>
        </div>
      </div>
      <div class="gallery-page-content">
        <ControlExample
          class="basic-input-example-theme"
          :headerText="$t('text.a-command-bar-with-labels-on-the-side-free-float')"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <StackPanel class="commandbar-sample">
              <CommandBar
                Background="Transparent"
                HorizontalAlignment="Left"
                :Theme="pageTheme"
                :IsOpen="isOpen"
                :IsSticky="isSticky"
                DefaultLabelPosition="Right"
                :PrimaryCommands="primaryCommands"
                :SecondaryCommands="secondaryCommands"
                @update:IsOpen="isOpen = $event" />
              <TextBlock :Text="selectedOption" Padding="0,8,0,0" />
            </StackPanel>
          </template>
          <template #options>
            <StackPanel>
              <TextBlock :Text="$t('sample.commandbar.show-or-hide')" />
              <Button :Content="$t('sample.commandbar.open')" Margin="0,12,0,0" @Click="openCommandBar" />
              <Button :Content="$t('sample.commandbar.close')" Margin="0,12,0,0" @Click="closeCommandBar" />
              <TextBlock :Text="$t('sample.commandbar.modify-content')" Margin="0,16,0,0" />
              <Button :Content="$t('sample.commandbar.add-secondary')" Margin="0,12,0,0" @Click="hasExtraCommands = true" />
              <Button :Content="$t('sample.commandbar.remove-secondary')" Margin="0,12,0,0" @Click="hasExtraCommands = false" />
            </StackPanel>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import AppBarSeparator from '../../components/AppBarSeparator.vue';
import Button from '../../components/Button.vue';
import CommandBar from '../../components/CommandBar.vue';
import ControlExample from '../../components/ControlExample.vue';
import TextBlock from '../../components/TextBlock.vue';
import StackPanel from '../../components/StackPanel.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject<{ value: string }>('currentPage');
const pageKey = computed(() => currentPage?.value || 'commandbar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const isOpen = ref(false);
const isSticky = ref(false);
const hasExtraCommands = ref(false);
const selectedOption = ref('');

const onElementClicked = (name: string) => {
  selectedOption.value = t('sample.you-clicked', { name });
};

const primaryCommands = computed(() => [
  {
    Key: 'Add',
    Component: AppBarButton,
    Props: {
      Icon: 'Add',
      Label: t('text.add'),
      KeyboardAccelerators: [{ Key: 'A', Modifiers: ['Control'] }]
    },
    Click: () => onElementClicked(t('text.add'))
  },
  {
    Key: 'Edit',
    Component: AppBarButton,
    Props: {
      Icon: 'Edit',
      Label: t('text.edit'),
      KeyboardAccelerators: [{ Key: 'E', Modifiers: ['Control'] }]
    },
    Click: () => onElementClicked(t('text.edit'))
  },
  {
    Key: 'Share',
    Component: AppBarButton,
    Props: {
      Icon: 'Share',
      Label: t('text.share'),
      KeyboardAccelerators: [{ Key: 'F4' }]
    },
    Click: () => onElementClicked(t('text.share'))
  }
]);

const secondaryCommands = computed(() => {
  const commands: Array<{
    Key: string;
    Component: unknown;
    Props: Record<string, unknown>;
    Click?: () => void;
  }> = [
    {
      Key: 'Settings',
      Component: AppBarButton,
      Props: {
        Icon: 'Setting',
        Label: t('text.settings'),
        KeyboardAccelerators: [{ Key: 'I', Modifiers: ['Control'] }]
      },
      Click: () => onElementClicked(t('text.settings'))
    }
  ];
  if (hasExtraCommands.value) {
    commands.push(
      {
        Key: 'Button1',
        Component: AppBarButton,
        Props: {
          Icon: 'Add',
          Label: t('sample.commandbar.button-1'),
          KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }]
        },
        Click: () => onElementClicked(t('sample.commandbar.button-1'))
      },
      {
        Key: 'Button2',
        Component: AppBarButton,
        Props: {
          Icon: 'Delete',
          Label: t('sample.commandbar.button-2'),
          KeyboardAccelerators: [{ Key: 'Delete' }]
        },
        Click: () => onElementClicked(t('sample.commandbar.button-2'))
      },
      {
        Key: 'Separator',
        Component: AppBarSeparator,
        Props: {}
      },
      {
        Key: 'Button3',
        Component: AppBarButton,
        Props: {
          Icon: 'FontDecrease',
          Label: t('sample.commandbar.button-3'),
          KeyboardAccelerators: [{ Key: 'Subtract', Modifiers: ['Control'] }],
          KeyboardAcceleratorTextOverride: 'Ctrl+-'
        },
        Click: () => onElementClicked(t('sample.commandbar.button-3'))
      },
      {
        Key: 'Button4',
        Component: AppBarButton,
        Props: {
          Icon: 'FontIncrease',
          Label: t('sample.commandbar.button-4'),
          KeyboardAccelerators: [{ Key: 'Add', Modifiers: ['Control'] }],
          KeyboardAcceleratorTextOverride: 'Ctrl++'
        },
        Click: () => onElementClicked(t('sample.commandbar.button-4'))
      }
    );
  }
  return commands;
});

const openCommandBar = () => {
  isSticky.value = true;
  isOpen.value = true;
};

const closeCommandBar = () => {
  isSticky.value = false;
  isOpen.value = false;
};

const exampleCode = `<CommandBar
  Background="Transparent"
  HorizontalAlignment="Left"
  IsOpen="False"
  IsSticky="False"
  DefaultLabelPosition="Right">
  <AppBarButton Icon="Add" Label="Add" Click="OnElementClicked" />
  <AppBarButton Icon="Edit" Label="Edit" Click="OnElementClicked" />
  <AppBarButton Icon="Share" Label="Share" Click="OnElementClicked" />
  <CommandBar.SecondaryCommands>
    <AppBarButton Icon="Setting" Label="Settings" Click="OnElementClicked">
      <AppBarButton.KeyboardAccelerators>
        <KeyboardAccelerator Key="I" Modifiers="Control" />
      </AppBarButton.KeyboardAccelerators>
    </AppBarButton>
  </CommandBar.SecondaryCommands>
</CommandBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.commandbar-sample { width: 100%; }
</style>
