<template>
  <nav class="win-breadcrumb-bar" role="navigation" :aria-label="t('text.breadcrumb')">
    <ol class="win-breadcrumb-list">
      <li
        v-for="(item, index) in itemsSourceInternal"
        :key="index"
        class="win-breadcrumb-item"
      >
        <button
          class="win-breadcrumb-button"
          :class="{ 'is-last': index === itemsSourceInternal.length - 1 }"
          :aria-current="index === itemsSourceInternal.length - 1 ? 'page' : undefined"
          @click="handleItemClick(index)"
        >
          <span class="win-breadcrumb-content">
            <slot
              v-if="$slots.item"
              name="item"
              :item="item"
              :index="index"
            ></slot>
            <template v-else>
              {{ getItemText(item) }}
            </template>
          </span>
        </button>
        <span
          v-if="index < itemsSourceInternal.length - 1"
          class="win-breadcrumb-separator"
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.646 2.146a.5.5 0 0 1 .708 0l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L7.793 6 4.646 2.854a.5.5 0 0 1 0-.708Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const props = defineProps({
  itemsSource: {
    type: Array,
    default: null
  }
});

const emit = defineEmits(['itemClicked']);

// Internal reactive copy of itemsSource
const itemsSourceInternal = ref([]);

// Initialize and watch itemsSource
watch(
  () => props.itemsSource,
  (newValue) => {
    if (newValue) {
      itemsSourceInternal.value = [...newValue];
    } else {
      itemsSourceInternal.value = [];
    }
  },
  { immediate: true, deep: true }
);

// Get text from item (string or object with Name property)
const getItemText = (item) => {
  if (typeof item === 'string') {
    return item;
  }
  return item?.Name || item?.name || String(item);
};

// Handle item click - emit ItemClicked event with index
const handleItemClick = (index) => {
  emit('itemClicked', { index });
};
</script>

<style scoped>
.win-breadcrumb-bar {
  display: block;
  padding: 8px 0;
}

.win-breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;
}

.win-breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.win-breadcrumb-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-fill-color-secondary);
  font-size: 14px;
  font-family: inherit;
  padding: 4px 8px;
  min-height: 28px;
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in),
              color var(--fast-duration);
  user-select: none;
  outline: none;
}

.win-breadcrumb-button:hover {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-primary);
}

.win-breadcrumb-button:active {
  background: var(--subtle-fill-color-tertiary);
  color: var(--text-fill-color-secondary);
}

.win-breadcrumb-button:focus-visible {
  outline: 2px solid var(--accent-fill-color-default);
  outline-offset: 2px;
}

/* Last item styling - not clickable appearance but still functional */
.win-breadcrumb-button.is-last {
  color: var(--text-fill-color-primary);
  font-weight: 600;
}

.win-breadcrumb-button.is-last:hover {
  background: var(--subtle-fill-color-secondary);
}

.win-breadcrumb-button.is-last:active {
  background: var(--subtle-fill-color-tertiary);
}

.win-breadcrumb-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.win-breadcrumb-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-fill-color-tertiary);
  flex-shrink: 0;
}

.win-breadcrumb-separator svg {
  width: 12px;
  height: 12px;
}

/* Disabled state */
.win-breadcrumb-button:disabled {
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
  pointer-events: none;
}

.win-breadcrumb-button:disabled:hover {
  background: transparent;
}
</style>
