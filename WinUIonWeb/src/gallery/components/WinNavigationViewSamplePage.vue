<template>
  <WinGrid v-if="Page === 'SampleSettingsPage'" class="sample-settings-page" :class="transitionClass">
    <WinTextBlock
      HorizontalAlignment="Center"
      VerticalAlignment="Center"
      FontSize="20"
      LineHeight="28"
      FontWeight="600"
      :Text="$t('sample.navigationview.settings-page')" />
  </WinGrid>

  <WinScrollViewer
    ref="sampleScrollViewer"
    v-else
    class="sample-page-scroll"
    :class="transitionClass"
    VerticalScrollMode="Auto"
    VerticalScrollBarVisibility="Auto"
    HorizontalScrollMode="Disabled"
    HorizontalScrollBarVisibility="Disabled">
    <WinGrid v-if="Page === 'SamplePage1'" class="sample-page page-one">
      <WinGrid class="tile page-one-accent" Background="var(--accent-base)" />
      <WinGrid class="tile page-one-dark-top" Background="DarkGray" />
      <WinGrid class="tile page-one-light-top" Background="LightGray" />
      <WinGrid class="tile page-one-light-bottom" Background="LightGray" />
      <WinGrid class="tile page-one-dark-bottom" Background="DarkGray" />
      <WinGrid class="page-copy page-one-copy">
        <WinTextBlock
          class="sample-body"
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinGrid>
    </WinGrid>

    <WinGrid v-else-if="Page === 'SamplePage2'" class="sample-page page-two">
      <WinGrid class="page-two-accent" Background="var(--accent-base)" />
      <WinStackPanel class="page-two-copy" Margin="12">
        <WinTextBlock
          Margin="0,0,0,12"
          FontSize="20"
          LineHeight="28"
          FontWeight="600"
          :Text="$t('sample.navigationview.lorem-title')"
          TextWrapping="WrapWholeWords" />
        <WinTextBlock
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinStackPanel>
    </WinGrid>

    <WinGrid v-else-if="Page === 'SamplePage3'" class="sample-page page-three">
      <WinGrid class="tile page-three-feature" Background="LightGray" />
      <WinGrid class="tile page-three-dark-top" Background="DarkGray" />
      <WinGrid class="tile page-three-gray-bottom" Background="Gray" />
      <WinGrid class="tile page-three-light-top" Background="LightGray" />
      <WinGrid class="tile page-three-dark-bottom" Background="DarkGray" />
      <WinGrid class="page-copy page-three-copy">
        <WinTextBlock
          class="sample-body"
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinGrid>
    </WinGrid>

    <WinStackPanel v-else-if="Page === 'SamplePage4'" class="sample-page page-four">
      <WinGrid class="page-four-row page-four-first-row">
        <WinGrid class="tile page-four-feature" Background="DarkSalmon" />
        <WinGrid class="tile page-four-dark" Background="DarkRed" />
        <WinGrid class="tile page-four-light" Background="LightCoral" />
      </WinGrid>
      <WinGrid class="page-four-row page-four-second-row">
        <WinGrid class="tile page-four-second-light" Background="LightCoral" />
        <WinGrid class="tile page-four-second-dark" Background="DarkRed" />
        <WinGrid class="tile page-four-second-red" Background="IndianRed" />
        <WinGrid class="page-copy page-four-copy">
          <WinTextBlock
            class="sample-body"
            :Text="$t('sample.navigationview.lorem-body')"
            TextWrapping="WrapWholeWords" />
        </WinGrid>
      </WinGrid>
    </WinStackPanel>

    <WinGrid v-else-if="Page === 'SamplePage5'" class="sample-page page-five">
      <WinGrid class="tile" Background="Khaki" />
      <WinGrid class="tile" Background="DarkKhaki" />
      <WinGrid Width="150" Height="150" class="sample-ellipse page-five-large-circle" Background="DarkSeaGreen" />
      <WinGrid Width="75" Height="75" class="sample-ellipse page-five-small-circle" Background="MediumSeaGreen" />
      <WinGrid class="tile page-five-green" Background="DarkOliveGreen" />
      <WinGrid class="page-copy page-five-copy">
        <WinTextBlock
          class="sample-body"
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinGrid>
    </WinGrid>

    <WinGrid v-else-if="Page === 'SamplePage6'" class="sample-page page-six">
      <WinGrid Width="20" Height="20" class="sample-ellipse" Background="MediumTurquoise" />
      <WinGrid Width="50" Height="50" class="sample-ellipse" Background="SteelBlue" />
      <WinGrid class="tile" Background="SkyBlue" />
      <WinGrid Width="50" Height="50" class="sample-ellipse" Background="PowderBlue" />
      <WinGrid Width="20" Height="20" class="sample-ellipse" Background="MediumTurquoise" />
      <WinGrid class="tile" Background="SteelBlue" />
      <WinGrid class="page-copy page-six-copy">
        <WinTextBlock
          class="sample-body"
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinGrid>
    </WinGrid>

    <WinGrid v-else-if="Page === 'SamplePage7'" class="sample-page page-seven">
      <WinGrid class="page-seven-accent" Background="PaleVioletRed" />
      <WinStackPanel class="page-seven-copy" Margin="12">
        <WinTextBlock
          Margin="0,0,0,12"
          FontSize="20"
          LineHeight="28"
          FontWeight="600"
          :Text="$t('sample.navigationview.lorem-title')"
          TextWrapping="WrapWholeWords" />
        <WinTextBlock
          :Text="$t('sample.navigationview.lorem-body')"
          TextWrapping="WrapWholeWords" />
      </WinStackPanel>
    </WinGrid>
  </WinScrollViewer>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import WinGrid from '../../components/WinGrid.vue';
import WinScrollViewer from '../../components/WinScrollViewer.vue';
import WinStackPanel from '../../components/WinStackPanel.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import {
  createEntranceNavigationTransitionInfo,
  getNavigationTransitionInfoClassName
} from '../../utils/navigationTransitionInfo';

const props = defineProps({
  Page: { type: String, default: 'SamplePage1' },
  NavigationVersion: { type: Number, default: 0 },
  NavigationTransitionInfo: {
    type: Object,
    default: () => createEntranceNavigationTransitionInfo()
  }
});

const transitionClass = ref(getNavigationTransitionInfoClassName(props.NavigationTransitionInfo));
const sampleScrollViewer = ref(null);
let transitionSequence = 0;

watch(
  () => [props.Page, props.NavigationVersion, props.NavigationTransitionInfo],
  () => {
    const nextClass = getNavigationTransitionInfoClassName(props.NavigationTransitionInfo);
    const sequence = ++transitionSequence;
    transitionClass.value = '';
    nextTick(() => {
      sampleScrollViewer.value?.ChangeView?.(0, 0, null);
      const restart = () => {
        if (sequence === transitionSequence) transitionClass.value = nextClass;
      };
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restart);
      else restart();
    });
  }
);
</script>

<style scoped>
.sample-page-scroll,
.sample-settings-page {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.sample-settings-page {
  place-items: center;
}

.sample-page {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-content: start;
  justify-self: stretch;
}

.page-copy {
  width: auto;
  min-width: 0;
  max-width: none;
  justify-self: stretch;
}

.tile {
  box-sizing: border-box;
  min-height: 150px;
  margin: 5px;
}

.sample-body {
  margin: 0;
  width: auto;
  min-width: 0;
  max-width: none;
  line-height: 20px;
}

.sample-ellipse {
  align-self: center;
  justify-self: center;
  border-radius: 50%;
}

.page-one {
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto auto auto 1fr;
}

.page-one-accent {
  grid-column: 1;
  grid-row: 2 / span 2;
  min-width: 250px;
  min-height: 150px;
  margin: 5px;
}

.page-one-dark-top { grid-column: 2; grid-row: 2; margin: 6px; }
.page-one-light-top { grid-column: 3; grid-row: 2; margin: 6px; }
.page-one-light-bottom { grid-column: 2; grid-row: 3; margin: 6px; }
.page-one-dark-bottom { grid-column: 3; grid-row: 3; margin: 6px; }
.page-one-copy { grid-column: 1 / span 3; grid-row: 4; margin: 12px 6px; }

.page-two {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto auto;
}

.page-two-accent {
  grid-column: 1;
  grid-row: 2;
  width: 150px;
  height: 200px;
  min-height: 150px;
  margin: 12px;
  align-self: start;
}

.page-two-copy {
  grid-column: 2;
  grid-row: 2;
  width: auto;
  min-height: 200px;
  min-width: 0;
}

.page-two-copy > .win-text-block,
.page-seven-copy > .win-text-block {
  align-self: stretch;
  min-width: 0;
}

.page-three {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto auto 1fr;
}

.page-three-feature { grid-column: 1; grid-row: 2 / span 2; }
.page-three-dark-top { grid-column: 2; grid-row: 2; }
.page-three-gray-bottom { grid-column: 2; grid-row: 3; }
.page-three-light-top { grid-column: 3; grid-row: 2; }
.page-three-dark-bottom { grid-column: 3; grid-row: 3; }
.page-three-copy { grid-column: 1 / span 3; grid-row: 4; margin: 5px; }

.page-four {
  width: 100%;
}

.page-four-row {
  width: 100%;
  grid-template-rows: auto auto;
}

.page-four-first-row { grid-template-columns: 2fr 1fr 1fr; }
.page-four-second-row {
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: auto auto 1fr;
}
.page-four-feature { grid-column: 1; grid-row: 1 / span 2; }
.page-four-dark { grid-column: 2; grid-row: 1; }
.page-four-light { grid-column: 3; grid-row: 1; }
.page-four-second-light { grid-column: 1; grid-row: 1; }
.page-four-second-dark { grid-column: 2; grid-row: 1; }
.page-four-second-red { grid-column: 3; grid-row: 1; }
.page-four-copy { grid-column: 1 / span 3; grid-row: 2; margin: 5px; }

.page-five,
.page-six {
  grid-template-columns: 1fr 1fr 4fr;
  grid-template-rows: auto auto auto auto;
}

.page-five-large-circle { grid-column: 3; grid-row: 1; }
.page-five-small-circle { grid-column: 1 / span 2; grid-row: 2; }
.page-five-green { grid-column: 3; grid-row: 2; }
.page-five-copy,
.page-six-copy { grid-column: 1 / span 3; grid-row: 4; margin: 5px; }

.page-seven {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto auto;
}

.page-seven-accent {
  grid-column: 1;
  grid-row: 2;
  width: 150px;
  height: 200px;
  min-height: 150px;
  margin: 12px;
  align-self: start;
}

.page-seven-copy {
  grid-column: 2;
  grid-row: 2;
  width: auto;
  min-height: 200px;
  min-width: 0;
}
</style>
