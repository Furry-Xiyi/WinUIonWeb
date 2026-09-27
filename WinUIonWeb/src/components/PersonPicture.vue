<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    class="win-person-picture"
    :class="attrs.class"
    :style="[attrs.style, rootStyle]"
    :data-person-picture-state="commonState"
    :data-person-picture-badge-state="badgeState"
    role="img"
    :aria-label="automationLabel"
    :aria-disabled="!isEnabled || undefined"
    :tabindex="isTabStop ? 0 : undefined">
    <Grid x:Name="RootGrid" class="win-person-picture-root" Width="{x:Bind Template.Size, Mode=OneWay}" Height="{x:Bind Template.Size, Mode=OneWay}">
      <Ellipse
        class="win-person-picture-ellipse"
        Fill="{x:Bind Template.Background, Mode=OneWay}"
        Stroke="{x:Bind Template.BorderBrush, Mode=OneWay}"
        StrokeThickness="{x:Bind Template.BorderThickness, Mode=OneWay}"
        Width="{x:Bind Template.Size, Mode=OneWay}"
        Height="{x:Bind Template.Size, Mode=OneWay}" />
      <TextBlock
        x:Name="InitialsTextBlock"
        class="win-person-picture-initials"
        AutomationProperties.AccessibilityView="Raw"
        Text="{x:Bind Template.DisplayedText, Mode=OneWay}"
        FontSize="{x:Bind Template.InitialsFontSize, Mode=OneWay}"
        FontFamily="{x:Bind Template.FontFamily, Mode=OneWay}"
        FontWeight="{x:Bind Template.FontWeight, Mode=OneWay}"
        Foreground="{x:Bind Template.Foreground, Mode=OneWay}"
        TextLineBounds="Tight"
        IsTextScaleFactorEnabled="False"
        VerticalAlignment="Center"
        HorizontalAlignment="Center" />
      <Ellipse
        v-if="commonState === 'Photo'"
        x:Name="PersonPictureEllipse"
        class="win-person-picture-photo-ellipse"
        Fill="{x:Bind Template.PhotoFill, Mode=OneWay}"
        Width="{x:Bind Template.Size, Mode=OneWay}"
        Height="{x:Bind Template.Size, Mode=OneWay}"
        FlowDirection="LeftToRight" />
      <Grid
        x:Name="BadgeGrid"
        class="win-person-picture-badge-grid"
        Visibility="{x:Bind Template.BadgeVisibility, Mode=OneWay}"
        Width="{x:Bind Template.BadgeSize, Mode=OneWay}"
        Height="{x:Bind Template.BadgeSize, Mode=OneWay}"
        VerticalAlignment="Top"
        HorizontalAlignment="Right"
        Margin="{ThemeResource PersonPictureBadgeGridMargin}">
        <Ellipse
          x:Name="BadgingBackgroundEllipse"
          Opacity="{ThemeResource PersonPictureEllipseBadgeStrokeOpacity}"
          Fill="{ThemeResource PersonPictureEllipseBadgeFillThemeBrush}"
          Stroke="{ThemeResource PersonPictureEllipseBadgeStrokeThemeBrush}"
          StrokeThickness="{ThemeResource PersonPictureEllipseBadgeStrokeThickness}"
          Width="{x:Bind Template.BadgeSize, Mode=OneWay}"
          Height="{x:Bind Template.BadgeSize, Mode=OneWay}" />
        <Ellipse
          x:Name="BadgingEllipse"
          class="win-person-picture-badge-image-ellipse"
          Fill="{x:Bind Template.BadgeImageBrush, Mode=OneWay}"
          Opacity="{x:Bind Template.BadgeImageOpacity, Mode=OneWay}"
          Width="{x:Bind Template.BadgeSize, Mode=OneWay}"
          Height="{x:Bind Template.BadgeSize, Mode=OneWay}"
          FlowDirection="LeftToRight" />
        <TextBlock
          x:Name="BadgeNumberTextBlock"
          class="win-person-picture-badge-number"
          AutomationProperties.AccessibilityView="Raw"
          Visibility="{x:Bind Template.BadgeNumberVisibility, Mode=OneWay}"
          Text="{x:Bind Template.BadgeNumberText, Mode=OneWay}"
          FontSize="{x:Bind Template.BadgeFontSize, Mode=OneWay}"
          FontFamily="{x:Bind Template.ContentFontFamily, Mode=OneWay}"
          FontWeight="{x:Bind Template.FontWeight, Mode=OneWay}"
          Foreground="{ThemeResource PersonPictureEllipseBadgeForegroundThemeBrush}"
          TextLineBounds="Tight"
          IsTextScaleFactorEnabled="False"
          VerticalAlignment="Center"
          HorizontalAlignment="Center" />
        <FontIcon
          x:Name="BadgeGlyphIcon"
          class="win-person-picture-badge-glyph"
          AutomationProperties.AccessibilityView="Raw"
          Glyph="{x:Bind Template.BadgeGlyph, Mode=OneWay}"
          FontSize="{x:Bind Template.BadgeFontSize, Mode=OneWay}"
          Foreground="{ThemeResource PersonPictureEllipseBadgeForegroundThemeBrush}"
          FontFamily="{ThemeResource SymbolThemeFontFamily}"
          FontWeight="{x:Bind Template.FontWeight, Mode=OneWay}"
          VerticalAlignment="Center"
          HorizontalAlignment="Center" />
      </Grid>
    </Grid>
    <SourceOutlet />
  </div>
</template>

<script lang="ts">
import { PersonPictureProfilePicture, PersonPictureBadgeImageSource } from './personPictureProperties'
export { PersonPictureProfilePicture, PersonPictureBadgeImageSource }
export default { ProfilePicture: PersonPictureProfilePicture, BadgeImageSource: PersonPictureBadgeImageSource }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, reactive, ref, shallowRef, useAttrs, useSlots, watch, type VNode } from 'vue'
import Ellipse from './Ellipse.vue'
import FontIcon from './FontIcon.vue'
import Grid from './Grid.vue'
import TextBlock from './TextBlock.vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { alignment, cssLength } from './layout'
import { createImageSourceModel, imageUri, type ImageSourceRegistration } from './imageSource'
import { useI18n } from './i18n/index'
import { initialsFromContactObject, initialsFromDisplayName } from './personPictureInitials'
import { personPictureSourceKey } from './personPictureProperties'
import { xamlResourceDictionaryKey } from './Page.vue'
import { normalizeXamlNodes, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  BadgeNumber: { type: [String, Number], default: 0 },
  BadgeGlyph: { type: String, default: '' },
  BadgeImageSource: { type: [String, Object], default: null },
  BadgeText: { type: String, default: '' },
  IsGroup: { type: [Boolean, String], default: false },
  Contact: { type: [Object, String], default: null },
  DisplayName: { type: String, default: '' },
  Initials: { type: String, default: '' },
  PreferSmallImage: { type: [Boolean, String], default: false },
  ProfilePicture: { type: [String, Object], default: null },
  Width: { type: [String, Number], default: 96 },
  Height: { type: [String, Number], default: 96 },
  Foreground: { type: String, default: '{ThemeResource PersonPictureForegroundThemeBrush}' },
  Background: { type: String, default: '{ThemeResource PersonPictureEllipseFillThemeBrush}' },
  BorderBrush: { type: String, default: '{ThemeResource PersonPictureEllipseFillStrokeBrush}' },
  BorderThickness: { type: [String, Number], default: '{ThemeResource PersonPictureEllipseStrokeThickness}' },
  FontFamily: { type: String, default: '{ThemeResource ContentControlThemeFontFamily}' },
  FontWeight: { type: [String, Number], default: 'SemiBold' },
  IsTabStop: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  IsHitTestVisible: { type: [Boolean, String], default: true },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Margin: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 },
  MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Visibility: { type: String, default: 'Visible' },
  Opacity: { type: [String, Number], default: 1 }
})
const emit = defineEmits([
  'update:BadgeNumber', 'update:BadgeGlyph', 'update:BadgeImageSource', 'update:BadgeText', 'update:IsGroup',
  'update:Contact', 'update:DisplayName', 'update:Initials', 'update:PreferSmallImage', 'update:ProfilePicture',
  'update:Width', 'update:Height', 'update:Foreground', 'update:Background', 'update:BorderBrush', 'update:BorderThickness',
  'update:FontFamily', 'update:FontWeight', 'update:IsTabStop', 'update:IsEnabled', 'update:IsHitTestVisible',
  'update:HorizontalAlignment', 'update:VerticalAlignment', 'update:Margin', 'update:MinWidth', 'update:MinHeight',
  'update:MaxWidth', 'update:MaxHeight', 'update:Visibility', 'update:Opacity'
])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
// Template part names belong to the control template, not the owning page.
provide(xamlNameScopeKey, reactive<Record<string, unknown>>({}))
const overrides = reactive<Record<string, unknown>>({})
const raw = (name: keyof typeof props) => name in overrides ? overrides[name] : props[name]
const value = (input: unknown) => resolveXamlValue(input, instance)
const read = (name: keyof typeof props) => value(raw(name))
const boolean = (input: unknown) => input === true || input === 'True'
const publicProperties = Object.keys(props) as (keyof typeof props)[]
const dimensionRevisions = reactive({ Width: 0, Height: 0 })
for (const name of publicProperties) watch(() => props[name], () => { delete overrides[name] })
const property = (name: keyof typeof props) => computed({
  get: () => read(name),
  set: next => {
    overrides[name] = next
    if (name === 'Width' || name === 'Height') dimensionRevisions[name] += 1
    updateXamlBinding(props[name], next, instance)
    emit(`update:${name}`, next)
  }
})
const profilePicture = computed({ get: () => explicitProfileSource.value || null, set: next => { property('ProfilePicture').value = next } })
const badgeImage = computed({ get: () => explicitBadgeSource.value || null, set: next => { property('BadgeImageSource').value = next } })
const contact = computed(() => {
  const input = read('Contact')
  return input && typeof input === 'object' ? input as Record<string, unknown> : null
})
const displayName = computed(() => String(read('DisplayName') ?? ''))
const initials = computed(() => String(read('Initials') ?? ''))
const isGroup = computed(() => boolean(read('IsGroup')))
const isEnabled = computed(() => boolean(read('IsEnabled')))
const isTabStop = computed(() => boolean(read('IsTabStop')))
const badgeNumber = computed(() => { const number = Number(read('BadgeNumber')); return Number.isFinite(number) ? Math.trunc(number) : 0 })
const badgeGlyph = computed(() => String(read('BadgeGlyph') ?? ''))
const actualInitials = computed(() => initials.value || initialsFromDisplayName(displayName.value) || initialsFromContactObject(contact.value))
const hasInitials = computed(() => Boolean(actualInitials.value))

const sourceRegistrations = {
  ProfilePicture: shallowRef<ImageSourceRegistration | null>(null),
  BadgeImageSource: shallowRef<ImageSourceRegistration | null>(null)
}
provide(personPictureSourceKey, {
  register: (name: 'ProfilePicture' | 'BadgeImageSource', registration: ImageSourceRegistration | null) => { sourceRegistrations[name].value = registration }
})
const sourceResource = (input: unknown) => {
  const key = typeof input === 'string' ? input.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1] : undefined
  return key ? resolveXamlResourceObject(key, instance) ?? resources?.[key] : undefined
}
const sourceModel = (input: unknown): unknown => {
  const resource = sourceResource(input)
  if (isVNode(resource)) return ''
  const resolved = resource ?? value(input)
  if (resolved && typeof resolved === 'object') return resolved
  return typeof resolved === 'string' ? resolved : ''
}
const SourceOutlet = defineComponent({
  name: 'PersonPictureImageSources',
  setup: () => () => {
    const nodes = (slots.default?.() ?? []).filter(node => {
      const name = (node.type as { __personPictureSourceProperty?: string })?.__personPictureSourceProperty
      return !name || !(name in overrides)
    })
    for (const [name, input] of [['ProfilePicture', raw('ProfilePicture')], ['BadgeImageSource', raw('BadgeImageSource')]] as const) {
      const resource = sourceResource(input)
      if (isVNode(resource)) {
        const wrapper = name === 'ProfilePicture' ? PersonPictureProfilePicture : PersonPictureBadgeImageSource
        nodes.push(h(wrapper, null, { default: () => [cloneVNode(resource)] }))
      }
    }
    return h(Fragment, normalizeXamlNodes(nodes, instance))
  }
})
const explicitProfileSource = computed(() => 'ProfilePicture' in overrides ? sourceModel(raw('ProfilePicture')) : sourceRegistrations.ProfilePicture.value?.model ?? sourceModel(raw('ProfilePicture')))
const explicitBadgeSource = computed(() => 'BadgeImageSource' in overrides ? sourceModel(raw('BadgeImageSource')) : sourceRegistrations.BadgeImageSource.value?.model ?? sourceModel(raw('BadgeImageSource')))
const uriOf = (input: unknown) => {
  if (input && typeof input === 'object') return imageUri((input as Record<string, unknown>).UriSource, instance, resources)
  return imageUri(input, instance, resources)
}

const contactImage = shallowRef<unknown>(null)
let loadGeneration = 0
let imageLoader: HTMLImageElement | null = null
const cancelContactImage = () => {
  loadGeneration += 1
  if (imageLoader) { imageLoader.onload = null; imageLoader.onerror = null; imageLoader.removeAttribute('src'); imageLoader = null }
}
const contactCandidate = computed(() => {
  const person = contact.value
  if (!person) return null
  if (boolean(read('PreferSmallImage')) && person.SmallDisplayPicture) return person.SmallDisplayPicture
  return person.LargeDisplayPicture || person.SmallDisplayPicture || person.SourceDisplayPicture || person.Thumbnail || null
})
let previousContactId: unknown
let previousContact: Record<string, unknown> | null = null
const loadContactImage = () => {
  cancelContactImage()
  const generation = loadGeneration
  const currentContact = contact.value
  const currentId = currentContact?.Id
  const sameContact = Boolean(previousContact && currentContact && (previousContactId || currentId) && previousContactId === currentId)
  previousContact = currentContact
  previousContactId = currentId
  if (!sameContact) contactImage.value = null
  const source = contactCandidate.value
  const uri = uriOf(source)
  if (!uri || typeof window === 'undefined') { contactImage.value = uri ? source : null; return }
  // A changed contact cancels the earlier load, as OpenReadAsync does in WinUI.
  const loader = new window.Image()
  imageLoader = loader
  loader.onload = () => {
    if (generation !== loadGeneration) return
    const bitmap = createImageSourceModel()
    bitmap.UriSource = uri
    bitmap.DecodePixelType = 'Logical'
    if (loader.naturalHeight < loader.naturalWidth) bitmap.DecodePixelHeight = size.value
    else bitmap.DecodePixelWidth = size.value
    bitmap.__state.pixelWidth = loader.naturalWidth
    bitmap.__state.pixelHeight = loader.naturalHeight
    contactImage.value = bitmap
    imageLoader = null
  }
  loader.onerror = () => { if (generation === loadGeneration) imageLoader = null }
  loader.src = uri
}
// PreferSmallImage is consulted on a Contact update. Its own property callback
// intentionally has no load action in PersonPicture.cpp.
watch(contact, loadContactImage, { immediate: true, deep: true })
const actualProfileSource = computed(() => uriOf(explicitProfileSource.value) ? explicitProfileSource.value : contactImage.value)
const hasPhoto = computed(() => Boolean(uriOf(actualProfileSource.value)))
const commonState = computed(() => isGroup.value ? 'Group' : hasPhoto.value ? 'Photo' : hasInitials.value ? 'Initials' : 'NoPhotoOrInitials')
const badgeKind = computed(() => uriOf(explicitBadgeSource.value) ? 'image' : badgeNumber.value !== 0 ? badgeNumber.value > 0 ? 'number' : 'none' : badgeGlyph.value ? 'glyph' : 'none')
const badgeState = computed(() => badgeKind.value === 'none' ? 'NoBadge' : badgeKind.value === 'image' ? 'BadgeWithImageSource' : 'BadgeWithoutImageSource')
const badgeNumberText = computed(() => badgeNumber.value > 99 ? '99+' : String(badgeNumber.value))

const finiteDimension = (input: unknown): number | undefined => {
  const resolved = value(input)
  if (resolved === '' || resolved === undefined || resolved === null || resolved === 'Auto') return undefined
  const number = Number(resolved)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}
// The first SizeChanged starts at 0 x 0, so both dimensions change even when
// only one is set in XAML. Match WinUI by taking the smaller layout dimension.
const requestedSize = ref(Math.min(finiteDimension(props.Width) ?? 96, finiteDimension(props.Height) ?? 96))
const size = computed(() => {
  const minimum = Math.max(finiteDimension(raw('MinWidth')) ?? 0, finiteDimension(raw('MinHeight')) ?? 0)
  const maximum = Math.min(finiteDimension(raw('MaxWidth')) ?? Infinity, finiteDimension(raw('MaxHeight')) ?? Infinity)
  return Math.max(minimum, Math.min(requestedSize.value, maximum))
})
watch([() => finiteDimension(raw('Width')), () => finiteDimension(raw('Height')), () => dimensionRevisions.Width, () => dimensionRevisions.Height], ([width, height, widthRevision, heightRevision], [oldWidth, oldHeight, oldWidthRevision, oldHeightRevision]) => {
  const widthChanged = width !== oldWidth || widthRevision !== oldWidthRevision
  const heightChanged = height !== oldHeight || heightRevision !== oldHeightRevision
  const next = widthChanged && heightChanged ? Math.min(width ?? size.value, height ?? size.value) : widthChanged ? width : height
  if (next !== undefined) requestedSize.value = next
})
const actualWidth = ref(size.value)
const actualHeight = ref(size.value)
let observer: ResizeObserver | null = null
onMounted(() => {
  if (!root.value) return
  const measure = () => {
    if (!root.value) return
    const width = root.value.getBoundingClientRect().width
    const height = root.value.getBoundingClientRect().height
    actualWidth.value = width
    actualHeight.value = height
    if (width !== height && width > 0 && height > 0) requestedSize.value = Math.min(width, height)
  }
  measure()
  if (typeof ResizeObserver !== 'undefined') { observer = new ResizeObserver(measure); observer.observe(root.value) }
})
onBeforeUnmount(() => { cancelContactImage(); observer?.disconnect(); observer = null })
const contentFontFamily = computed(() => String(read('FontFamily') || 'var(--ContentControlThemeFontFamily)'))
const fontWeight = computed(() => ({ SemiBold: '600', Normal: '400', Bold: '700', Light: '300' } as Record<string, string>)[String(read('FontWeight'))] ?? String(read('FontWeight')))
const templateSettings = computed(() => ({
  ActualInitials: actualInitials.value,
  ActualImageBrush: hasPhoto.value ? { ImageSource: actualProfileSource.value, Stretch: 'UniformToFill' } : null
}))
const template = reactive({
  get Size() { return size.value },
  get BadgeSize() { return size.value * .5 },
  get InitialsFontSize() { return Math.max(1, size.value * .42) },
  get BadgeFontSize() { return Math.max(1, size.value * .3) },
  get Background() { return read('Background') },
  get BorderBrush() { return read('BorderBrush') },
  get BorderThickness() { return read('BorderThickness') },
  get Foreground() { return read('Foreground') },
  get ContentFontFamily() { return contentFontFamily.value },
  get FontFamily() { return commonState.value === 'Group' || commonState.value === 'NoPhotoOrInitials' ? 'var(--SymbolThemeFontFamily)' : contentFontFamily.value },
  get FontWeight() { return fontWeight.value },
  get DisplayedText() { return commonState.value === 'Group' ? '\uE716' : commonState.value === 'NoPhotoOrInitials' ? '\uE77B' : actualInitials.value },
  get PhotoFill() { return templateSettings.value.ActualImageBrush },
  get BadgeImageBrush() { return badgeKind.value === 'image' ? { ImageSource: explicitBadgeSource.value, Stretch: 'UniformToFill' } : null },
  get BadgeImageOpacity() { return badgeKind.value === 'image' ? value('{ThemeResource PersonPictureEllipseBadgeImageSourceStrokeOpacity}') : 0 },
  get BadgeVisibility() { return badgeKind.value === 'none' ? 'Collapsed' : 'Visible' },
  get BadgeNumberVisibility() { return badgeKind.value === 'number' ? 'Visible' : 'Collapsed' },
  get BadgeNumberText() { return badgeNumberText.value },
  get BadgeGlyph() { return badgeKind.value === 'glyph' ? badgeGlyph.value : '' }
})
provide(xamlScopeKey, { Template: template })
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'AutomationProperties.Name', 'AutomationProperties.AccessibilityView'].includes(name))))
const rootStyle = computed(() => {
  const layout = frameworkLayoutStyle(Object.fromEntries(publicProperties.map(name => [name, raw(name)])), instance)
  delete layout.background; delete layout.borderColor; delete layout.borderWidth
  return {
    ...layout, width: cssLength(size.value), height: cssLength(size.value), flex: '0 0 auto',
    color: String(read('Foreground') || ''), fontFamily: contentFontFamily.value, fontWeight: fontWeight.value,
    justifySelf: alignment(read('HorizontalAlignment'), 'horizontal'), alignSelf: alignment(read('VerticalAlignment'), 'vertical'),
    visibility: read('Visibility') === 'Hidden' ? 'hidden' : undefined,
    pointerEvents: boolean(read('IsHitTestVisible')) ? undefined : 'none'
  }
})
const automationLabel = computed(() => {
  const explicitName = value(attrs['AutomationProperties.Name'])
  if (explicitName) return String(explicitName)
  const name = isGroup.value ? t('control.personpicture.group') : String(contact.value?.DisplayName || displayName.value || initials.value || t('control.personpicture.person'))
  const text = String(read('BadgeText') ?? '')
  if (badgeNumber.value > 0) return t(text ? 'control.personpicture.badge-items-text' : badgeNumber.value === 1 ? 'control.personpicture.badge-item' : 'control.personpicture.badge-items', { name, count: badgeNumber.value, text })
  if (badgeGlyph.value || uriOf(explicitBadgeSource.value)) return t(text ? 'control.personpicture.badge-icon-text' : 'control.personpicture.badge-icon', { name, text })
  return name
})
defineExpose({
  ...Object.fromEntries(publicProperties.map(name => [name, property(name)])),
  BadgeNumber: property('BadgeNumber'), BadgeGlyph: property('BadgeGlyph'), BadgeImageSource: badgeImage, BadgeText: property('BadgeText'),
  IsGroup: property('IsGroup'), Contact: property('Contact'), DisplayName: property('DisplayName'), Initials: property('Initials'),
  PreferSmallImage: property('PreferSmallImage'), ProfilePicture: profilePicture,
  Width: computed({ get: () => size.value, set: next => { property('Width').value = next } }),
  Height: computed({ get: () => size.value, set: next => { property('Height').value = next } }),
  ActualWidth: actualWidth, ActualHeight: actualHeight, TemplateSettings: templateSettings
})
</script>

<style>
.win-person-picture { position: relative; display: inline-grid; box-sizing: border-box; min-width: 0; min-height: 0; isolation: isolate; user-select: none; }
.win-person-picture .win-person-picture-root { justify-content: stretch; align-content: stretch; }
.win-person-picture .win-person-picture-initials { line-height: 1; white-space: nowrap; max-width: 100%; overflow: hidden; font-synthesis: none; }
.win-person-picture-photo-ellipse, .win-person-picture-badge-image-ellipse { overflow: hidden; border-radius: 50%; align-self: stretch; justify-self: stretch; }
.win-person-picture .win-image-host { pointer-events: none; }
.win-person-picture .win-person-picture-badge-grid { justify-content: stretch; align-content: stretch; }
.win-person-picture .win-person-picture-badge-number { line-height: 1; white-space: nowrap; }
.win-person-picture .win-person-picture-badge-glyph { font-family: var(--SymbolThemeFontFamily); }
</style>
