<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <WinTextBlock class="page-header" :Text="$t('text.commandbar')" />
        <WinTextBlock class="page-description" :Text="$t('text.commandbar-subtitle')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
          <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
            <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
          </WinToggleButton>
        </div>
      </div>
      <div class="gallery-page-content">
        <WinControlExample
          class="basic-input-example-theme"
          :headerText="$t('text.a-command-bar-with-labels-on-the-side-free-float')"
          :theme="pageTheme"
          :vue="exampleCode">
          <template #example>
            <WinStackPanel class="commandbar-sample">
              <WinCommandBar
                Background="Transparent"
                HorizontalAlignment="Left"
                :Theme="pageTheme"
                :IsOpen="isOpen"
                :IsSticky="isSticky"
                DefaultLabelPosition="Right"
                :PrimaryCommands="primaryCommands"
                :SecondaryCommands="secondaryCommands"
                @update:IsOpen="isOpen = $event" />
              <WinTextBlock :Text="selectedOption" Padding="0,8,0,0" />
            </WinStackPanel>
          </template>
          <template #options>
            <WinStackPanel>
              <WinTextBlock :Text="$t('sample.commandbar.show-or-hide')" />
              <WinButton :Content="$t('sample.commandbar.open')" Margin="0,12,0,0" @Click="openCommandBar" />
              <WinButton :Content="$t('sample.commandbar.close')" Margin="0,12,0,0" @Click="closeCommandBar" />
              <WinTextBlock :Text="$t('sample.commandbar.modify-content')" Margin="0,16,0,0" />
              <WinButton :Content="$t('sample.commandbar.add-secondary')" Margin="0,12,0,0" @Click="hasExtraCommands = true" />
              <WinButton :Content="$t('sample.commandbar.remove-secondary')" Margin="0,12,0,0" @Click="hasExtraCommands = false" />
            </WinStackPanel>
          </template>
        </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinAppBarSeparator from '../../components/WinAppBarSeparator.vue';
import WinButton from '../../components/WinButton.vue';
import WinCommandBar from '../../components/WinCommandBar.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
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
    Component: WinAppBarButton,
    Props: {
      Icon: 'Add',
      Label: t('text.add'),
      KeyboardAccelerators: [{ Key: 'A', Modifiers: ['Control'] }]
    },
    Click: () => onElementClicked(t('text.add'))
  },
  {
    Key: 'Edit',
    Component: WinAppBarButton,
    Props: {
      Icon: 'Edit',
      Label: t('text.edit'),
      KeyboardAccelerators: [{ Key: 'E', Modifiers: ['Control'] }]
    },
    Click: () => onElementClicked(t('text.edit'))
  },
  {
    Key: 'Share',
    Component: WinAppBarButton,
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
      Component: WinAppBarButton,
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
        Component: WinAppBarButton,
        Props: {
          Icon: 'Add',
          Label: t('sample.commandbar.button-1'),
          KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }]
        },
        Click: () => onElementClicked(t('sample.commandbar.button-1'))
      },
      {
        Key: 'Button2',
        Component: WinAppBarButton,
        Props: {
          Icon: 'Delete',
          Label: t('sample.commandbar.button-2'),
          KeyboardAccelerators: [{ Key: 'Delete' }]
        },
        Click: () => onElementClicked(t('sample.commandbar.button-2'))
      },
      {
        Key: 'Separator',
        Component: WinAppBarSeparator,
        Props: {}
      },
      {
        Key: 'Button3',
        Component: WinAppBarButton,
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
        Component: WinAppBarButton,
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

const exampleCode = `<WinCommandBar
  Background="Transparent"
  HorizontalAlignment="Left"
  IsOpen="False"
  IsSticky="False"
  DefaultLabelPosition="Right">
  <WinAppBarButton Icon="Add" Label="Add" Click="OnElementClicked" />
  <WinAppBarButton Icon="Edit" Label="Edit" Click="OnElementClicked" />
  <WinAppBarButton Icon="Share" Label="Share" Click="OnElementClicked" />
  <WinCommandBar.SecondaryCommands>
    <WinAppBarButton Icon="Setting" Label="Settings" Click="OnElementClicked">
      <WinAppBarButton.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="I" Modifiers="Control" />
      </WinAppBarButton.KeyboardAccelerators>
    </WinAppBarButton>
  </WinCommandBar.SecondaryCommands>
</WinCommandBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.commandbar-sample { width: 100%; }
</style>
