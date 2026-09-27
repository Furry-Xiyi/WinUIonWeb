<template>
  <div class="win-switch-presenter" v-bind="$attrs" :style="layoutStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeUnmount, provide, ref, useAttrs } from 'vue';
import { resolveXamlValue } from './xamlRuntime';
import { frameworkLayoutStyle } from './frameworkLayout';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  Value: { type: [String, Number, Boolean, Object], default: null },
  SwitchCases: { type: Array, default: () => [] },
  TargetType: { type: [String, Object, Function], default: null }
});

const registeredCases = ref([]);
const instance = getCurrentInstance(), attrs = useAttrs();
const value = computed(() => resolveXamlValue(props.Value, instance));
const layoutStyle = computed(() => frameworkLayoutStyle(attrs, instance));
let nextCaseId = 0;

const valuesEqual = (left, right) => {
  if (props.TargetType === String) return String(left) === String(right);
  if (props.TargetType === Number) return Number(left) === Number(right);
  return Object.is(left, right) || String(left) === String(right);
};

const caseEntries = computed(() => [
  ...registeredCases.value.map((entry) => entry.get()),
  ...props.SwitchCases.map((entry) => ({
    Value: entry?.Value,
    IsDefault: entry?.IsDefault === true,
    Content: entry?.Content
  }))
]);

const currentCase = computed(() => {
  const entries = caseEntries.value;
  return entries.find((entry) => valuesEqual(entry.Value, value.value))
    || entries.find((entry) => entry.IsDefault)
    || null;
});

const isCaseActive = (Value, IsDefault = false) => {
  if (valuesEqual(Value, value.value)) return true;
  return IsDefault && !currentCase.value;
};

const registerCase = (getCase) => {
  const id = nextCaseId++;
  registeredCases.value = [...registeredCases.value, { id, get: getCase }];
  return () => {
    registeredCases.value = registeredCases.value.filter((entry) => entry.id !== id);
  };
};

provide('win-switch-presenter', {
  isCaseActive,
  registerCase,
  CurrentCase: currentCase
});

defineExpose({
  Value: computed(() => props.Value),
  SwitchCases: computed(() => props.SwitchCases),
  CurrentCase: currentCase,
  TargetType: computed(() => props.TargetType)
});

onBeforeUnmount(() => {
  registeredCases.value = [];
});
</script>

<style>
.win-switch-presenter {
  min-width: 0;
}
</style>
