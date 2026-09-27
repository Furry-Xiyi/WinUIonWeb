<template>
  <div v-if="isGroup" class="win-radio-buttons" :class="{ 'is-disabled': !resolvedIsEnabled }" :style="rootStyle">
    <TextBlock v-if="resolvedHeader" class="win-radio-buttons-header" Text="{x:Bind RadioButtonsHeader}" />
    <div class="win-radio-buttons-items" :style="itemsStyle">
      <label
        v-for="(item, index) in normalizedItems"
        :key="index"
        class="win-radio-button"
        :class="{ 'is-checked': selectedIndexValue === index, 'is-disabled': !resolvedIsEnabled }">
        <input
          class="win-radio-input"
          type="radio"
          :name="groupName"
          :checked="selectedIndexValue === index"
          :disabled="!resolvedIsEnabled"
          @change="select(index)" />
        <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
        <TextBlock class="win-radio-content">{{ item.Text }}</TextBlock>
      </label>
      <slot v-if="normalizedItems.length === 0" />
    </div>
  </div>

  <label
    v-else
    class="win-radio-button"
    :class="{ 'is-checked': resolvedChecked, 'is-disabled': !resolvedIsEnabled }"
    :style="rootStyle">
    <input
      ref="radioInput"
      class="win-radio-input"
      type="radio"
      :name="radioGroupName || undefined"
      :checked="resolvedChecked"
      :disabled="!resolvedIsEnabled"
      :tabindex="group?.tabIndex ? group.tabIndex(groupIndex) : undefined"
      @change="check"
      @keydown="group?.navigate?.(groupIndex, $event)" />
    <span class="win-radio-glyph" aria-hidden="true"><span class="win-radio-check" /></span>
    <TextBlock v-if="$slots.default" class="win-radio-content">
      <slot />
    </TextBlock>
    <TextBlock v-else class="win-radio-content" Text="{x:Bind RadioContent}" />
  </label>
</template>

<script>
// A named XAML group spans sibling RadioButton instances in the same app.
// Browser radios alone cannot update the dependency properties or glyphs.
const namedRadioGroups = new WeakMap();
</script>

<script setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue';
import TextBlock from './TextBlock.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';

const radioButtonsGroupKey = Symbol.for('WinUIonWeb.RadioButtons');

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, String], default: undefined },
  IsEnabled: { type: [Boolean, String], default: true },
  GroupName: { type: String, default: '' },
  Tag: { type: [String, Number, Boolean, Object], default: undefined },
  name: { type: String, default: '' },
  Header: { type: String, default: '' },
  ItemsSource: { type: [Array, String], default: () => [] },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: null, default: undefined },
  MaxColumns: { type: [Number, String], default: 1 },
  Margin: { type: String, default: '' },
  value: { type: [String, Number, Boolean, Object], default: undefined },
  modelValue: { type: [String, Number, Boolean, Object], default: undefined }
});

const emit = defineEmits(['update:IsChecked', 'Checked', 'Unchecked', 'update:modelValue', 'update:SelectedIndex', 'update:SelectedItem', 'SelectionChanged']);

const groupName = `win-radio-buttons-${Math.random().toString(36).slice(2)}`;
const instance = getCurrentInstance();
const attrs = useAttrs();
const radioInput = ref(null);
const group = inject(radioButtonsGroupKey, null);
const resolvedItemsSource = computed(() => {
  const value = resolveXamlValue(props.ItemsSource, instance);
  return Array.isArray(value) ? value : [];
});
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false && group?.isEnabled?.value !== false);
const resolvedIsChecked = computed(() => resolveXamlValue(props.IsChecked, instance));
const localChecked = ref(resolvedIsChecked.value === true || (props.value !== undefined && props.modelValue === props.value));
const resolvedSelectedIndex = computed(() => {
  const value = resolveXamlValue(props.SelectedIndex, instance);
  return value === undefined || value === '' ? undefined : Number(value);
});
const internalSelectedIndex = ref(resolvedSelectedIndex.value ?? -1);
const groupIndex = group?.register?.({
  getItem: () => eventSender,
  isEnabled: () => resolvedIsEnabled.value,
  getBounds: () => radioInput.value?.parentElement?.getBoundingClientRect(),
  focus: () => radioInput.value?.focus()
});
let nextSlotIndex = 0;

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const isGroup = computed(() => resolvedHeader.value !== '' || resolvedItemsSource.value.length > 0 || resolvedSelectedIndex.value !== undefined || props.SelectedItem !== undefined);
const normalizedItems = computed(() => resolvedItemsSource.value.map((item) => {
  if (typeof item === 'string' || typeof item === 'number') return { Text: String(item), Value: item };
  return { ...item, Text: item.Text ?? item.Content ?? item.label ?? String(item), Value: item.Value ?? item };
}));
const selectedIndexValue = computed(() => resolvedSelectedIndex.value ?? internalSelectedIndex.value);
const defaultGroupName = `win-radio-parent-${instance?.parent?.uid ?? instance?.uid}`;
const radioGroupName = computed(() => group?.name || props.GroupName || props.name || (group ? '' : defaultGroupName));
const resolvedChecked = computed(() => {
  // RadioButtons owns the selection state for its direct RadioButton
  // children.  A declarative IsChecked="True" establishes the initial
  // selection only; it must not pin that item after the user picks another
  // item, which is how WinUI's RadioButton group behaves.
  if (group && groupIndex !== undefined) return group.selectedIndex.value === groupIndex;
  return localChecked.value;
});
const contentText = computed(() => {
  const value = resolveXamlValue(props.Content, instance);
  return value === undefined || value === null ? '' : String(value);
});
const RadioButtonsHeader = computed(() => resolvedHeader.value);
const RadioContent = computed(() => contentText.value);
const setChecked = (value) => {
  const checked = resolveXamlValue(value, instance) === true;
  if (group && groupIndex !== undefined) {
    if (checked) group.select(groupIndex, false);
    else if (resolvedChecked.value) group.select(-1, false);
  } else {
    if (checked && registeredNamedGroup) {
      for (const member of appRadioGroups.get(registeredNamedGroup) ?? []) {
        if (member !== namedMember) member.setChecked(false);
      }
    }
    localChecked.value = checked;
  }
};
let registeredNamedGroup = '';
let appRadioGroups = namedRadioGroups.get(instance.appContext);
if (!appRadioGroups) { appRadioGroups = new Map(); namedRadioGroups.set(instance.appContext, appRadioGroups); }
const namedMember = { setChecked };
const unregisterNamedGroup = () => {
  const members = appRadioGroups.get(registeredNamedGroup);
  members?.delete(namedMember);
  if (members?.size === 0) appRadioGroups.delete(registeredNamedGroup);
  registeredNamedGroup = '';
};
watch(radioGroupName, name => {
  unregisterNamedGroup();
  if (group || !name) return;
  registeredNamedGroup = name;
  let members = appRadioGroups.get(name);
  if (!members) { members = new Set(); appRadioGroups.set(name, members); }
  members.add(namedMember);
  if (localChecked.value) setChecked(true);
}, { immediate: true });
const eventSender = {
  get Name() { return String(attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? ''); },
  get Tag() { return resolveXamlValue(props.Tag, instance); },
  get Content() { return contentText.value; },
  get IsChecked() { return resolvedChecked.value; },
  set IsChecked(value) { setChecked(value); },
  get IsEnabled() { return resolvedIsEnabled.value; },
  get GroupName() { return radioGroupName.value; }
};
const rootStyle = computed(() => props.Margin ? { margin: xamlThickness(resolveXamlValue(props.Margin, instance)) } : {});
const itemsStyle = computed(() => {
  const maxColumns = Math.max(1, Number(props.MaxColumns) || 1);
  return maxColumns > 1
    ? { gridTemplateColumns: `repeat(${maxColumns}, max-content)` }
    : { gridTemplateColumns: 'max-content' };
});

const check = () => {
  if (!resolvedIsEnabled.value || resolvedChecked.value) return;
  if (group && groupIndex !== undefined) group.select(groupIndex);
  else setChecked(true);
};

watch(resolvedIsChecked, (value) => {
  if (value !== undefined) setChecked(value);
});
watch(() => props.modelValue, (value) => {
  if (props.value !== undefined) setChecked(value === props.value);
});
watch(resolvedChecked, (value, previous) => {
  if (value === previous) return;
  emit('update:IsChecked', value);
  updateXamlBinding(props.IsChecked, value, instance);
  const eventName = value ? 'Checked' : 'Unchecked';
  const args = { OriginalSource: eventSender, RoutedEvent: eventName };
  emit(eventName, eventSender, args);
  resolveXamlHandler(attrs[eventName], instance)?.(eventSender, args);
  if (value && props.value !== undefined) emit('update:modelValue', props.value);
}, { flush: 'sync' });

onMounted(() => {
  if (group && groupIndex !== undefined && resolvedIsChecked.value === true && group.selectedIndex.value < 0) {
    if (group.initialize) group.initialize(groupIndex);
    else group.select(groupIndex);
  }
});
onBeforeUnmount(() => { group?.unregister?.(groupIndex); unregisterNamedGroup(); });

const select = (index) => {
  if (!resolvedIsEnabled.value) return;
  const oldItem = normalizedItems.value[selectedIndexValue.value];
  const newItem = normalizedItems.value[index];
  internalSelectedIndex.value = index;
  emit('update:SelectedIndex', index);
  emit('update:SelectedItem', newItem?.Value ?? newItem);
  const args = {
    SelectedIndex: index,
    SelectedItem: newItem?.Value ?? newItem,
    AddedItems: newItem ? [newItem.Value ?? newItem] : [],
    RemovedItems: oldItem ? [oldItem.Value ?? oldItem] : []
  };
  emit('SelectionChanged', args);
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(args);
};

provide(xamlScopeKey, { RadioButtonsHeader, RadioContent });

provide(radioButtonsGroupKey, {
  selectedIndex: selectedIndexValue,
  register: () => nextSlotIndex++,
  select
});

defineExpose({
  Name: computed(() => eventSender.Name),
  IsChecked: computed({ get: () => resolvedChecked.value, set: setChecked }),
  Content: contentText,
  Tag: computed(() => resolveXamlValue(props.Tag, instance)),
  IsEnabled: resolvedIsEnabled,
  GroupName: radioGroupName
});
</script>

<style>
.win-radio-buttons {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.win-radio-buttons-header {
  margin: 0 0 8px;
}

.win-radio-buttons-items {
  display: grid;
  column-gap: 7px;
  row-gap: 8px;
  align-items: start;
}

.win-radio-button {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  min-width: 120px;
  min-height: 32px;
  padding: 0;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

.win-radio-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

.win-radio-button:has(.win-radio-input:focus-visible) {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: 2px;
  border-radius: 2px;
}

.win-radio-glyph {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  flex: 0 0 20px;
  border: 1px solid var(--radio-border, var(--ctrl-strong-stroke-default));
  border-radius: 50%;
  background: transparent;
  margin-top: 6px;
}

.win-radio-check {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transform: scale(0);
  transition: transform var(--fast-duration) var(--fast-out-slow-in);
}

.win-radio-button:hover .win-radio-glyph {
  border-color: var(--text-primary);
  background: var(--subtle-secondary);
}

.win-radio-button:active .win-radio-glyph {
  border-color: var(--text-secondary);
  background: var(--subtle-tertiary);
}

.win-radio-button.is-checked .win-radio-glyph {
  border-color: var(--accent-base);
  background: var(--accent-base);
}

.win-radio-button.is-checked:hover .win-radio-glyph {
  border-color: var(--accent-hover);
  background: var(--accent-hover);
}

.win-radio-button.is-checked:active .win-radio-glyph {
  border-color: var(--accent-pressed);
  background: var(--accent-pressed);
}

.win-radio-button.is-checked .win-radio-check {
  background: var(--accent-text);
  transform: scale(1);
}

.win-radio-button.is-checked:hover .win-radio-check {
  transform: scale(1.2);
}

.win-radio-button.is-checked:active .win-radio-check {
  transform: scale(0.8);
}

.win-radio-content {
  line-height: 20px;
  padding-top: 6px;
}

.win-radio-button.is-disabled {
  cursor: default;
  color: var(--text-disabled);
}

.win-radio-button.is-disabled .win-radio-glyph {
  border-color: var(--ctrl-strong-stroke-disabled);
  background: transparent;
}

.win-radio-button.is-disabled.is-checked .win-radio-glyph {
  background: var(--ctrl-strong-stroke-disabled);
}
</style>
