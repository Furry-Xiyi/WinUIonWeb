<template>
  <div>
    <div style="position: relative;">
      <h1 class="page-header">ParallaxView</h1>
      <p class="page-description">
        The ParallaxView control lets you create a visual effect where an item closer to the viewer moves faster than an item in the background. This creates a feeling of depth and parallax.
      </p>
      <div class="page-header-actions">
        <WinButton
          @click="toggleTheme"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">&#xE793;</span>
        </WinButton>
        <WinToggleButton
          v-model:IsChecked="isFavoriteState"
          @update:IsChecked="toggleFavorite"
          style="width: 32px; height: 32px; padding: 0; min-width: 0;">
          <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
        </WinToggleButton>
      </div>
    </div>

    <!-- Example 1: Parallax with colored rectangles -->
    <WinControlExample
      headerText="Parallax with a scrollable list"
      :theme="pageTheme"
      :templateCode="example1Template"
      :vueCode="example1Vue"
      style="margin-bottom: 32px;">
      <template #example>
        <div style="height: 500px; width: 100%; position: relative; background: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <WinParallaxView :verticalShift="400">
            <template #child>
              <img
                src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg"
                alt="Cliff background"
                style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
            <div style="width: 100%; height: 100%; overflow-y: auto; background: rgba(0, 0, 0, 0.4);">
              <div style="max-width: 280px; margin: 0 auto; padding: 24px 0; text-align: center;">
                <p style="color: white; font-size: 24px; font-weight: 600; margin: 0;">
                  Scroll to see parallaxing of image
                </p>
              </div>
              <div style="padding: 0 24px;">
                <div v-for="(item, index) in scrollItems" :key="index"
                     style="padding: 16px; margin-bottom: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">
                  <p style="color: white; margin: 0; font-size: 14px;">{{ item.title }}</p>
                </div>
              </div>
            </div>
          </WinParallaxView>
        </div>
      </template>
    </WinControlExample>

    <!-- Example 2: Parallax with colored rectangles in narrow column -->
    <WinControlExample
      headerText="Parallax with a ScrollView"
      :theme="pageTheme"
      :templateCode="example2Template"
      :vueCode="example2Vue">
      <template #example>
        <div style="height: 500px; width: 100%; position: relative; background: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <WinParallaxView :verticalShift="400">
            <template #child>
              <img
                src="https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg"
                alt="Cliff background"
                style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: flex-start;">
              <div style="max-width: 280px; margin: 0 auto; padding: 24px 0; text-align: center; z-index: 10;">
                <p style="color: white; font-size: 24px; font-weight: 600; margin: 0;">
                  Scroll the rectangles to see parallaxing of image
                </p>
              </div>
              <div style="width: 150px; height: 100%; overflow-y: auto; padding: 0 24px;">
                <div v-for="color in coloredRectangles" :key="color"
                     :style="{
                       height: '150px',
                       background: color,
                       marginBottom: '8px',
                       borderRadius: '4px'
                     }">
                </div>
              </div>
            </div>
          </WinParallaxView>
        </div>
      </template>
    </WinControlExample>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WinButton from '../components/WinButton.vue';
import WinToggleButton from '../components/WinToggleButton.vue';
import WinControlExample from '../components/WinControlExample.vue';
import WinParallaxView from '../components/WinParallaxView.vue';

// Page state
const pageTheme = ref('light');
const isFavoriteState = ref(false);

// Example 1: List items
const scrollItems = ref([
  { title: 'AppBarButton' },
  { title: 'AppBarSeparator' },
  { title: 'AppBarToggleButton' },
  { title: 'AutoSuggestBox' },
  { title: 'Button' },
  { title: 'CalendarDatePicker' },
  { title: 'CheckBox' },
  { title: 'ComboBox' },
  { title: 'CommandBar' },
  { title: 'DatePicker' },
  { title: 'DropDownButton' },
  { title: 'FlipView' },
  { title: 'GridView' },
  { title: 'HyperlinkButton' },
  { title: 'ListView' },
  { title: 'MenuBar' },
  { title: 'NavigationView' },
  { title: 'PasswordBox' },
  { title: 'ProgressBar' },
  { title: 'ProgressRing' },
  { title: 'RadioButton' },
  { title: 'Slider' },
  { title: 'SplitButton' },
  { title: 'TextBox' },
  { title: 'TimePicker' },
  { title: 'ToggleButton' },
  { title: 'ToggleSwitch' }
]);

// Example 2: Colored rectangles
const coloredRectangles = ref([
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'BlanchedAlmond',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan'
]);

// Page actions
const toggleTheme = () => {
  pageTheme.value = pageTheme.value === 'light' ? 'dark' : 'light';
};

const toggleFavorite = (value) => {
  console.log('Favorite toggled:', value);
};

// Code examples
const example1Template = `<Grid>
  <ParallaxView Source="{Binding ElementName=listView}" VerticalShift="500">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" />
  </ParallaxView>
  <ListView x:Name="listView" ItemsSource="{x:Bind Items}"
            Background="#80000000">
    <ListView.Header>
      <TextBlock Text="Scroll the list to see parallaxing of image"
                 Foreground="White" FontSize="28" />
    </ListView.Header>
  </ListView>
</Grid>`;

const example1Vue = `<WinParallaxView :verticalShift="400">
  <template #child>
    <img src="cliff.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
  </template>
  <div style="overflow-y: auto; background: rgba(0, 0, 0, 0.4);">
    <div style="text-align: center; padding: 24px;">
      <p style="color: white; font-size: 24px;">
        Scroll to see parallaxing of image
      </p>
    </div>
    <div v-for="item in items" :key="item">
      <p style="color: white;">{{ item.title }}</p>
    </div>
  </div>
</WinParallaxView>`;

const example2Template = `<Grid>
  <ParallaxView Source="{Binding ElementName=scrollView}" VerticalShift="500">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg"/>
  </ParallaxView>
  <TextBlock Text="Scroll the rectangles to see parallaxing of image"
             Foreground="White" FontSize="28"/>
  <ScrollView x:Name="scrollView" Width="150">
    <StackPanel>
      <Rectangle Fill="AliceBlue" Height="150"/>
      <!-- ... -->
      <Rectangle Fill="Cyan" Height="150"/>
    </StackPanel>
  </ScrollView>
</Grid>`;

const example2Vue = `<WinParallaxView :verticalShift="400">
  <template #child>
    <img src="cliff.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
  </template>
  <div style="display: flex; flex-direction: column;">
    <div style="text-align: center; padding: 24px;">
      <p style="color: white; font-size: 24px;">
        Scroll the rectangles to see parallaxing of image
      </p>
    </div>
    <div style="width: 150px; overflow-y: auto;">
      <div v-for="color in colors"
           :style="{ height: '150px', background: color }">
      </div>
    </div>
  </div>
</WinParallaxView>`;
</script>

<style scoped>
.page-header {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.icon {
  font-family: 'Segoe MDL2 Assets', 'Segoe UI Symbol';
  font-size: 16px;
  display: inline-block;
}
</style>
