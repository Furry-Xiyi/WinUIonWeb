<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
        <TextBlock class="page-header" Text="{x:Bind Labels.PageTitle, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" LineHeight="32" Margin="0,0,72,8" TextWrapping="Wrap" />
        <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
        <div class="page-header-actions">
          <Button class="header-action" Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}">
            <FontIcon Glyph="&#xE793;" FontSize="16" />
          </Button>
          <ToggleButton class="header-action" IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}">
            <FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" />
          </ToggleButton>
        </div>
      </div>

      <StackPanel class="gallery-page-content">
        <ControlExample x:Name="Example1" class="person-picture-example" SampleDefinition="PersonPicture\PersonPictureSelectDifferentLooksPerson.txt" HeaderText="{x:Bind Labels.SelectLooks, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind PersonPictureXaml, Mode=OneWay}" CSharp="{x:Bind PersonPictureCSharp, Mode=OneWay}">
          <ControlExample.Example>
            <PersonPicture x:Name="personPicture" Height="300" VerticalAlignment="Top" />
          </ControlExample.Example>
          <ControlExample.Output>
            <TextBlock Text="{x:Bind PictureOutput, Mode=OneWay}" TextWrapping="Wrap" />
          </ControlExample.Output>
          <ControlExample.Options>
            <RadioButtons x:Name="ProfileType" SelectedIndex="0" Header="{x:Bind Labels.ProfileType, Mode=OneWay}" SelectionChanged="RadioButtons_SelectionChanged">
              <RadioButton x:Name="ProfileImageRadio" Content="{x:Bind Labels.ProfileImage, Mode=OneWay}" IsChecked="True" />
              <RadioButton x:Name="DisplayNameRadio" Content="{x:Bind Labels.DisplayName, Mode=OneWay}" />
              <RadioButton x:Name="InitialsRadio" Content="{x:Bind Labels.Initials, Mode=OneWay}" />
            </RadioButtons>
          </ControlExample.Options>
        </ControlExample>
      </StackPanel>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, provide, shallowReactive } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import FontIcon from '../../components/FontIcon.vue';
import PersonPicture from '../../components/PersonPicture.vue';
import RadioButton from '../../components/RadioButton.vue';
import RadioButtons from '../../components/RadioButtons.vue';
import ScrollViewer from '../../components/ScrollViewer.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { xamlNameScopeKey } from '../../components/xamlRuntime';
import { createPageState } from '../../utils/pageState';
import sampleDefinition from '../samples/PersonPicture/PersonPictureSelectDifferentLooksPerson.txt?raw';
import PersonPictureCSharp from '../samples/PersonPicture/PersonPicturePage.xaml.cs?raw';

const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'personpicture');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const Names = shallowReactive({});
provide(xamlNameScopeKey, Names);
const ProfileImageUri = 'https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png';
const Labels = computed(() => ({
  PageTitle: t('text.personpicture'), Description: t('text.personpicture-description'),
  ToggleTheme: t('gallery.page-header.toggle-theme'), SelectLooks: t('sample.personpicture.select-looks'),
  ProfileType: t('sample.personpicture.profile-type'), ProfileImage: t('sample.personpicture.profile-image'),
  DisplayName: t('sample.personpicture.display-name'), Initials: t('sample.personpicture.initials')
}));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734');

// The handler writes the named PersonPicture's public dependency properties,
// just as the Gallery's code-behind does. Output and source read that control.
const RadioButtons_SelectionChanged = () => {
  const picture = Names.personPicture;
  if (!picture) return;
  if (Names.ProfileImageRadio?.IsChecked === true) {
    picture.ProfilePicture = { UriSource: ProfileImageUri };
    picture.DisplayName = null;
    picture.Initials = null;
  } else if (Names.DisplayNameRadio?.IsChecked === true) {
    picture.ProfilePicture = null;
    picture.DisplayName = t('sample.personpicture.person-name');
    picture.Initials = null;
  } else if (Names.InitialsRadio?.IsChecked === true) {
    picture.ProfilePicture = null;
    picture.DisplayName = null;
    picture.Initials = t('sample.personpicture.person-initials');
  }
};
const PictureOutput = computed(() => {
  const picture = Names.personPicture;
  if (!picture) return '';
  const values = { width: picture.ActualWidth, height: picture.ActualHeight };
  if (picture.ProfilePicture) return t('sample.personpicture.output.image', values);
  return t('sample.personpicture.output.initials', {
    ...values, name: picture.DisplayName || picture.Initials,
    initials: picture.TemplateSettings.ActualInitials
  });
});
const escapeAttribute = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const PersonPictureXaml = computed(() => {
  const picture = Names.personPicture;
  const substitutions = {
    ProfilePicture: picture?.ProfilePicture ? `ProfilePicture="${ProfileImageUri}"` : '',
    DisplayName: picture?.DisplayName ? `DisplayName="${escapeAttribute(picture.DisplayName)}"` : '',
    Initials: picture?.Initials ? `Initials="${escapeAttribute(picture.Initials)}"` : ''
  };
  return sampleDefinition.split('--- xaml')[1].trim().replace(/\$\((\w+)\)/g, (_, key) => substitutions[key] || '');
});
</script>

<style scoped>
.page-heading { position: relative; min-width: 0; }
.page-header { margin: 0 72px 8px 0; color: var(--text-primary); font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.gallery-page-content { min-width: 0; container-type: inline-size; container-name: person-picture-gallery; }
.person-picture-example :deep(.win-person-picture) { flex: 0 0 auto; max-width: none; }
.person-picture-example :deep(.example-output) { max-width: 220px; }
.person-picture-example :deep(.win-radio-buttons-items) { grid-template-columns: minmax(0, 1fr) !important; }
.person-picture-example :deep(.win-radio-content) { overflow-wrap: anywhere; white-space: normal; }

@container person-picture-gallery (max-width: 979px) {
  .person-picture-example :deep(.example-container) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .person-picture-example :deep(.example-display) { grid-column: 1; grid-row: 1; }
  .person-picture-example :deep(.example-output) { grid-column: 1; grid-row: 2; width: auto; max-width: none; margin: 0 12px 12px; justify-self: stretch; }
  .person-picture-example :deep(.example-options) { grid-column: 1; grid-row: 3; width: auto; max-width: none; margin: 0; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush); border-radius: 0; justify-self: stretch; }
}
</style>
