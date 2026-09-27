<template>
  <span ref="Element" v-bind="symbolAttrs" class="win-icon-element win-symbol-icon" :class="attrs.class" :style="[attrs.style, layoutStyle]">
    <Grid class="win-icon-grid" data-icon-part="LayoutRoot" Background="Transparent">
      <TextBlock class="win-icon-text-block win-symbol-icon-glyph" data-icon-part="TextBlock"
        Style="{x:Null}" Text="{x:Bind SymbolIconTemplateGlyph, Mode=OneWay}" FontFamily="{x:Bind SymbolIconTemplateFontFamily, Mode=OneWay}"
        FontSize="20" FontStyle="Normal" FontWeight="Normal"
        HorizontalAlignment="Stretch" VerticalAlignment="Center"
        TextAlignment="Center" IsTextScaleFactorEnabled="False" AutomationProperties.AccessibilityView="Raw"
        aria-hidden="true" />
    </Grid>
  </span>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, provide, useAttrs } from 'vue'
import { resolveSymbolGlyph } from './symbolGlyphs'
import { iconElementProps, iconFontFamily, useIconElement } from './iconElementRuntime'
import Grid from './Grid.vue'
import TextBlock from './TextBlock.vue'
import { xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  Symbol: { type: [String, Number], default: 'Emoji' },
  ...iconElementProps
})

const attrs = useAttrs()
const instance = getCurrentInstance()
const { Element, read, layoutStyle, rootAttrs, api } = useIconElement(props, attrs, instance, ['Symbol'])
const symbolAttrs = computed(() => Object.fromEntries(Object.entries(rootAttrs.value).filter(([name]) => name !== 'FontSize')))
const glyph = computed(() => resolveSymbolGlyph(read('Symbol')))
provide(xamlScopeKey, { SymbolIconTemplateGlyph: glyph, SymbolIconTemplateFontFamily: iconFontFamily('') })
defineExpose(api)
</script>

<style>
.win-symbol-icon-glyph {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', 'WinUIOnWebFontIcons';
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  text-size-adjust: none;
  -webkit-text-size-adjust: none;
}
</style>
