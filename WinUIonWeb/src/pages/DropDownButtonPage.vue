<template>
  <div class="control-page">
    <h1 class="page-header">DropDownButton</h1>
    <p class="page-description">
      A DropDownButton is a button that displays a chevron as a visual indicator that it has an attached flyout that contains more options. It has the same behavior as a standard Button with a flyout; only the appearance is different.
    </p>

    <!-- Example 1: Simple DropDownButton -->
    <WinSettingsCard
      header="A simple DropDownButton with text content."
      description="Click the button to display a menu of email options.">
      <template #default>
        <WinDropDownButton :items="emailActions">
          Email
        </WinDropDownButton>
      </template>
    </WinSettingsCard>

    <!-- Example 2: DropDownButton with icon -->
    <WinSettingsCard
      header="A DropDownButton with an icon."
      description="DropDownButton can display an icon instead of text.">
      <template #default>
        <WinDropDownButton :items="emailActionsWithIcons">
          <template #default>
            <span style="font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets'; font-size: 16px;"></span>
          </template>
        </WinDropDownButton>
      </template>
    </WinSettingsCard>
  </div>
</template>

<script setup>
import WinDropDownButton from '../components/WinDropDownButton.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const emailActions = ['Send', 'Reply', 'Reply All'];

const emailActionsWithIcons = [
  { label: 'Send', icon: '' },
  { label: 'Reply', icon: '' },
  { label: 'Reply All', icon: '' }
];
</script>

<style scoped>
.control-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}
</style>
