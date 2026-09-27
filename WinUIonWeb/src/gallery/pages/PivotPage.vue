<template>
  <Page>
    <ScrollViewer
      class="gallery-page-scroll"
      VerticalScrollBarVisibility="Auto"
      VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <TextBlock
          MaxWidth="1064"
          HorizontalAlignment="Left"
          Margin="0,4,24,0"
          Style="{ThemeResource BodyTextBlockStyle}"
          Text="{x:Bind pageDescription, Mode=OneWay}"
          TextWrapping="WrapWholeWords" />

        <StackPanel class="gallery-page-content" MaxWidth="1028" HorizontalAlignment="Left">
          <ControlExample
            Margin="0,0,24,0"
            HeaderText="{x:Bind basicHeader, Mode=OneWay}"
            Theme="{x:Bind pageTheme, Mode=OneWay}"
            Xaml="{x:Bind basicXaml, Mode=OneWay}">
            <ControlExample.Example>
              <Pivot
                Title="{x:Bind emailTitle, Mode=OneWay}"
                MinHeight="400">
                <PivotItem Header="{x:Bind allHeader, Mode=OneWay}">
                  <TextBlock Text="{x:Bind allContent, Mode=OneWay}" />
                </PivotItem>
                <PivotItem Header="{x:Bind unreadHeader, Mode=OneWay}">
                  <TextBlock Text="{x:Bind unreadContent, Mode=OneWay}" />
                </PivotItem>
                <PivotItem Header="{x:Bind flaggedHeader, Mode=OneWay}">
                  <TextBlock Text="{x:Bind flaggedContent, Mode=OneWay}" />
                </PivotItem>
                <PivotItem Header="{x:Bind urgentHeader, Mode=OneWay}">
                  <TextBlock Text="{x:Bind urgentContent, Mode=OneWay}" />
                </PivotItem>
              </Pivot>
            </ControlExample.Example>
          </ControlExample>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup>
import { computed, inject } from 'vue'
import ControlExample from '../../components/ControlExample.vue'
import Page from '../../components/Page.vue'
import Pivot from '../../components/Pivot.vue'
import PivotItem from '../../components/PivotItem.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import TextBlock from '../../components/TextBlock.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'

const { t } = useI18n()
const currentPage = inject('currentPage')
const pageKey = computed(() => currentPage?.value || 'pivot')
const { pageTheme } = createPageState(pageKey.value)

const pageDescription = computed(() => t('text.pivot-description'))
const basicHeader = computed(() => t('sample.pivot.basic'))
const emailTitle = computed(() => t('sample.pivot.email'))
const allHeader = computed(() => t('sample.pivot.all'))
const allContent = computed(() => t('sample.pivot.all-content'))
const unreadHeader = computed(() => t('sample.pivot.unread'))
const unreadContent = computed(() => t('sample.pivot.unread-content'))
const flaggedHeader = computed(() => t('sample.pivot.flagged'))
const flaggedContent = computed(() => t('sample.pivot.flagged-content'))
const urgentHeader = computed(() => t('sample.pivot.urgent'))
const urgentContent = computed(() => t('sample.pivot.urgent-content'))

const escapeXaml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const basicXaml = computed(() => `<Pivot Title="${escapeXaml(emailTitle.value)}">
    <PivotItem Header="${escapeXaml(allHeader.value)}">
        <TextBlock Text="${escapeXaml(allContent.value)}" />
    </PivotItem>
    <PivotItem Header="${escapeXaml(unreadHeader.value)}">
        <TextBlock Text="${escapeXaml(unreadContent.value)}" />
    </PivotItem>
    <PivotItem Header="${escapeXaml(flaggedHeader.value)}">
        <TextBlock Text="${escapeXaml(flaggedContent.value)}" />
    </PivotItem>
    <PivotItem Header="${escapeXaml(urgentHeader.value)}">
        <TextBlock Text="${escapeXaml(urgentContent.value)}" />
    </PivotItem>
</Pivot>`)
</script>
