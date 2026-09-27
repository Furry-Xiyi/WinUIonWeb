<template>
  <pre class="win-sample-code code-block" :class="{ 'is-inline': sampleType === 'Inline' }" :data-code-theme="theme"><code><span v-for="(token, index) in tokens" :key="index" :data-syntax="token.scope || undefined">{{ token.text }}</span></code></pre>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, unref } from 'vue';
import { resolveXamlValue } from './xamlRuntime';
import { xamlThemeKey } from './brushCore';
import { tokenizeSampleCode } from './sampleCodeSyntax';
const props = defineProps({ Code: { type: String, default: '' }, SampleType: { type: String, default: 'XAML' } });
const instance = getCurrentInstance();
const code = computed(() => String(resolveXamlValue(props.Code,instance) ?? ''));
const sampleType = computed(() => String(resolveXamlValue(props.SampleType, instance) ?? 'XAML'));
const inheritedTheme = inject(xamlThemeKey, null);
const theme = computed(() => unref(inheritedTheme) ?? undefined);
const tokens = computed(() => tokenizeSampleCode(code.value, sampleType.value));
</script>
<style scoped>
.win-sample-code {
  margin: 0;
  white-space: pre;
  font: 14px/normal Consolas, "Cascadia Code", monospace;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  tab-size: 2;
  user-select: text;
  -webkit-user-select: text;
  --sample-code-xmlName: #a31515;
  --sample-code-xmlAttribute: #ff0000;
  --sample-code-xmlAttributeQuotes: #000000;
  --sample-code-xmlAttributeValue: #0000ff;
  --sample-code-xmlDelimiter: #0000ff;
  --sample-code-htmlComment: #008000;
  --sample-code-xmlCDataSection: #808080;
  --sample-code-keyword: #0000ff;
  --sample-code-string: #a31515;
  --sample-code-comment: #008000;
  --sample-code-xmlDocTag: #808080;
  --sample-code-xmlDocComment: #008000;
  --sample-code-number: inherit;
}
.win-sample-code code,
.win-sample-code span {
  user-select: text;
  -webkit-user-select: text;
}
.win-sample-code > code { font: inherit; }
/* ColorCode DefaultDark plus SampleCodePresenter's Gallery XML overrides. */
.win-sample-code[data-code-theme="dark"],
:global(html.theme-dark) .win-sample-code:not([data-code-theme]) {
  --sample-code-xmlName: #5f82e8;
  --sample-code-xmlAttribute: #87cefa;
  --sample-code-xmlAttributeQuotes: #ffa07a;
  --sample-code-xmlAttributeValue: #ffa07a;
  --sample-code-xmlDelimiter: #808080;
  --sample-code-htmlComment: #6b8e23;
  --sample-code-xmlCDataSection: #c0d088;
  --sample-code-keyword: #569cd6;
  --sample-code-string: #d69d85;
  --sample-code-comment: #57a64a;
  --sample-code-xmlDocTag: #608b4e;
  --sample-code-xmlDocComment: #608b4e;
  --sample-code-number: #b5cea8;
}
[data-syntax="xmlName"] { color: var(--sample-code-xmlName); }
[data-syntax="xmlAttribute"] { color: var(--sample-code-xmlAttribute); }
[data-syntax="xmlAttributeQuotes"] { color: var(--sample-code-xmlAttributeQuotes); }
[data-syntax="xmlAttributeValue"] { color: var(--sample-code-xmlAttributeValue); }
[data-syntax="xmlDelimiter"] { color: var(--sample-code-xmlDelimiter); }
[data-syntax="htmlComment"] { color: var(--sample-code-htmlComment); }
[data-syntax="xmlCDataSection"] { color: var(--sample-code-xmlCDataSection); }
[data-syntax="keyword"], [data-syntax="preprocessorKeyword"] { color: var(--sample-code-keyword); }
[data-syntax="string"], [data-syntax="stringCSharpVerbatim"] { color: var(--sample-code-string); }
[data-syntax="comment"] { color: var(--sample-code-comment); }
[data-syntax="xmlDocTag"] { color: var(--sample-code-xmlDocTag); }
[data-syntax="xmlDocComment"] { color: var(--sample-code-xmlDocComment); }
[data-syntax="number"] { color: var(--sample-code-number); }
.is-inline { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
