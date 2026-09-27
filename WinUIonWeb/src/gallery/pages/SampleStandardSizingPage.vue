<template>
  <Page>
    <Grid>
      <StackPanel x:Name="CompactPanel" Spacing="16">
        <TextBlock x:Name="HeaderBlock" FontSize="18" Text="{x:Bind Labels.StandardSize, Mode=OneWay}" />
        <TextBox x:Name="firstName" Header="{x:Bind Labels.FirstName, Mode=OneWay}" />
        <TextBox x:Name="lastName" Header="{x:Bind Labels.LastName, Mode=OneWay}" />
        <PasswordBox x:Name="password" Header="{x:Bind Labels.Password, Mode=OneWay}" />
        <PasswordBox x:Name="confirmPassword" Header="{x:Bind Labels.ConfirmPassword, Mode=OneWay}" />
        <DatePicker x:Name="chosenDate" Header="{x:Bind Labels.PickDate, Mode=OneWay}" />
      </StackPanel>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { computed, provide, shallowReactive } from 'vue';
import DatePicker from '../../components/DatePicker.vue';
import Grid from '../../components/Grid.vue';
import { useI18n } from '../../components/i18n/index';
import Page from '../../components/Page.vue';
import PasswordBox from '../../components/PasswordBox.vue';
import StackPanel from '../../components/StackPanel.vue';
import TextBlock from '../../components/TextBlock.vue';
import TextBox from '../../components/TextBox.vue';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';

defineOptions({ inheritAttrs: false });
const { t } = useI18n();
const Names = shallowReactive<Record<string, any>>({});
provide(xamlNameScopeKey, Names);
const Labels = computed(() => ({
  StandardSize: t('sample.compactsizing.standard-size'), FirstName: t('sample.compactsizing.first-name'),
  LastName: t('sample.compactsizing.last-name'), Password: t('sample.compactsizing.password'),
  ConfirmPassword: t('sample.compactsizing.confirm-password'), PickDate: t('sample.compactsizing.pick-date')
}));
provide(xamlScopeKey, { Labels });
const CopyState = (page: {
  FirstName: { Text: string }; LastName: { Text: string }; Password: { Password: string };
  ConfirmPassword: { Password: string }; ChosenDate: { Date: Date }
}) => {
  Names.firstName.Text = page.FirstName.Text;
  Names.lastName.Text = page.LastName.Text;
  Names.password.Password = page.Password.Password;
  Names.confirmPassword.Password = page.ConfirmPassword.Password;
  Names.chosenDate.Date = page.ChosenDate.Date;
};
defineExpose({
  get FirstName() { return Names.firstName; }, get LastName() { return Names.lastName; },
  get Password() { return Names.password; }, get ConfirmPassword() { return Names.confirmPassword; },
  get ChosenDate() { return Names.chosenDate; }, CopyState
});
</script>
