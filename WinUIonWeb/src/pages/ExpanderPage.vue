<template>
  <h1 class="page-header">Expander</h1>
  <WinExpander>
    <template #header>
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 14px;">Expander Control</span>
        <span style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Smooth Grid expansion.</span>
      </div>
    </template>
    <div>Here is the inner content of the expander.</div>
  </WinExpander>
</template>

<script setup>
import WinExpander from '../components/WinExpander.vue';
</script>
