<template>
  <div class="win-rating" @mouseleave="hoverIdx = -1">
    <span v-for="i in max" :key="i" class="icon" :class="{ 'active': i <= (hoverIdx === -1 ? modelValue : hoverIdx) }"
          @mouseenter="hoverIdx = i" @click="$emit('update:modelValue', i)">
      {{ i <= (hoverIdx === -1 ? modelValue : hoverIdx) ? '&#xE735;' : '&#xE734;' }}
    </span>
  </div>
</template>
<script setup>import { ref } from 'vue'; defineProps({ modelValue: Number, max: { type: Number, default: 5 } }); defineEmits(['update:modelValue']); const hoverIdx = ref(-1);</script>
<style>
  .win-rating {
    display: inline-flex;
    gap: 4px;
    font-size: 18px;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
  }

    .win-rating span {
      transition: color var(--fast-duration), transform 0.1s;
    }

      .win-rating span.active {
        color: var(--accent-base);
      }

      .win-rating span:active {
        transform: scale(0.7);
      }
</style>
