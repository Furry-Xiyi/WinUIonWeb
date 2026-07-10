<template>
  <WinTextBlock class="page-header" :Text="$t('text.listbox')" />
  <WinTextBlock class="page-description" :Text="$t('text.a-control-that-presents-an-inline-list-of-items')" TextWrapping="WrapWholeWords" />

  <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-listbox')" />

  <WinControlExample>
    <template #example>
      <WinListBox :ItemsSource="['Blue', 'Green', 'Red', 'Yellow']" v-model:SelectedIndex="idx" style="width: 200px;" />
    </template>
    <template #options>
      <WinTextBlock :Text="`Selected color: ${['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None'}`" />
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinListBox from '../../components/WinListBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';

const idx = ref(0);
</script>

<style scoped>
.control-example-description {
  margin-top: 16px;
  font-weight: 600;
}
</style>
