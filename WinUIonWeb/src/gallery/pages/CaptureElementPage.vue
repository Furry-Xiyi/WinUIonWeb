<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" :Text="$t('text.capture-element-camera-preview')" />
        <TextBlock class="page-description" :Text="$t('text.capture-element-description')" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" v-bind="{ 'tooltipservice.tooltip': $t('sample.navigationview.change-theme') }" @Click="toggleTheme"><span class="icon">&#xE793;</span></Button>
          <ToggleButton :IsChecked="isFavoriteState" class="header-action" v-bind="{ 'tooltipservice.tooltip': isFavoriteState ? $t('sample.navigationview.remove-favorite') : $t('sample.navigationview.add-favorite') }" @update:IsChecked="toggleFavorite"><span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span></ToggleButton>
        </div>
      </div>

      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('sample.capture.preview')" :theme="pageTheme" :vue="captureCode">
          <template #example>
            <CaptureElement ref="captureRef" />
          </template>
          <template #options>
            <ToggleSwitch :IsOn="mirrorPreview" :Header="$t('sample.capture.mirror-preview')" v-bind="{ 'tooltipservice.tooltip': $t('sample.capture.mirror-tooltip') }" @update:IsOn="onMirrorChanged" />
            <Button @Click="capturePhoto">{{ $t('sample.capture.capture-photo') }}</Button>
          </template>
        </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import Button from '../../components/Button.vue';
import CaptureElement from '../../components/CaptureElement.vue';
import ControlExample from '../../components/ControlExample.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import ToggleSwitch from '../../components/ToggleSwitch.vue';
import { createPageState } from '../../utils/pageState';

const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'captureelement');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const captureRef = ref(null);
const mirrorPreview = ref(false);

const onMirrorChanged = (value) => {
  mirrorPreview.value = Boolean(value);
  captureRef.value?.SetMirrorPreview(mirrorPreview.value);
};
const capturePhoto = () => captureRef.value?.CapturePhoto();

onMounted(() => captureRef.value?.StartCaptureElement());

const captureCode = computed(() => `<Grid RowDefinitions="Auto,*" ColumnDefinitions="*,100" MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
  <TextBlock x:Name="frameSourceName" />
  <MediaPlayerElement x:Name="captureElement" Stretch="Uniform" AutoPlay="True" />
  <TextBlock x:Name="capturedText" Text="Captured:" Visibility="Collapsed" />
  <Grid Grid.Row="1" Grid.Column="1">
    <ScrollViewer VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto">
      <StackPanel Spacing="2" />
    </ScrollViewer>
  </Grid>
</Grid>`);
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 0 8px; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
</style>
