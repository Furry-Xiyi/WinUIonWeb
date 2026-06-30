<template>
  <div class="typography-row" :class="{ 'has-background': background }">
    <div class="row-content">
      <div class="example-cell">
        <span class="example-text" :class="styleClass">{{ example }}</span>
      </div>
      <div class="font-cell">
        <span class="cell-text">{{ variableFont }}</span>
      </div>
      <div class="size-cell">
        <span class="cell-text">{{ sizeLineHeight }}</span>
      </div>
      <div class="style-cell">
        <span class="resource-text">{{ resourceName }}</span>
        <button class="copy-button" @click="copyToClipboard" :aria-label="`Copy ${resourceName}`">
          <span class="icon">📋</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  example: { type: String, required: true },
  variableFont: { type: String, required: true },
  sizeLineHeight: { type: String, required: true },
  resourceName: { type: String, required: true },
  styleClass: { type: String, required: true },
  background: { type: Boolean, default: false }
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.resourceName);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
.typography-row {
  min-height: 68px;
  background: transparent;
  transition: background 0.2s;
}

.typography-row.has-background {
  background: var(--card-bg-default);
  border-radius: 4px;
}

.row-content {
  display: grid;
  grid-template-columns: 272px 136px 112px 194px auto;
  gap: 0;
  padding: 12px 0;
  align-items: center;
}

.example-cell {
  padding-left: 16px;
}

.example-text {
  color: var(--text-primary);
}

/* Typography styles matching WinUI */
.example-text.caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.example-text.body {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.example-text.body-strong {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.example-text.body-large {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.example-text.body-large-strong {
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.example-text.subtitle {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.example-text.title {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}

.example-text.title-large {
  font-size: 40px;
  font-weight: 600;
  line-height: 52px;
}

.example-text.display {
  font-size: 68px;
  font-weight: 600;
  line-height: 92px;
}

.cell-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--text-primary);
}

.style-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-text {
  font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 16px;
  color: var(--text-primary);
  user-select: text;
}

.copy-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  margin-left: 4px;
}

.copy-button:hover {
  background: var(--ctrl-fill-secondary);
}

.copy-button:active {
  background: var(--ctrl-fill-tertiary);
}

.copy-button .icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .row-content {
    grid-template-columns: 200px 120px 100px 150px auto;
  }

  .example-text.display {
    font-size: 48px;
    line-height: 64px;
  }

  .example-text.title-large {
    font-size: 32px;
    line-height: 42px;
  }

  .example-text.title {
    font-size: 24px;
    line-height: 32px;
  }
}
</style>
