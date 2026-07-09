<template>
  <h1 class="page-header">{{ $t('text.listbox') }}</h1>
  <p class="page-description">{{ $t('text.a-control-that-presents-an-inline-list-of-items') }}</p>

  <WinTextBlock class="control-example-description" :Text="$t('text.a-simple-listbox')" />

  <WinControlExample>
    <template #example>
      <WinListBox :items="['Blue', 'Green', 'Red', 'Yellow']" v-model:selectedIndex="idx" style="width: 200px;" />
    </template>
    <template #options>
      <span>Selected color: {{ ['Blue', 'Green', 'Red', 'Yellow'][idx] || 'None' }}</span>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref } from 'vue';
import WinListBox from '../../components/WinListBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';

const idx = ref(0);
</script>
