<template>
  <div>
    <h1 class="page-header">DropDownButton</h1>
    <p class="page-description">
      A DropDownButton is a button that displays a chevron as a visual indicator that it has an attached flyout that contains more options. It has the same behavior as a standard Button with a flyout; only the appearance is different.
    </p>

    <WinControlExample headerText="A simple DropDownButton with text content">
      <template #example>
        <WinDropDownButton :items="emailActions">
          Email
        </WinDropDownButton>
      </template>
    </WinControlExample>

    <WinControlExample headerText="A DropDownButton with an icon">
      <template #example>
        <WinDropDownButton :items="emailActionsWithIcons">
          <template #default>
            <span class="icon">&#xE715;</span>
          </template>
        </WinDropDownButton>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import WinDropDownButton from '../components/WinDropDownButton.vue';
import WinControlExample from '../components/WinControlExample.vue';

const emailActions = ['Send', 'Reply', 'Reply All'];

const emailActionsWithIcons = [
  { label: 'Send', icon: '' },
  { label: 'Reply', icon: '' },
  { label: 'Reply All', icon: '' }
];
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', 'WinUIOnWebIcons';
  font-size: 16px;
}
</style>
