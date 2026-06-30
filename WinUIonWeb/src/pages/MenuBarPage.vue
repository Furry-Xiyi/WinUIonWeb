<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">MenuBar</h1>
      <p class="page-description">
        The MenuBar simplifies the creation of basic menu systems for apps. It works out of the box with little customization, supports keyboard accelerators, and automatically adjusts UI for different input types and devices.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model="isFavoriteState"
          subtle
          @update:modelValue="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Simple MenuBar -->
    <WinControlExample
      headerText="A simple MenuBar"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div style="width: 100%;">
          <WinMenuBar
            :items="example1Items"
            @itemClick="onExample1ItemClick" />
        </div>
      </template>
      <template #options>
        <p class="output-text">{{ example1Output }}</p>
      </template>
    </WinControlExample>

    <!-- Example 2: MenuBar with Keyboard Accelerators -->
    <WinControlExample
      headerText="MenuBar with keyboard accelerators"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="width: 100%;">
          <WinMenuBar
            :items="example2Items"
            @itemClick="onExample2ItemClick" />
        </div>

        <p class="output-text">{{ example2Output }}</p>
      </template>
    </WinControlExample>

    <!-- Example 3: MenuBar with Submenus, Separators, and Radio Items -->
    <WinControlExample
      headerText="MenuBar with submenus, separators, and radio items"
      :theme="pageTheme"
      :templateCode="example3Template"
      :vueCode="example3Vue">
      <template #example>
        <div style="width: 100%;">
          <WinMenuBar
            :items="example3Items"
            @itemClick="onExample3ItemClick" />
        </div>

        <p class="output-text">{{ example3Output }}</p>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import WinMenuBar from '../components/WinMenuBar.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menubar');

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

// Example 1: Simple MenuBar
const example1Output = ref('');

const example1Items = [
  {
    title: 'File',
    items: [
      { text: 'New' },
      { text: 'Open' },
      { text: 'Save' },
      { text: 'Exit' }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo' },
      { text: 'Cut' },
      { text: 'Copy' },
      { text: 'Paste' }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About' }
    ]
  }
];

const onExample1ItemClick = ({ item }) => {
  example1Output.value = `You clicked: ${item.text}`;
};

const example1Template = `<WinMenuBar
  :items="menuItems"
  @itemClick="onItemClick" />`;

const example1Vue = `const menuItems = [
  {
    title: 'File',
    items: [
      { text: 'New' },
      { text: 'Open' },
      { text: 'Save' },
      { text: 'Exit' }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo' },
      { text: 'Cut' },
      { text: 'Copy' },
      { text: 'Paste' }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About' }
    ]
  }
];

const onItemClick = ({ item }) => {
  console.log(\`You clicked: \${item.text}\`);
};`;

// Example 2: MenuBar with Keyboard Accelerators
const example2Output = ref('');

const example2Items = [
  {
    title: 'File',
    items: [
      { text: 'New', keyboardAccelerator: { key: 'N', modifiers: ['Control'] } },
      { text: 'Open', keyboardAccelerator: { key: 'O', modifiers: ['Control'] } },
      { text: 'Save', keyboardAccelerator: { key: 'S', modifiers: ['Control'] } },
      { text: 'Exit', keyboardAccelerator: { key: 'E', modifiers: ['Control'] } }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo', keyboardAccelerator: { key: 'Z', modifiers: ['Control'] } },
      { text: 'Cut', keyboardAccelerator: { key: 'X', modifiers: ['Control'] } },
      { text: 'Copy', keyboardAccelerator: { key: 'C', modifiers: ['Control'] } },
      { text: 'Paste', keyboardAccelerator: { key: 'V', modifiers: ['Control'] } }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About', keyboardAccelerator: { key: 'I', modifiers: ['Control'] } }
    ]
  }
];

const onExample2ItemClick = ({ item }) => {
  example2Output.value = `You clicked: ${item.text}`;
};

const example2Template = `<WinMenuBar
  :items="menuItems"
  @itemClick="onItemClick" />`;

const example2Vue = `const menuItems = [
  {
    title: 'File',
    items: [
      { text: 'New', keyboardAccelerator: { key: 'N', modifiers: ['Control'] } },
      { text: 'Open', keyboardAccelerator: { key: 'O', modifiers: ['Control'] } },
      { text: 'Save', keyboardAccelerator: { key: 'S', modifiers: ['Control'] } },
      { text: 'Exit', keyboardAccelerator: { key: 'E', modifiers: ['Control'] } }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo', keyboardAccelerator: { key: 'Z', modifiers: ['Control'] } },
      { text: 'Cut', keyboardAccelerator: { key: 'X', modifiers: ['Control'] } },
      { text: 'Copy', keyboardAccelerator: { key: 'C', modifiers: ['Control'] } },
      { text: 'Paste', keyboardAccelerator: { key: 'V', modifiers: ['Control'] } }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About', keyboardAccelerator: { key: 'I', modifiers: ['Control'] } }
    ]
  }
];

const onItemClick = ({ item }) => {
  console.log(\`You clicked: \${item.text}\`);
};`;

// Example 3: MenuBar with Submenus, Separators, and Radio Items
const example3Output = ref('');

const example3Items = ref([
  {
    title: 'File',
    items: [
      {
        type: 'submenu',
        text: 'New',
        items: [
          { text: 'Plain Text Document' },
          { text: 'Rich Text Document' },
          { text: 'Other Formats' }
        ]
      },
      { text: 'Open' },
      { text: 'Save' },
      { type: 'separator' },
      { text: 'Exit' }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo' },
      { text: 'Cut' },
      { text: 'Copy' },
      { text: 'Paste' }
    ]
  },
  {
    title: 'View',
    items: [
      { text: 'Output' },
      { type: 'separator' },
      { type: 'radio', text: 'Landscape', groupName: 'OrientationGroup', isChecked: false },
      { type: 'radio', text: 'Portrait', groupName: 'OrientationGroup', isChecked: true },
      { type: 'separator' },
      { type: 'radio', text: 'Small icons', groupName: 'SizeGroup', isChecked: false },
      { type: 'radio', text: 'Medium icons', groupName: 'SizeGroup', isChecked: true },
      { type: 'radio', text: 'Large icons', groupName: 'SizeGroup', isChecked: false }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About' }
    ]
  }
]);

const onExample3ItemClick = ({ item }) => {
  example3Output.value = `You clicked: ${item.text}`;
};

const example3Template = `<WinMenuBar
  :items="menuItems"
  @itemClick="onItemClick" />`;

const example3Vue = `const menuItems = ref([
  {
    title: 'File',
    items: [
      {
        type: 'submenu',
        text: 'New',
        items: [
          { text: 'Plain Text Document' },
          { text: 'Rich Text Document' },
          { text: 'Other Formats' }
        ]
      },
      { text: 'Open' },
      { text: 'Save' },
      { type: 'separator' },
      { text: 'Exit' }
    ]
  },
  {
    title: 'Edit',
    items: [
      { text: 'Undo' },
      { text: 'Cut' },
      { text: 'Copy' },
      { text: 'Paste' }
    ]
  },
  {
    title: 'View',
    items: [
      { text: 'Output' },
      { type: 'separator' },
      { type: 'radio', text: 'Landscape', groupName: 'OrientationGroup', isChecked: false },
      { type: 'radio', text: 'Portrait', groupName: 'OrientationGroup', isChecked: true },
      { type: 'separator' },
      { type: 'radio', text: 'Small icons', groupName: 'SizeGroup', isChecked: false },
      { type: 'radio', text: 'Medium icons', groupName: 'SizeGroup', isChecked: true },
      { type: 'radio', text: 'Large icons', groupName: 'SizeGroup', isChecked: false }
    ]
  },
  {
    title: 'Help',
    items: [
      { text: 'About' }
    ]
  }
]);

const onItemClick = ({ item }) => {
  console.log(\`You clicked: \${item.text}\`);
};`;
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

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
