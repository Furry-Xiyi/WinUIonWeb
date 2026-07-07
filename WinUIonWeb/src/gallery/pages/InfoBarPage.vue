<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">InfoBar</h1>
      <p class="page-description">
        Use an InfoBar control when a user should be informed of, acknowledge, or take action on a changed application state. By default the notification will remain in the content area until closed by the user but will not necessarily break user flow.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Closable InfoBar with severity options -->
    <WinControlExample
      headerText="A closable InfoBar with severity options"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <WinInfoBar
          :isOpen="example1IsOpen"
          title="Title"
          message="Essential app message for your users to be informed of, acknowledge, or take action on."
          :severity="example1Severity"
          @update:isOpen="example1IsOpen = $event" />
      </template>
      <template #options>
        <div class="options-container">
          <WinCheckBox
            v-model="example1IsOpen">
            Is Open
          </WinCheckBox>
          <WinComboBox
            v-model="example1Severity"
            :options="severityOptions"
            header="Severity"
            style="width: 100%;" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: InfoBar with message length and action button options -->
    <WinControlExample
      headerText="InfoBar with configurable message and action button"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <WinInfoBar
          :isOpen="example2IsOpen"
          title="Title"
          :message="example2Message"
          @update:isOpen="example2IsOpen = $event">
          <template v-if="example2ActionButton !== 'None'" #actionButton>
            <WinButton v-if="example2ActionButton === 'Button'" @click="onActionButtonClick">
              Action
            </WinButton>
            <WinHyperlinkButton
              v-else-if="example2ActionButton === 'Hyperlink'"
              navigateUri="http://www.microsoft.com/">
              Informational link
            </WinHyperlinkButton>
          </template>
        </WinInfoBar>

        <div class="options-container">
          <WinCheckBox
            v-model="example2IsOpen">
            Is Open
          </WinCheckBox>
          <WinComboBox
            v-model="example2MessageLength"
            :options="messageLengthOptions"
            header="Message Length"
            style="width: 100%;" />
          <WinComboBox
            v-model="example2ActionButton"
            :options="actionButtonOptions"
            header="Action Button"
            style="width: 100%;" />
        </div>
      </template>
    </WinControlExample>

    <!-- Example 3: InfoBar with display options -->
    <WinControlExample
      headerText="InfoBar with display options"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <WinInfoBar
          :isOpen="example3IsOpen"
          title="Title"
          message="Essential app message for your users to be informed of, acknowledge, or take action on."
          :isIconVisible="example3IsIconVisible"
          :isClosable="example3IsClosable"
          @update:isOpen="example3IsOpen = $event" />

        <div class="options-container">
          <WinCheckBox
            v-model="example3IsOpen">
            Is Open
          </WinCheckBox>
          <WinCheckBox
            v-model="example3IsIconVisible">
            Is Icon Visible
          </WinCheckBox>
          <WinCheckBox
            v-model="example3IsClosable">
            Is Closable
          </WinCheckBox>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinInfoBar from '../../components/WinInfoBar.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinHyperlinkButton from '../../components/WinHyperlinkButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'infobar');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// Example 1: Severity options
const example1IsOpen = ref(true);
const example1Severity = ref('Informational');
const severityOptions = ['Informational', 'Success', 'Warning', 'Error'];

const example1Template = `<WinInfoBar
  :isOpen="isOpen"
  title="Title"
  message="Essential app message for your users to be informed of, acknowledge, or take action on."
  :severity="severity"
  @update:isOpen="isOpen = $event" />`;

const example1Vue = `const isOpen = ref(true);
const severity = ref('Informational');`;

// Example 2: Message length and action button
const example2IsOpen = ref(true);
const example2MessageLength = ref('Long');
const example2ActionButton = ref('None');

const messageLengthOptions = ['Short', 'Long'];
const actionButtonOptions = ['None', 'Button', 'Hyperlink'];

const example2Message = computed(() => {
  if (example2MessageLength.value === 'Short') {
    return 'A short essential app message.';
  } else {
    return 'A long essential app message for your users to be informed of, acknowledge, or take action on. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus dolor vitae justo rutrum, ut lobortis nibh mattis. Aenean id elit commodo, semper felis nec.';
  }
});

const onActionButtonClick = () => {
  console.log('Action button clicked');
};

const example2Template = computed(() => {
  let template = `<WinInfoBar
  :isOpen="isOpen"
  title="Title"
  :message="message"
  @update:isOpen="isOpen = $event"`;

  if (example2ActionButton.value === 'Button') {
    template += `>
  <template #actionButton>
    <WinButton @click="onActionButtonClick">
      Action
    </WinButton>
  </template>
</WinInfoBar>`;
  } else if (example2ActionButton.value === 'Hyperlink') {
    template += `>
  <template #actionButton>
    <WinHyperlinkButton navigateUri="https://www.example.com">
      Informational link
    </WinHyperlinkButton>
  </template>
</WinInfoBar>`;
  } else {
    template += ` />`;
  }

  return template;
});

const example2Vue = computed(() => {
  let code = `const isOpen = ref(true);
const message = ref('${example2MessageLength.value === 'Short' ? 'A short essential app message.' : 'A long essential app message...'}');`;

  if (example2ActionButton.value === 'Button') {
    code += `

const onActionButtonClick = () => {
  console.log('Action button clicked');
};`;
  }

  return code;
});

// Example 3: Display options
const example3IsOpen = ref(true);
const example3IsIconVisible = ref(true);
const example3IsClosable = ref(true);

const example3Template = `<WinInfoBar
  :isOpen="isOpen"
  title="Title"
  message="Essential app message for your users to be informed of, acknowledge, or take action on."
  :isIconVisible="isIconVisible"
  :isClosable="isClosable"
  @update:isOpen="isOpen = $event" />`;

const example3Vue = `const isOpen = ref(true);
const isIconVisible = ref(true);
const isClosable = ref(true);`;
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 150px;
}
</style>
