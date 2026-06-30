<template>
  <div class="win-auto-suggest-box" ref="containerRef" :class="{ disabled: disabled }">
    <div class="win-asb-input-container" :class="visualStateClass">
      <input
        ref="inputRef"
        type="text"
        class="win-asb-input"
        :value="text"
        :placeholder="placeholderText"
        :disabled="disabled"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeyDown"
        @mouseenter="onPointerEnter"
        @mouseleave="onPointerLeave"
        :aria-autocomplete="'list'"
        :aria-controls="isSuggestionListOpen ? suggestionListId : undefined"
        :aria-expanded="isSuggestionListOpen"
        :aria-activedescendant="highlightedIndex >= 0 ? `${suggestionListId}-item-${highlightedIndex}` : undefined"
        role="combobox"
      />
      <button
        v-if="queryIcon"
        class="win-asb-query-button"
        :disabled="disabled"
        @click="onQueryButtonClick"
        @mouseenter="onQueryButtonEnter"
        @mouseleave="onQueryButtonLeave"
        :aria-label="'Search'"
        type="button"
      >
        <span class="icon">{{ queryIcon }}</span>
      </button>
    </div>

    <!-- Suggestion List Popup -->
    <Teleport to="body">
      <div
        v-if="isSuggestionListOpen && hasItems"
        class="win-asb-popup"
        :style="popupStyle"
        ref="popupRef"
      >
        <div
          class="win-asb-suggestions"
          :style="{ maxHeight: maxSuggestionListHeight !== 'auto' ? `${maxSuggestionListHeight}px` : undefined }"
          :id="suggestionListId"
          role="listbox"
        >
          <div
            v-for="(item, index) in itemsSource"
            :key="index"
            class="win-asb-suggestion-item"
            :class="{ highlighted: highlightedIndex === index }"
            :id="`${suggestionListId}-item-${index}`"
            role="option"
            :aria-selected="highlightedIndex === index"
            @click="onSuggestionClick(index)"
            @mouseenter="onSuggestionHover(index)"
          >
            {{ getItemText(item) }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  placeholderText: {
    type: String,
    default: ''
  },
  queryIcon: {
    type: String,
    default: null
  },
  itemsSource: {
    type: Array,
    default: null
  },
  textMemberPath: {
    type: String,
    default: ''
  },
  maxSuggestionListHeight: {
    type: [Number, String],
    default: 'auto'
  },
  isSuggestionListOpen: {
    type: Boolean,
    default: false
  },
  updateTextOnSelect: {
    type: Boolean,
    default: true
  },
  width: {
    type: [Number, String],
    default: 'auto'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:text',
  'update:isSuggestionListOpen',
  'textChanged',
  'suggestionChosen',
  'querySubmitted'
]);

// Refs
const containerRef = ref(null);
const inputRef = ref(null);
const popupRef = ref(null);

// State
const internalText = ref(props.text);
const internalIsOpen = ref(props.isSuggestionListOpen);
const highlightedIndex = ref(-1);
const isFocused = ref(false);
const isPointerOver = ref(false);
const isQueryButtonHover = ref(false);
const suggestionListId = ref(`win-asb-${Math.random().toString(36).substring(7)}`);
const popupStyle = ref({});

// Visual State
const visualStateClass = computed(() => {
  if (props.disabled) return 'disabled';
  if (isFocused.value) return 'focused';
  if (isPointerOver.value) return 'pointer-over';
  return 'normal';
});

const hasItems = computed(() => {
  return props.itemsSource && props.itemsSource.length > 0;
});

// Get display text for an item
const getItemText = (item) => {
  if (!item) return '';
  if (props.textMemberPath && typeof item === 'object') {
    return item[props.textMemberPath] || '';
  }
  return String(item);
};

// Text input handler
const onInput = (event) => {
  const newText = event.target.value;
  internalText.value = newText;
  emit('update:text', newText);

  // Fire TextChanged with UserInput reason
  emit('textChanged', {
    text: newText,
    reason: 'UserInput'
  });

  // Open suggestion list on user input
  if (!internalIsOpen.value && hasItems.value) {
    openSuggestionList();
  }

  // Reset highlighted index on new input
  highlightedIndex.value = -1;
};

// Focus handlers
const onFocus = () => {
  isFocused.value = true;
  if (hasItems.value && internalText.value) {
    openSuggestionList();
  }
};

const onBlur = () => {
  isFocused.value = false;
  // Delay closing to allow click events on suggestions
  setTimeout(() => {
    if (!isFocused.value) {
      closeSuggestionList();
    }
  }, 200);
};

const onPointerEnter = () => {
  isPointerOver.value = true;
};

const onPointerLeave = () => {
  isPointerOver.value = false;
};

const onQueryButtonEnter = () => {
  isQueryButtonHover.value = true;
};

const onQueryButtonLeave = () => {
  isQueryButtonHover.value = false;
};

// Keyboard navigation
const onKeyDown = (event) => {
  if (!internalIsOpen.value || !hasItems.value) {
    if (event.key === 'Enter') {
      onEnterKey();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (highlightedIndex.value < props.itemsSource.length - 1) {
        highlightedIndex.value++;
        scrollToHighlighted();
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
        scrollToHighlighted();
      }
      break;

    case 'Enter':
      event.preventDefault();
      onEnterKey();
      break;

    case 'Escape':
      event.preventDefault();
      closeSuggestionList();
      break;

    case 'Tab':
      closeSuggestionList();
      break;
  }
};

const scrollToHighlighted = async () => {
  await nextTick();
  if (popupRef.value && highlightedIndex.value >= 0) {
    const highlighted = popupRef.value.querySelector('.win-asb-suggestion-item.highlighted');
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' });
    }
  }
};

// Enter key handler
const onEnterKey = () => {
  if (internalIsOpen.value && highlightedIndex.value >= 0) {
    // Select highlighted suggestion
    selectSuggestion(highlightedIndex.value);
  } else {
    // Submit query with current text
    emit('querySubmitted', {
      queryText: internalText.value,
      chosenSuggestion: null
    });
    closeSuggestionList();
  }
};

// Query button click
const onQueryButtonClick = () => {
  if (internalIsOpen.value && highlightedIndex.value >= 0) {
    // Submit with selected suggestion
    const chosenItem = props.itemsSource[highlightedIndex.value];
    emit('querySubmitted', {
      queryText: internalText.value,
      chosenSuggestion: chosenItem
    });
  } else {
    // Submit with current text
    emit('querySubmitted', {
      queryText: internalText.value,
      chosenSuggestion: null
    });
  }
  closeSuggestionList();
};

// Suggestion selection
const onSuggestionClick = (index) => {
  selectSuggestion(index);
};

const onSuggestionHover = (index) => {
  highlightedIndex.value = index;

  // Fire SuggestionChosen on hover
  const chosenItem = props.itemsSource[index];
  emit('suggestionChosen', {
    selectedItem: chosenItem
  });
};

const selectSuggestion = (index) => {
  const chosenItem = props.itemsSource[index];
  const itemText = getItemText(chosenItem);

  // Fire SuggestionChosen
  emit('suggestionChosen', {
    selectedItem: chosenItem
  });

  // Update text if UpdateTextOnSelect is true
  if (props.updateTextOnSelect) {
    internalText.value = itemText;
    emit('update:text', itemText);

    // Fire TextChanged with SuggestionChosen reason
    emit('textChanged', {
      text: itemText,
      reason: 'SuggestionChosen'
    });
  }

  // Fire QuerySubmitted
  emit('querySubmitted', {
    queryText: itemText,
    chosenSuggestion: chosenItem
  });

  closeSuggestionList();
  inputRef.value?.focus();
};

// Suggestion list control
const openSuggestionList = async () => {
  internalIsOpen.value = true;
  emit('update:isSuggestionListOpen', true);

  await nextTick();
  updatePopupPosition();
};

const closeSuggestionList = () => {
  internalIsOpen.value = false;
  emit('update:isSuggestionListOpen', false);
  highlightedIndex.value = -1;
};

// Position popup
const updatePopupPosition = () => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const maxHeight = typeof props.maxSuggestionListHeight === 'number'
    ? props.maxSuggestionListHeight
    : 300;

  let top = rect.bottom + 4;
  let transformOrigin = 'top center';

  // If not enough space below, show above
  if (spaceBelow < Math.min(maxHeight, 200) && spaceAbove > spaceBelow) {
    top = rect.top - 4;
    transformOrigin = 'bottom center';

    popupStyle.value = {
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + 4}px`,
      width: `${rect.width}px`,
      transformOrigin
    };
  } else {
    popupStyle.value = {
      left: `${rect.left}px`,
      top: `${top}px`,
      width: `${rect.width}px`,
      transformOrigin
    };
  }
};

// Watch props
watch(() => props.text, (newVal) => {
  if (newVal !== internalText.value) {
    internalText.value = newVal;

    // Fire TextChanged with ProgrammaticChange reason
    emit('textChanged', {
      text: newVal,
      reason: 'ProgrammaticChange'
    });
  }
});

watch(() => props.isSuggestionListOpen, (newVal) => {
  if (newVal !== internalIsOpen.value) {
    if (newVal) {
      openSuggestionList();
    } else {
      closeSuggestionList();
    }
  }
});

watch(() => props.itemsSource, () => {
  if (isFocused.value && hasItems.value && internalText.value) {
    openSuggestionList();
  }
}, { deep: true });

// Click outside handler
const handleClickOutside = (event) => {
  if (internalIsOpen.value) {
    const clickedInside = containerRef.value?.contains(event.target) ||
                          popupRef.value?.contains(event.target);
    if (!clickedInside) {
      closeSuggestionList();
    }
  }
};

// Resize handler
const handleResize = () => {
  if (internalIsOpen.value) {
    updatePopupPosition();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleResize, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleResize, true);
});
</script>

<style scoped>
.win-auto-suggest-box {
  display: inline-block;
  width: v-bind(width === 'auto' ? 'auto' : (typeof width === 'number' ? `${width}px` : width));
  min-width: 200px;
}

.win-asb-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--control-fill-color-default);
  border: 1px solid var(--control-stroke-color-default);
  border-radius: 4px;
  transition: background var(--fast-duration) var(--fast-out-slow-in),
              border-color var(--fast-duration) var(--fast-out-slow-in),
              box-shadow var(--fast-duration) var(--fast-out-slow-in);
}

.win-asb-input-container.pointer-over {
  background: var(--control-fill-color-secondary);
  border-color: var(--control-stroke-color-default);
}

.win-asb-input-container.focused {
  background: var(--control-fill-color-default);
  border-color: var(--accent-fill-color-default);
  box-shadow: 0 0 0 2px var(--focus-stroke-outer);
}

.win-asb-input-container.disabled {
  background: var(--control-fill-color-disabled);
  border-color: var(--control-stroke-color-default);
  opacity: 0.6;
  cursor: not-allowed;
}

.win-asb-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 5px 12px;
  font-family: var(--font-family-base);
  font-size: var(--body-font-size);
  color: var(--text-fill-color-primary);
  line-height: 20px;
  min-height: 32px;
}

.win-asb-input::placeholder {
  color: var(--text-fill-color-disabled);
}

.win-asb-input:disabled {
  cursor: not-allowed;
  color: var(--text-fill-color-disabled);
}

.win-asb-query-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-left: 1px solid var(--control-stroke-color-default);
  cursor: pointer;
  color: var(--text-fill-color-secondary);
  transition: background var(--fast-duration) var(--fast-out-slow-in),
              color var(--fast-duration) var(--fast-out-slow-in);
  flex-shrink: 0;
}

.win-asb-query-button:hover {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-primary);
}

.win-asb-query-button:active {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-secondary);
}

.win-asb-query-button:disabled {
  cursor: not-allowed;
  color: var(--text-fill-color-disabled);
}

.win-asb-query-button .icon {
  font-family: 'Segoe MDL2 Assets', 'Segoe Fluent Icons', 'Segoe UI Symbol';
  font-size: 12px;
  display: block;
}

/* Popup */
.win-asb-popup {
  position: fixed;
  z-index: 1000;
  animation: asb-popup-enter var(--fast-duration) var(--fast-out-slow-in);
}

@keyframes asb-popup-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.win-asb-suggestions {
  background: var(--layer-fill-color-default);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--surface-stroke-color-flyout);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  overflow-y: auto;
  overflow-x: hidden;
}

.win-asb-suggestion-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-fill-color-primary);
  background: transparent;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.win-asb-suggestion-item:hover {
  background: var(--subtle-fill-color-secondary);
}

.win-asb-suggestion-item.highlighted {
  background: var(--subtle-fill-color-secondary);
}

.win-asb-suggestion-item:active {
  background: var(--subtle-fill-color-secondary);
  color: var(--text-fill-color-secondary);
}

/* Scrollbar styling */
.win-asb-suggestions::-webkit-scrollbar {
  width: 8px;
}

.win-asb-suggestions::-webkit-scrollbar-track {
  background: transparent;
}

.win-asb-suggestions::-webkit-scrollbar-thumb {
  background: var(--control-fill-color-default);
  border-radius: 4px;
}

.win-asb-suggestions::-webkit-scrollbar-thumb:hover {
  background: var(--control-fill-color-secondary);
}
</style>
