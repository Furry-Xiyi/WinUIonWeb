<template>
  <div class="win-person-picture" :style="rootStyle" :title="displayName || initials">
    <img v-if="profilePicture" :src="profilePicture" alt="" />
    <span v-else-if="resolvedInitials" class="win-person-initials">{{ resolvedInitials }}</span>
    <span v-else class="icon">&#xE77B;</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  profilePicture: String,
  displayName: String,
  initials: String,
  size: { type: Number, default: 300 }
});

const resolvedInitials = computed(() => {
  if (props.initials) return props.initials.slice(0, 2).toUpperCase();
  if (!props.displayName) return '';
  return props.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
});

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${Math.max(18, props.size * 0.34)}px`
}));
</script>

<style>
  .win-person-picture {
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #587cde, #11a37f);
    color: white;
    display: inline-grid;
    place-items: center;
    font-weight: 600;
    user-select: none;
  }

  .win-person-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .win-person-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    text-align: center;
  }

  .win-person-picture .icon {
    font-size: 44%;
  }
</style>
