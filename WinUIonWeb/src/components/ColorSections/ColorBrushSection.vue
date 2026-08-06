<template>
  <div class="color-brush-section">
    <div v-for="brush in brushes" :key="brush.variable" class="color-brush-card">
      <span class="color-brush-swatch" :style="{ backgroundColor: `var(${brush.variable})` }"></span>
      <div class="color-brush-copy">
        <span class="color-brush-name">{{ brush.name }}</span>
        <code class="color-brush-variable">{{ brush.variable }}</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ brushes: { name: string; variable: string }[] }>();
</script>

<style scoped>
.color-brush-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
  margin-top: 16px;
}

.color-brush-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--card-stroke);
  border-radius: 8px;
  background: var(--card-bg-secondary);
}

.color-brush-swatch {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border: 1px solid var(--card-stroke);
  border-radius: 6px;
}

.color-brush-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.color-brush-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
}

.color-brush-variable {
  font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
