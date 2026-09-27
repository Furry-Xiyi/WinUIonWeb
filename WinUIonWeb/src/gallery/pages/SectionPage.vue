<template>
  <Grid class="gallery-section-page">
    <Grid.RowDefinitions>
      <RowDefinition Height="Auto" />
      <RowDefinition Height="*" />
    </Grid.RowDefinitions>
    <TextBlock class="gallery-section-title" Text="{x:Bind Title, Mode=OneWay}"
               Margin="{x:Bind TitleMargin, Mode=OneWay}" Style="{StaticResource TitleTextBlockStyle}"
               TextWrapping="Wrap" AutomationProperties.HeadingLevel="Level1" />
    <GalleryItemsGrid Grid.Row="1" ItemsSource="{x:Bind Items, Mode=OneWay}"
                      Padding="{x:Bind GridPadding, Mode=OneWay}" IsScrollEnabled="True"
                      AccessibleName="{x:Bind Title, Mode=OneWay}" ItemClick="OnItemGridViewItemClick" />
  </Grid>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import TextBlock from '../../components/TextBlock.vue';
import { useI18n } from '../../components/i18n';
import { xamlScopeKey } from '../../components/xamlRuntime';
import GalleryItemsGrid from '../components/GalleryItemsGrid.vue';
import { getGalleryGroups, type GalleryItem } from '../data/galleryCatalog';

const { t } = useI18n();
const route = useRoute();
const navigate = inject<(tag: string) => unknown>('navigate', () => {});
const groups = getGalleryGroups(t);
const group = computed(() => groups.find(item => item.UniqueId === route.name));
const Title = computed(() => group.value?.Title ?? '');
const Items = computed(() => group.value?.Items ?? []);
const query = window.matchMedia('(max-width: 640px)');
const narrow = ref(query.matches);
const updateWidth = () => { narrow.value = query.matches; };
onMounted(() => query.addEventListener('change', updateWidth));
onBeforeUnmount(() => query.removeEventListener('change', updateWidth));
const TitleMargin = computed(() => narrow.value ? '24,24,16,24' : '36,24,16,24');
const GridPadding = computed(() => narrow.value ? '16,0,16,36' : '36,0,36,0');
const OnItemGridViewItemClick = (_sender: unknown, args: { ClickedItem: GalleryItem }) => {
  if (args.ClickedItem?.UniqueId) navigate(args.ClickedItem.UniqueId);
};
provide(xamlScopeKey, { Title, Items, TitleMargin, GridPadding, OnItemGridViewItemClick });
</script>

<style scoped>
.gallery-section-page { width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.gallery-section-title { min-width: 0; overflow-wrap: anywhere; }
</style>
