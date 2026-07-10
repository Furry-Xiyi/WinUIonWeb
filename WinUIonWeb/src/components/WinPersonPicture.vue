<template>
  <div class="win-person-picture" :style="rootStyle" :title="DisplayName || Initials">
    <img v-if="ProfilePicture" :src="ProfilePicture" alt="" />
    <span v-else-if="resolvedInitials" class="win-person-initials">{{ resolvedInitials }}</span>
    <span v-else class="icon"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  ProfilePicture: { type: String, default: '' },
  DisplayName: { type: String, default: '' },
  Initials: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  profilePicture: String,
  displayName: String,
  initials: String,
  size: { type: Number, default: 72 }
});

const ProfilePicture = computed(() => props.ProfilePicture || props.profilePicture || '');
const DisplayName = computed(() => props.DisplayName || props.displayName || '');
const Initials = computed(() => props.Initials || props.initials || '');

const resolvedInitials = computed(() => {
  if (Initials.value) return Initials.value.slice(0, 2).toUpperCase();
  if (!DisplayName.value) return '';
  return DisplayName.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
});

const rootStyle = computed(() => ({
  width: cssLength(props.Width || props.Height || props.size),
  height: cssLength(props.Height || props.size),
  fontSize: `${Math.max(18, cssNumber(props.Height || props.Width || props.size) * 0.34)}px`
}));

const cssLength = (value) => typeof value === 'number' || String(value).match(/^\d+$/) ? `${value}px` : value;
const cssNumber = (value) => {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : props.size;
};
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
