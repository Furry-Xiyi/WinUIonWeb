/// <reference types="vite/client" />

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, string | number | boolean | null | undefined>) => string
  }
}

export {}
