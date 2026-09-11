<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind $t('text.contentdialog'), Mode=OneWay}" />
        <TextBlock class="page-description" Text="{x:Bind $t('text.use-a-contentdialog-to-show-relevant-information'), Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions"><Button class="header-action" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button><ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" class="header-action" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton></div>
      </div>
      <div class="gallery-page-content">
        <ControlExample HeaderText="{x:Bind $t('text.a-basic-content-dialog-with-content'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind basicCode, Mode=OneWay}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><Button Click="ShowDialog_Click" Content="{x:Bind $t('text.show-dialog'), Mode=OneWay}" /><TextBlock class="output-text" Text="{x:Bind dialogResult, Mode=OneWay}" /></StackPanel></ControlExample.Example>
        </ControlExample>
        <ControlExample HeaderText="{x:Bind $t('sample.contentdialog.no-default'), Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Vue="{x:Bind noDefaultCode, Mode=OneWay}">
          <ControlExample.Example><StackPanel Orientation="Horizontal"><Button Click="ShowDialogNoDefault_Click" Content="{x:Bind $t('sample.contentdialog.show-no-default'), Mode=OneWay}" /><TextBlock class="output-text" Text="{x:Bind dialogResultNoDefault, Mode=OneWay}" /></StackPanel></ControlExample.Example>
        </ControlExample>
        <ContentDialog IsOpen="{x:Bind showDialog, Mode=TwoWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Title="{x:Bind $t('sample.contentdialog.save-title'), Mode=OneWay}" PrimaryButtonText="{x:Bind $t('sample.contentdialog.save'), Mode=OneWay}" SecondaryButtonText="{x:Bind $t('sample.contentdialog.dont-save'), Mode=OneWay}" CloseButtonText="{x:Bind $t('sample.contentdialog.cancel'), Mode=OneWay}" DefaultButton="Primary" PrimaryButtonClick="OnPrimarySave" SecondaryButtonClick="OnSecondarySave" CloseButtonClick="OnCancel"><StackPanel Spacing="12"><TextBlock Text="{x:Bind $t('sample.contentdialog.body'), Mode=OneWay}" TextWrapping="WrapWholeWords" /><CheckBox Content="{x:Bind $t('sample.contentdialog.upload'), Mode=OneWay}" /></StackPanel></ContentDialog>
        <ContentDialog IsOpen="{x:Bind showDialogNoDefault, Mode=TwoWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Title="{x:Bind $t('sample.contentdialog.replace-title'), Mode=OneWay}" PrimaryButtonText="{x:Bind $t('sample.contentdialog.save'), Mode=OneWay}" SecondaryButtonText="{x:Bind $t('sample.contentdialog.dont-save'), Mode=OneWay}" CloseButtonText="{x:Bind $t('sample.contentdialog.cancel'), Mode=OneWay}" DefaultButton="None" PrimaryButtonClick="OnPrimaryReplace" SecondaryButtonClick="OnSecondaryKeep" CloseButtonClick="OnCancelReplace"><StackPanel Spacing="12"><TextBlock Text="{x:Bind $t('sample.contentdialog.body'), Mode=OneWay}" TextWrapping="WrapWholeWords" /><CheckBox Content="{x:Bind $t('sample.contentdialog.upload'), Mode=OneWay}" /></StackPanel></ContentDialog>
      </div>
    </div>
  </ScrollViewer>
</template>
<script setup>
import { computed, inject, ref } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import TextBlock from '../../components/TextBlock.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
const { t } = useI18n(); const currentPage = inject('currentPage'); const pageKey = computed(() => currentPage?.value || 'contentdialog'); const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value); const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')
const showDialog = ref(false); const showDialogNoDefault = ref(false); const dialogResult = ref(''); const dialogResultNoDefault = ref('')
const ShowDialog_Click = () => { showDialog.value = true }; const ShowDialogNoDefault_Click = () => { showDialogNoDefault.value = true }
const OnPrimarySave = () => { dialogResult.value = t('sample.contentdialog.saved') }; const OnSecondarySave = () => { dialogResult.value = t('sample.contentdialog.not-saved') }; const OnCancel = () => { dialogResult.value = t('sample.contentdialog.cancelled') }
const OnPrimaryReplace = () => { dialogResultNoDefault.value = t('sample.contentdialog.saved') }; const OnSecondaryKeep = () => { dialogResultNoDefault.value = t('sample.contentdialog.not-saved') }; const OnCancelReplace = () => { dialogResultNoDefault.value = t('sample.contentdialog.cancelled') }
const basicCode = computed(() => `<Button Click="ShowDialog_Click" Content="{x:Bind $t('text.show-dialog'), Mode=OneWay}" />\n<ContentDialog IsOpen="{x:Bind showDialog, Mode=TwoWay}" DefaultButton="Primary" />`); const noDefaultCode = computed(() => `<Button Click="ShowDialogNoDefault_Click" Content="{x:Bind $t('sample.contentdialog.show-no-default'), Mode=OneWay}" />\n<ContentDialog IsOpen="{x:Bind showDialogNoDefault, Mode=TwoWay}" DefaultButton="None" />`)
</script>
<style scoped>
.page-heading{position:relative}.page-header{font-size:28px;font-weight:600;margin:0 0 8px;color:var(--text-primary)}.page-description{color:var(--text-secondary);margin:0 72px 16px 0;line-height:20px}.page-header-actions{position:absolute;top:0;right:0;display:flex;gap:4px}.icon{font-size:16px}.output-text{margin-left:16px;color:var(--text-secondary)}
</style>
