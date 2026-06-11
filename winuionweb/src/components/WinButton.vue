<template>
  <button class="win-btn" :class="{ primary, subtle, wrap }" :disabled="disabled">
    <slot></slot>
  </button>
</template>
<script setup>
defineProps({
  primary: Boolean,
  subtle: Boolean,
  disabled: Boolean,
  wrap: Boolean
});
</script>
<style>
  .win-btn {
    position: relative;
    border: none;
    border-radius: 4px;
    padding: 0 11px;
    font-size: 14px;
    height: 32px;
    background: var(--ctrl-fill-default);
    color: var(--text-primary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background var(--fast-duration) var(--fast-out-slow-in), color var(--fast-duration);
    user-select: none;
  }

    .win-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-bottom: 1px solid rgba(0, 0, 0, 0.16);
      pointer-events: none;
    }

    .win-btn:active::after {
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .win-btn.primary::after {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(0, 0, 0, 0.40);
    }

    .win-btn.primary:active::after {
      border-color: transparent;
    }

    .win-btn:hover {
      background: var(--ctrl-fill-secondary);
    }

    .win-btn:active {
      background: color-mix(in srgb, var(--ctrl-fill-tertiary) 100%, black 8%);
      color: var(--text-secondary);
    }

      .win-btn:active::after {
        border-bottom-color: var(--ctrl-border);
      }

    .win-btn.primary {
      background: var(--accent-base);
      color: var(--accent-text);
    }

      .win-btn.primary::after {
        border-color: var(--accent-border);
        border-bottom-color: var(--accent-border-accent);
      }

      .win-btn.primary:hover {
        background: var(--accent-hover);
      }

      .win-btn.primary:active {
        background: var(--accent-pressed);
        color: var(--accent-text-secondary);
      }

        .win-btn.primary:active::after {
          border-color: transparent;
        }

  .win-btn-hyperlink {
    background: transparent;
    border: none;
    color: var(--accent-base);
    height: auto;
    padding: 4px 8px;
  }

    .win-btn-hyperlink::after {
      display: none;
    }

    .win-btn-hyperlink:hover {
      background: var(--subtle-secondary);
      color: var(--accent-hover);
    }

    .win-btn-hyperlink:active {
      background: var(--subtle-tertiary);
      color: var(--accent-pressed);
    }

  html.theme-dark .win-btn::after {
    border: 1px solid rgba(255, 255, 255, 0.0075);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  html.theme-dark .win-btn:active::after {
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  html.theme-dark .win-btn.primary::after {
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  html.theme-dark .win-btn.primary:active::after {
    border-color: transparent;
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light) .win-btn::after {
      border: 1px solid rgba(255, 255, 255, 0.0075);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    html:not(.theme-light) .win-btn:active::after {
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }

    html:not(.theme-light) .win-btn.primary::after {
      border: 1px solid rgba(0, 0, 0, 0.14);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    html:not(.theme-light) .win-btn.primary:active::after {
      border-color: transparent;
    }
  }

  .win-btn:disabled {
    background: var(--ctrl-fill-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

    .win-btn:disabled::after {
      border-color: var(--ctrl-border);
      border-bottom-color: var(--ctrl-border);
    }

  .win-btn.subtle {
    background: transparent;
    border: none;
  }

    .win-btn.subtle::after {
      display: none;
    }

    .win-btn.subtle:hover {
      background: var(--subtle-secondary);
    }

    .win-btn.subtle:active {
      background: var(--subtle-tertiary);
      color: var(--text-secondary);
    }

    .win-btn.subtle:disabled {
      background: transparent;
      color: var(--text-disabled);
    }

  .win-btn {
    white-space: nowrap;
  }

    .win-btn.wrap {
      white-space: normal;
      height: auto;
      min-height: 32px;
      padding: 4px 11px;
    }
</style>
