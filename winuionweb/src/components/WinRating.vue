<template>
  <div class="win-rating" @mouseleave="hoverIdx = -1">
    <span v-for="i in max" :key="i" class="icon" :class="{ 'active': i <= (hoverIdx === -1 ? modelValue : hoverIdx) }"
          @mouseenter="hoverIdx = i" @click="$emit('update:modelValue', i)">
      {{ i <= (hoverIdx === -1 ? modelValue : hoverIdx) ? '&#xE735;' : '&#xE734;' }}
    </span>
  </div>
</template>
<script setup>import { ref } from 'vue'; defineProps({ modelValue: Number, max: { type: Number, default: 5 } }); defineEmits(['update:modelValue']); const hoverIdx = ref(-1);</script>
<style src="../styles/rating.css"></style>
