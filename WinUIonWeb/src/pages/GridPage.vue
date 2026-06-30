<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">Grid</h1>
      <p class="page-description">
        The Grid is a layout panel that supports arranging child elements in rows and columns.
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

    <!-- Example 1: A 3x3 Grid control -->
    <WinControlExample
      headerText="A 3x3 Grid control"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue">
      <template #example>
        <div
          :style="{
            width: '240px',
            height: '160px',
            display: 'grid',
            gridTemplateColumns: '50px 50px 50px',
            gridTemplateRows: '50px 50px 50px',
            columnGap: `${columnSpacing}px`,
            rowGap: `${rowSpacing}px`,
            backgroundColor: 'gray',
            padding: '0'
          }">
          <div
            :style="{
              gridColumn: `${redBlockColumn + 1}`,
              gridRow: `${redBlockRow + 1}`,
              width: '50px',
              height: '50px',
              backgroundColor: 'red'
            }">
          </div>
          <div
            :style="{
              gridColumn: '1',
              gridRow: '2',
              width: '50px',
              height: '50px',
              backgroundColor: 'blue'
            }">
          </div>
          <div
            :style="{
              gridColumn: '2',
              gridRow: '1',
              width: '50px',
              height: '50px',
              backgroundColor: 'green'
            }">
          </div>
          <div
            :style="{
              gridColumn: '2',
              gridRow: '2',
              width: '50px',
              height: '50px',
              backgroundColor: 'yellow'
            }">
          </div>
        </div>
      </template>
      <template #options>
        <div style="display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto auto auto; column-gap: 12px; row-gap: 12px;">
          <div style="grid-column: 1; grid-row: 1;">
            <p style="margin: 0; font-weight: 600;">Grid</p>
          </div>
          <WinSlider
            v-model="columnSpacing"
            header="ColumnSpacing"
            :minimum="0"
            :maximum="16"
            :stepFrequency="1"
            :tickFrequency="1"
            snapsTo="Ticks"
            style="grid-column: 1; grid-row: 2; margin-left: 16px;" />
          <WinSlider
            v-model="rowSpacing"
            header="RowSpacing"
            :minimum="0"
            :maximum="16"
            :stepFrequency="1"
            :tickFrequency="1"
            snapsTo="Ticks"
            orientation="Vertical"
            :isDirectionReversed="true"
            style="grid-column: 2; grid-row: 2; height: 100px; align-self: start;" />
          <div style="grid-column: 1; grid-row: 3;">
            <p style="margin: 0; font-weight: 600;">Red block</p>
          </div>
          <WinSlider
            v-model="redBlockColumn"
            header="Grid.Column"
            :minimum="0"
            :maximum="2"
            :stepFrequency="1"
            :tickFrequency="1"
            snapsTo="Ticks"
            style="grid-column: 1; grid-row: 4; margin-left: 16px;" />
          <WinSlider
            v-model="redBlockRow"
            header="Grid.Row"
            :minimum="0"
            :maximum="2"
            :stepFrequency="1"
            :tickFrequency="1"
            snapsTo="Ticks"
            orientation="Vertical"
            :isDirectionReversed="true"
            style="grid-column: 2; grid-row: 4; height: 100px; align-self: start;" />
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WinButton from '../components/WinButton.vue'
import WinToggleButton from '../components/WinToggleButton.vue'
import WinControlExample from '../components/WinControlExample.vue'
import WinSlider from '../components/WinSlider.vue'

// Theme management
const pageTheme = ref('light')
const toggleTheme = () => {
  pageTheme.value = pageTheme.value === 'light' ? 'dark' : 'light'
}

// Favorite management
const isFavoriteState = ref(false)
const toggleFavorite = (value) => {
  console.log('Favorite toggled:', value)
}

// Example 1: 3x3 Grid
const columnSpacing = ref(8)
const rowSpacing = ref(8)
const redBlockColumn = ref(0)
const redBlockRow = ref(0)

// Code examples
const example1Template = `<div
  :style="{
    width: '240px',
    height: '160px',
    display: 'grid',
    gridTemplateColumns: '50px 50px 50px',
    gridTemplateRows: '50px 50px 50px',
    columnGap: '${columnSpacing}px',
    rowGap: '${rowSpacing}px',
    backgroundColor: 'gray'
  }">
  <div
    :style="{
      gridColumn: '${redBlockColumn + 1}',
      gridRow: '${redBlockRow + 1}',
      width: '50px',
      height: '50px',
      backgroundColor: 'red'
    }">
  </div>
  <div
    :style="{
      gridColumn: '1',
      gridRow: '2',
      width: '50px',
      height: '50px',
      backgroundColor: 'blue'
    }">
  </div>
  <div
    :style="{
      gridColumn: '2',
      gridRow: '1',
      width: '50px',
      height: '50px',
      backgroundColor: 'green'
    }">
  </div>
  <div
    :style="{
      gridColumn: '2',
      gridRow: '2',
      width: '50px',
      height: '50px',
      backgroundColor: 'yellow'
    }">
  </div>
</div>`

const example1Vue = `<script setup>
import { ref } from 'vue'

const columnSpacing = ref(8)
const rowSpacing = ref(8)
const redBlockColumn = ref(0)
const redBlockRow = ref(0)
<\/script>`
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #605e5c;
  margin: 0 0 24px 0;
  line-height: 20px;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe MDL2 Assets';
  font-size: 16px;
}
</style>
