<template>
  <div class="win-password-box" :style="rootStyle">
    <WinTextBox
      ref="textBoxRef"
      class="win-password-textbox"
      :Text="visibleText"
      :Header="Header"
      :Description="Description"
      :PlaceholderText="PlaceholderText"
      :MaxLength="MaxLength"
      :IsEnabled="IsEnabled"
      :InputScope="InputScope"
      :SelectionHighlightColor="SelectionHighlightColor"
      :PreventKeyboardDisplayOnProgrammaticFocus="PreventKeyboardDisplayOnProgrammaticFocus"
      @update:Text="onVisibleTextChanged"
      @GotFocus="emit('GotFocus')"
      @LostFocus="emit('LostFocus')"
      @Paste="onPaste">
      <template #actions>
        <button
          v-if="showRevealButton"
          class="win-textbox-action-button win-password-reveal"
          type="button"
          :disabled="!IsEnabled"
          aria-label="Reveal password"
          @pointerdown.prevent="peekPassword"
          @pointerup.prevent="hidePeek"
          @pointerleave="hidePeek"
          @click="toggleVisible">
          <span>&#xF78D;</span>
        </button>
      </template>
    </WinTextBox>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import WinTextBox from './WinTextBox.vue';

type PasswordRevealMode = 'Peek' | 'Hidden' | 'Visible';

const props = withDefaults(defineProps<{
  Password?: string;
  Header?: string;
  HeaderTemplate?: unknown | null;
  Description?: string;
  PlaceholderText?: string;
  PasswordChar?: string;
  PasswordRevealMode?: PasswordRevealMode;
  MaxLength?: number;
  IsEnabled?: boolean;
  CanPasteClipboardContent?: boolean;
  InputScope?: string;
  SelectionFlyout?: unknown | null;
  SelectionHighlightColor?: string;
  TextReadingOrder?: string;
  PreventKeyboardDisplayOnProgrammaticFocus?: boolean;
  Width?: number | string;
}>(), {
  Password: '',
  Header: '',
  HeaderTemplate: undefined,
  Description: '',
  PlaceholderText: '',
  PasswordChar: '\u25CF',
  PasswordRevealMode: 'Peek',
  MaxLength: 0,
  IsEnabled: true,
  CanPasteClipboardContent: true,
  InputScope: 'Password',
  SelectionFlyout: undefined,
  SelectionHighlightColor: '',
  TextReadingOrder: 'Default',
  PreventKeyboardDisplayOnProgrammaticFocus: false,
  Width: ''
});

const emit = defineEmits<{
  'update:Password': [value: string];
  PasswordChanging: [args: { cancel: boolean; password: string }];
  PasswordChanged: [args: { password: string }];
  GotFocus: [];
  LostFocus: [];
}>();

const password = ref(props.Password);
const isPeeking = ref(false);
const isToggledVisible = ref(false);

const rootStyle = computed<CSSProperties>(() => ({
  width: props.Width === '' ? undefined : typeof props.Width === 'number' ? `${props.Width}px` : props.Width
}));
const showRevealButton = computed(() => props.PasswordRevealMode !== 'Hidden' && password.value.length > 0);
const isPasswordVisible = computed(() => props.PasswordRevealMode === 'Visible' || isPeeking.value || isToggledVisible.value);
const visibleText = computed(() => isPasswordVisible.value ? password.value : props.PasswordChar.repeat(password.value.length));

const applyPassword = (value: string) => {
  const next = props.MaxLength > 0 ? value.slice(0, props.MaxLength) : value;
  const args = { cancel: false, password: next };
  emit('PasswordChanging', args);
  if (args.cancel) return;
  password.value = args.password;
  emit('update:Password', args.password);
  emit('PasswordChanged', { password: args.password });
};

const onVisibleTextChanged = (value: string) => {
  if (isPasswordVisible.value) {
    applyPassword(value);
    return;
  }

  if (value.length < password.value.length) {
    applyPassword(password.value.slice(0, value.length));
  } else if (value.length > password.value.length) {
    applyPassword(password.value + value.slice(password.value.length).replaceAll(props.PasswordChar, ''));
  }
};

const onPaste = (args: { handled: boolean; text: string }) => {
  if (!props.CanPasteClipboardContent) {
    args.handled = true;
  }
};

const peekPassword = () => {
  if (props.PasswordRevealMode === 'Peek') isPeeking.value = true;
};

const hidePeek = () => {
  if (props.PasswordRevealMode === 'Peek') isPeeking.value = false;
};

const toggleVisible = () => {
  if (props.PasswordRevealMode === 'Visible') return;
  if (props.PasswordRevealMode === 'Peek') return;
  isToggledVisible.value = !isToggledVisible.value;
};

watch(() => props.Password, (value) => {
  password.value = value ?? '';
});
</script>

<style scoped>
.win-password-box {
  display: inline-flex;
  min-width: 64px;
}

.win-password-textbox {
  width: 100%;
}

.win-password-reveal {
  display: grid;
  place-items: center;
}

.win-password-reveal span {
  font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", sans-serif;
  font-size: 12px;
}
</style>
