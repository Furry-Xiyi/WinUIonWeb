<template>
  <GridView ref="gridRef" class="gallery-items-grid" :class="{ 'is-single-row': singleRow, 'is-narrow-grid': narrow && !singleRow }"
            :style="hostStyle" ItemsSource="{x:Bind Items, Mode=OneWay}"
            Padding="{x:Bind GridPadding, Mode=OneWay}"
            SelectionMode="None" IsItemClickEnabled="True" IsSwipeEnabled="False"
            ScrollViewer.VerticalScrollMode="{x:Bind VerticalScrollMode, Mode=OneWay}"
            ScrollViewer.VerticalScrollBarVisibility="{x:Bind VerticalScrollBarVisibility, Mode=OneWay}"
            ScrollViewer.HorizontalScrollMode="Disabled" ScrollViewer.HorizontalScrollBarVisibility="Disabled"
            ItemClick="OnItemClick" AutomationProperties.Name="{x:Bind AccessibleName, Mode=OneWay}">
    <GridView.ItemContainerStyle>
      <Style TargetType="GridViewItem">
        <Setter Property="Margin" Value="{x:Bind ItemMargin, Mode=OneWay}" />
        <Setter Property="CornerRadius" Value="8" />
        <Setter Property="HorizontalContentAlignment" Value="{x:Bind ItemContentAlignment, Mode=OneWay}" />
      </Style>
    </GridView.ItemContainerStyle>
    <GridView.ItemsPanel>
      <ItemsPanelTemplate>
        <ItemsWrapGrid Orientation="Horizontal" MaximumRowsOrColumns="{x:Bind MaximumColumns, Mode=OneWay}" />
      </ItemsPanelTemplate>
    </GridView.ItemsPanel>
    <GridView.ItemTemplate>
      <DataTemplate x:DataType="models:ControlInfoDataItem">
        <Grid class="gallery-control-item" Width="{x:Bind CardWidth, Mode=OneWay}"
              Height="{x:Bind CardHeight, Mode=OneWay}" Padding="8" HorizontalAlignment="Stretch"
              Background="{ThemeResource ControlFillColorDefaultBrush}"
              BorderBrush="{ThemeResource CardStrokeColorDefaultBrush}" BorderThickness="1" CornerRadius="8">
          <Grid>
            <Grid.ColumnDefinitions>
              <ColumnDefinition Width="Auto" />
              <ColumnDefinition Width="*" />
              <ColumnDefinition Width="Auto" />
            </Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
              <RowDefinition Height="Auto" />
              <RowDefinition Height="*" />
            </Grid.RowDefinitions>
            <Image Grid.RowSpan="2" Width="32" Margin="8,12,16,0" VerticalAlignment="Top"
                   Source="{x:Bind ImagePath}" Stretch="Uniform" AutomationProperties.Name="{x:Bind Title}" />
            <TextBlock class="gallery-control-item-title" Grid.Column="1" Margin="0,12,0,0" VerticalAlignment="Bottom"
                       Style="{StaticResource BodyStrongTextBlockStyle}" Text="{x:Bind Title}"
                       TextLineBounds="TrimToCapHeight" TextWrapping="NoWrap" />
            <TextBlock class="gallery-control-item-subtitle" Grid.Row="1" Grid.Column="1" Foreground="{ThemeResource TextFillColorSecondaryBrush}"
                       Style="{StaticResource CaptionTextBlockStyle}" Text="{x:Bind Subtitle}"
                       TextWrapping="Wrap" TextTrimming="WordEllipsis"
                       MaxHeight="{x:Bind DescriptionMaxHeight, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Subtitle}" />
          </Grid>
        </Grid>
      </DataTemplate>
    </GridView.ItemTemplate>
  </GridView>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GridView from '../../components/GridView.vue';
import TextBlock from '../../components/TextBlock.vue';
import { resolveXamlHandler, resolveXamlValue, xamlScopeKey } from '../../components/xamlRuntime';
import type { GalleryItem } from '../data/galleryCatalog';
import { getLastGalleryItem, rememberGalleryItem } from '../data/galleryFocus';
import { pendingRouteNavigationCompletion } from '../../components/frameNavigationRuntime';

defineOptions({ inheritAttrs: true });
const props = defineProps({
  ItemsSource: { type: [Array, String], default: () => [] },
  Padding: { type: [String, Number], default: '0,0,0,10' },
  SingleRow: { type: [Boolean, String], default: false },
  IsScrollEnabled: { type: [Boolean, String], default: false },
  AccessibleName: { type: String, default: '' },
  Visibility: { type: String, default: 'Visible' },
  ItemClick: { type: [String, Function], default: undefined }
});
const instance = getCurrentInstance();
const route = useRoute();
const gridRef = ref<{ $el: HTMLElement } | null>(null);
const emit = defineEmits(['ItemClick']);
const read = (name: keyof typeof props) => resolveXamlValue(props[name], instance);
const Items = computed(() => read('ItemsSource') as GalleryItem[]);
const GridPadding = computed(() => read('Padding'));
const AccessibleName = computed(() => read('AccessibleName'));
const singleRow = computed(() => read('SingleRow') === true);
const hostStyle = computed(() => ({ display: read('Visibility') === 'Collapsed' ? 'none' : undefined,
  width: singleRow.value ? 'max-content' : '100%', height: read('IsScrollEnabled') === true ? '100%' : undefined }));
const narrow = ref(window.innerWidth < 641);
const query = window.matchMedia('(max-width: 640px)');
const updateWidth = () => { narrow.value = query.matches; };
let restoreFrame = 0;
let descriptionObserver: ResizeObserver | null = null;
let isMounted = false;
const descriptionHeight = ref(0);
const measureDescription = () => {
  const card = gridRef.value?.$el.querySelector<HTMLElement>('.gallery-control-item');
  const subtitle = card?.querySelector<HTMLElement>('.gallery-control-item-subtitle');
  if (!card || !subtitle || !card.getClientRects().length) return;
  const style = getComputedStyle(card);
  const height = card.getBoundingClientRect().bottom - subtitle.getBoundingClientRect().top
    - Number.parseFloat(style.paddingBottom) - Number.parseFloat(style.borderBottomWidth);
  if (height > 0 && Math.abs(descriptionHeight.value - height) > .25) descriptionHeight.value = height;
};
const observeDescription = async () => {
  await nextTick();
  if (!isMounted) return;
  descriptionObserver?.disconnect();
  if (gridRef.value?.$el) descriptionObserver?.observe(gridRef.value.$el);
  const title = gridRef.value?.$el.querySelector<HTMLElement>('.gallery-control-item-title');
  if (title) descriptionObserver?.observe(title);
  measureDescription();
};
onMounted(async () => {
  isMounted = true;
  descriptionObserver = new ResizeObserver(measureDescription);
  await observeDescription();
  document.fonts.ready.then(() => { if (isMounted) measureDescription(); });
  query.addEventListener('change', updateWidth);
  await nextTick();
  await pendingRouteNavigationCompletion();
  if (!isMounted) return;
  restoreFrame = requestAnimationFrame(() => {
    const id = getLastGalleryItem(String(route.name));
    const index = Items.value.findIndex(item => item.UniqueId === id);
    const card = gridRef.value?.$el.querySelectorAll<HTMLElement>('.win-grid-item')[index];
    if (!card || !card.getClientRects().length) return;
    card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    card.focus({ preventScroll: true });
  });
});
onBeforeUnmount(() => { isMounted = false; descriptionObserver?.disconnect(); query.removeEventListener('change', updateWidth); cancelAnimationFrame(restoreFrame); });
const CardWidth = computed(() => narrow.value ? 'Auto' : 300);
const CardHeight = computed(() => narrow.value ? 120 : 96);
const DescriptionMaxHeight = computed(() => descriptionHeight.value || CardHeight.value - 50);
watch([Items, CardHeight], () => { descriptionHeight.value = 0; if (isMounted) void observeDescription(); });
const ItemMargin = computed(() => singleRow.value ? '0,0,12,0' : narrow.value ? '0,0,0,12' : '0,0,12,12');
const ItemContentAlignment = computed(() => narrow.value && !singleRow.value ? 'Stretch' : 'Center');
const MaximumColumns = computed(() => singleRow.value ? Math.max(1, Items.value.length) : 0);
const VerticalScrollMode = computed(() => read('IsScrollEnabled') === true ? 'Enabled' : 'Disabled');
const VerticalScrollBarVisibility = computed(() => read('IsScrollEnabled') === true ? 'Auto' : 'Disabled');
const OnItemClick = (sender: unknown, args: { ClickedItem: GalleryItem }) => {
  rememberGalleryItem(String(route.name), args.ClickedItem.UniqueId);
  emit('ItemClick', sender, args);
  resolveXamlHandler(props.ItemClick, instance)?.(sender, args);
};
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Items, GridPadding, AccessibleName,
  CardWidth, CardHeight, DescriptionMaxHeight, ItemMargin, ItemContentAlignment, MaximumColumns, VerticalScrollMode, VerticalScrollBarVisibility, OnItemClick });
</script>

<style scoped>
.gallery-items-grid { min-width: 0; max-width: 100%; --GridViewItemCornerRadius: 8px; }
.gallery-items-grid :deep(.win-grid-item) { flex: 0 0 auto; }
.gallery-items-grid :deep(.grid-item-inner) { width: 100%; min-width: 0; }
.gallery-items-grid.is-narrow-grid :deep(.gallery-control-item) { width: 100%; }
.gallery-items-grid.is-narrow-grid :deep(.win-grid-item) { width: 100%; }
.gallery-items-grid.is-single-row { max-width: none; }
.gallery-control-item { max-width: 100%; overflow: hidden; }
.gallery-items-grid :deep(.win-grid-view-content) { min-width: 0; }
</style>
