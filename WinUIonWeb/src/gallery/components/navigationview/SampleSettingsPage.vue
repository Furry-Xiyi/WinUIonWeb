<template>
  <Page Ignorable="d">
    <Grid>
      <TextBlock HorizontalAlignment="Center" VerticalAlignment="Center" Style="{StaticResource TitleTextBlockStyle}" Text="{x:Bind settingsPageText, Mode=OneWay}" />
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Ellipse from '../../../components/Ellipse.vue'
import Grid from '../../../components/Grid.vue'
import Page from '../../../components/Page.vue'
import ScrollViewer from '../../../components/ScrollViewer.vue'
import StackPanel from '../../../components/StackPanel.vue'
import TextBlock from '../../../components/TextBlock.vue'
import { useI18n } from '../../../components/i18n/index'
const { t } = useI18n()
const titleText = computed(() => t('sample.navigationview.lorem-title'))
const bodyText = computed(() => t('sample.navigationview.lorem-body'))
const shortBodyText = computed(() => t('sample.navigationview.lorem-short-body'))
const settingsPageText = computed(() => t('sample.navigationview.settings-page'))
</script>
<style scoped>
.sample-page-scroll { width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.sample-content-grid { width: 100%; min-width: 0; max-width: 100%; height: 100%; }
</style>
