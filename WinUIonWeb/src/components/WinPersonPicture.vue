<template>
  <div
    class="win-person-picture"
    :class="{ 'has-photo': imageSource, 'has-badge': badgeVisible }"
    :style="rootStyle"
    :aria-label="automationLabel">
    <img v-if="imageSource" class="win-person-picture-image" :src="imageSource" alt="" />
    <span v-else-if="!IsGroup && actualInitials" class="win-person-picture-initials">{{ actualInitials }}</span>
    <span v-else class="icon win-person-picture-placeholder">{{ IsGroup ? '\uE716' : '\uE77B' }}</span>

    <span v-if="badgeVisible" class="win-person-picture-badge">
      <img v-if="badgeImageSource" :src="badgeImageSource" alt="" />
      <span v-else-if="BadgeNumber > 0">{{ BadgeNumber > 99 ? '99+' : BadgeNumber }}</span>
      <span v-else-if="BadgeGlyph" class="icon">{{ BadgeGlyph }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  BadgeNumber: { type: Number, default: 0 },
  BadgeGlyph: { type: String, default: '' },
  BadgeImageSource: { type: [String, Object], default: '' },
  BadgeText: { type: String, default: '' },
  IsGroup: { type: Boolean, default: false },
  Contact: { type: Object, default: null },
  DisplayName: { type: String, default: '' },
  Initials: { type: String, default: '' },
  PreferSmallImage: { type: Boolean, default: false },
  ProfilePicture: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: 96 },
  Height: { type: [String, Number], default: 96 },
  Foreground: { type: String, default: '' },
  Background: { type: String, default: '' },
  BorderBrush: { type: String, default: '' },
  BorderThickness: { type: [String, Number], default: 1 },
  FontFamily: { type: String, default: '' },
  FontWeight: { type: [String, Number], default: '600' },
  VerticalAlignment: { type: String, default: '' },
  HorizontalAlignment: { type: String, default: '' }
});

const cssLength = (value: unknown): string | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(String(value).trim())
    ? `${value}px`
    : String(value);
};

const contactDisplayName = computed(() => props.Contact?.DisplayName || props.DisplayName || '');
const imageUri = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return String((value as { UriSource?: unknown }).UriSource || '');
  return '';
};
const imageSource = computed(() => imageUri(props.ProfilePicture) || imageUri(props.Contact?.ProfilePicture));
const badgeImageSource = computed(() => imageUri(props.BadgeImageSource));

const firstCharacter = (value: unknown): string => {
  const match = String(value || '').trim().match(/[\p{L}\p{N}]/u);
  return match?.[0] || '';
};

const actualInitials = computed(() => {
  if (props.IsGroup) return '';
  if (props.Initials) return props.Initials.slice(0, 2).toUpperCase();
  const displayName = contactDisplayName.value.replace(/\s*[({\[][^)}\]]*[)}\]]\s*$/, '').trim();
  const words = displayName.split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  return (firstCharacter(words[0]) + (words.length > 1 ? firstCharacter(words[words.length - 1]) : '')).toUpperCase();
});

const badgeVisible = computed(() => Boolean(badgeImageSource.value) || props.BadgeNumber > 0 || Boolean(props.BadgeGlyph));

const pictureDimension = (value: unknown): string => {
  const dimension = cssLength(value);
  return dimension && dimension !== 'auto' ? dimension : '96px';
};

// WinUI keeps PersonPicture circular by applying the smaller arranged dimension
// to both axes. CSS min() preserves that rule for numeric and relative sizes.
const pictureSize = computed(() => {
  const width = pictureDimension(props.Width);
  const height = pictureDimension(props.Height);
  return width === height ? width : `min(${width}, ${height})`;
});

const rootStyle = computed(() => ({
  width: cssLength(pictureSize.value),
  height: cssLength(pictureSize.value),
  '--win-person-picture-size': cssLength(pictureSize.value),
  color: props.Foreground || 'var(--PersonPictureForegroundThemeBrush, var(--text-primary))',
  background: props.Background || 'var(--PersonPictureEllipseFillThemeBrush, var(--ctrl-fill-secondary))',
  borderColor: props.BorderBrush || 'var(--PersonPictureEllipseFillStrokeBrush, var(--card-stroke))',
  borderWidth: cssLength(props.BorderThickness),
  fontFamily: props.FontFamily || 'var(--font-family-content, Segoe UI)',
  fontWeight: props.FontWeight,
  alignSelf: ({ Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'stretch' })[props.VerticalAlignment] || undefined,
  justifySelf: ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' })[props.HorizontalAlignment] || undefined
}));

const automationLabel = computed(() => {
  if (props.BadgeText) return `${contactDisplayName.value}, ${props.BadgeText}`;
  return contactDisplayName.value || actualInitials.value || undefined;
});
</script>

<style>
.win-person-picture {
  position: relative;
  display: inline-grid;
  place-items: center;
  container-type: size;
  flex: 0 0 auto;
  overflow: visible;
  border-style: solid;
  border-radius: 50%;
  box-sizing: border-box;
  color: var(--text-primary);
  user-select: none;
}

.win-person-picture-image {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.win-person-picture-initials {
  display: block;
  font-size: 40px;
  font-size: 42cqi;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.win-person-picture-placeholder {
  font-size: 40px;
  font-size: 42cqi;
  line-height: 1;
}

.win-person-picture-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 50%;
  height: 50%;
  min-width: 0;
  min-height: 0;
  padding: 0;
  box-sizing: border-box;
  border: 2px solid var(--ControlFillColorTransparentBrush, transparent);
  border-radius: 999px;
  background: var(--PersonPictureEllipseBadgeFillThemeBrush, var(--accent-base));
  color: var(--PersonPictureEllipseBadgeForegroundThemeBrush, var(--accent-text));
  font-size: 29px;
  font-size: 30cqi;
  font-weight: 600;
  line-height: 1;
}

.win-person-picture-badge img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}
</style>
