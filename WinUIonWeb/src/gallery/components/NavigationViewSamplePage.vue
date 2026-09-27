<template>
  <ContentOutlet />
</template>
<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import SamplePage1 from './navigationview/SamplePage1.vue'
import SamplePage2 from './navigationview/SamplePage2.vue'
import SamplePage3 from './navigationview/SamplePage3.vue'
import SamplePage4 from './navigationview/SamplePage4.vue'
import SamplePage5 from './navigationview/SamplePage5.vue'
import SamplePage6 from './navigationview/SamplePage6.vue'
import SamplePage7 from './navigationview/SamplePage7.vue'
import SampleSettingsPage from './navigationview/SampleSettingsPage.vue'
import { createEntranceNavigationTransitionInfo } from '../../utils/navigationTransitionInfo'
const props = defineProps({
  Page: { type: String, default: 'SamplePage1' },
  NavigationVersion: { type: Number, default: 0 },
  NavigationTransitionInfo: { type: Object, default: () => createEntranceNavigationTransitionInfo() }
})
const pages = { SamplePage1, SamplePage2, SamplePage3, SamplePage4, SamplePage5, SamplePage6, SamplePage7, SampleSettingsPage }
const samplePage = computed(() => pages[props.Page as keyof typeof pages] ?? SamplePage1)
const ContentOutlet = defineComponent({ setup() {
  return () => h('div', { class: 'navigationview-sample-page-host' }, [h(samplePage.value)])
} })
</script>
<style scoped>
.navigationview-sample-page-host { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
</style>
