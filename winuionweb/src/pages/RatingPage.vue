<template>
  <h1 class="page-header">RatingControl</h1>
  <WinSettingsCard>
    <template #header>
      RatingControl
    </template>
    <template #description>
      A star-based rating input.
    </template>
    <WinRating v-model="val" />
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinRating from '../components/WinRating.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
const val = ref(3);
</script>
