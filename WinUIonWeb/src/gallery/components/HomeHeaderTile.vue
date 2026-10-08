<template>
  <UserControl class="win-home-header-tile" Width="232" Height="172">
    <Grid class="win-home-header-tile-surface" CornerRadius="8"
          Background="{ThemeResource AcrylicBackgroundFillColorDefaultBrush}"
          BorderBrush="{ThemeResource SurfaceStrokeColorFlyoutBrush}">
      <HyperlinkButton class="win-home-header-tile-link" Padding="-1" CornerRadius="{StaticResource OverlayCornerRadius}"
                       HorizontalAlignment="Stretch" VerticalAlignment="Stretch"
                       HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch"
                       AutomationProperties.Name="{x:Bind TileTitle, Mode=OneWay}"
                       NavigateUri="{x:Bind TileLink, Mode=OneWay}" TargetName="_blank">
        <Grid Padding="24" RowSpacing="16" VerticalAlignment="Stretch" class="win-home-header-tile-content">
          <Grid.RowDefinitions>
            <RowDefinition Height="36" />
            <RowDefinition Height="*" />
          </Grid.RowDefinitions>
          <FontIcon Grid.RowSpan="3" Margin="-12" HorizontalAlignment="Right" VerticalAlignment="Bottom"
                    class="win-home-header-tile-open-icon" Glyph="&#xE8A7;" FontSize="14"
                    Foreground="{ThemeResource TextFillColorSecondaryBrush}" />
          <ContentPresenter class="win-home-header-tile-source" HorizontalAlignment="Left" VerticalAlignment="Top"
                            Content="{x:Bind TileSource, Mode=OneWay}" />
          <StackPanel Grid.Row="1" Spacing="4">
            <TextBlock class="win-home-header-tile-title" Text="{x:Bind TileTitle, Mode=OneWay}"
                       Foreground="{ThemeResource TextFillColorPrimaryBrush}"
                       Style="{StaticResource BodyStrongTextBlockStyle}" TextWrapping="Wrap" />
            <TextBlock class="win-home-header-tile-description" Text="{x:Bind TileDescription, Mode=OneWay}"
                       Style="{StaticResource CaptionTextBlockStyle}"
                       Foreground="{ThemeResource TextFillColorSecondaryBrush}" TextWrapping="Wrap" />
          </StackPanel>
        </Grid>
      </HyperlinkButton>
    </Grid>
  </UserControl>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const Source = defineComponent({ name: 'HomeHeaderTile.Source', __galleryTileProperty: 'Source', setup: () => () => null });
export default { Source };
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, inject, provide, shallowRef, useSlots, watch } from 'vue';
import ContentPresenter from '../../components/ContentPresenter.vue';
import Grid from '../../components/Grid.vue';
import FontIcon from '../../components/FontIcon.vue';
import HyperlinkButton from '../../components/HyperlinkButton.vue';
import TextBlock from '../../components/TextBlock.vue';
import UserControl from '../../components/UserControl';
import { getVNodeChildren } from '../../components/CollectionProperties';
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlScopeKey } from '../../components/xamlRuntime';

const props = defineProps({ Title: { type: String, default: '' }, Description: { type: String, default: '' },
  Link: { type: String, default: '' }, Source: { type: null, default: undefined } });
const instance = getCurrentInstance(), slots = useSlots();
const property = (name: keyof typeof props) => {
  const bound = computed(() => resolveXamlValue(props[name], instance));
  const local = shallowRef<unknown>(undefined);
  watch(bound, () => { local.value = undefined; });
  return computed({ get: () => local.value !== undefined ? local.value : bound.value,
    set: value => { local.value = value; updateXamlBinding(props[name], value, instance); } });
};
const TileTitle = property('Title'), TileDescription = property('Description'), TileLink = property('Link');
const SourceOutlet = defineComponent({
  setup() {
    return () => {
      const property = slots.default?.().find(node => (node.type as { __galleryTileProperty?: string }).__galleryTileProperty === 'Source');
      return h(Fragment, normalizeXamlNodes(property ? getVNodeChildren(property) : [], instance));
    };
  }
});
const SourceProperty = property('Source');
const TileSource = computed({ get: () => SourceProperty.value === undefined ? h(SourceOutlet) : SourceProperty.value,
  set: value => { SourceProperty.value = value; } });
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), TileTitle, TileDescription, TileLink, TileSource });
defineExpose({ Title: TileTitle, Description: TileDescription, Link: TileLink, Source: TileSource });
</script>

<style scoped>
.win-home-header-tile {
  position: relative; flex: 0 0 232px; box-sizing: border-box; overflow: hidden;
  --HyperlinkButtonBorderBrush: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  --HyperlinkButtonBorderBrushPointerOver: var(--ControlStrokeColorSecondaryBrush, var(--ctrl-border));
  --HyperlinkButtonBorderBrushPressed: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
  --HyperlinkButtonBorderBrushDisabled: var(--ControlStrokeColorDefaultBrush, var(--ctrl-border));
}
.win-home-header-tile-link { width: 100%; height: 100%; white-space: normal; }
.win-home-header-tile-surface { min-width: 0; min-height: 0; overflow: hidden; }
.win-home-header-tile :deep(.win-hyperlink-content-presenter) { height: 100%; padding: 0; }
.win-home-header-tile-content { position: relative; width: 100%; height: 100%; min-width: 0; min-height: 0; text-align: left; }
.win-home-header-tile-source { width: 36px; height: 36px; overflow: hidden; }
.win-home-header-tile-source :deep(.win-image-host), .win-home-header-tile-source :deep(.win-viewbox) { width: 36px; height: 36px; }
.win-home-header-tile-title { line-height: 20px; }
.win-home-header-tile-description { line-height: 16px; }
.win-home-header-tile-open-icon { pointer-events: none; }
</style>
