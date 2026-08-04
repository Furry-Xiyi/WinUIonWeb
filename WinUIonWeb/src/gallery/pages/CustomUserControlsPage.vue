<template>
  <div class="gallery-item-page">
    <div style="position: relative;" class="page-heading">
          <h1 class="page-header">Custom & User Controls</h1>
          <p class="page-description">
            Learn how to create reusable custom controls and UserControls in WinUI applications.
          </p>
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"
             >
              <span class="icon">&#xE793;</span>
            </WinButton>
            <WinToggleButton class="header-action" :IsChecked="isFavoriteState"
              @update:IsChecked="toggleFavorite"
             >
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
    <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <div class="gallery-page-content">
            <!-- Custom Control Section -->
            <div class="section-header">
              <h2 class="subtitle">Custom (templated) control</h2>
            </div>

            <div class="description-section">
              <p class="description-text">
                A custom control is a reusable component that derives from the
                <code class="inline-code">Control</code> class. It provides flexibility through
                <strong>ControlTemplates</strong> and supports <strong>styling and theming.</strong>
              </p>

              <ul class="feature-list">
                <li><strong>Encapsulation:</strong> custom controls encapsulate behavior and UI logic, making them reusable across different projects.</li>
                <li><strong>Theming:</strong> they support light and dark themes through theme resources.</li>
              </ul>

              <div class="key-points">
                <p class="key-points-title"><strong>Key points</strong></p>
                <ul class="feature-list">
                  <li>Use <code class="inline-code">Generic.xaml</code> file or a new <code class="inline-code">ResourceDictionary</code> to define the default style of a custom control.</li>
                  <li>Override <code class="inline-code">OnApplyTemplate()</code> to interact with template parts.</li>
                  <li>Use <code class="inline-code">DependencyProperty</code> for properties that support data binding.</li>
                </ul>
              </div>
            </div>

            <!-- Example 1: Counter Control with Increment/Decrement -->
            <WinControlExample
              headerText="Counter Control with Increment/Decrement Mode"
              :theme="pageTheme"
              :templateCode="example1Template"
              :vueCode="example1Vue">
              <template #example>
                <div style="display: flex; gap: 8px; align-items: flex-start;">
                  <CounterControl mode="increment" />
                  <CounterControl mode="decrement" />
                </div>
              </template>
            </WinControlExample>

            <!-- Example 2: Validated Password Box -->
            <WinControlExample
              headerText="Basic Custom Password Box with Validation"
              :theme="pageTheme"
              :templateCode="example2Template"
              :vueCode="example2Vue">
              <template #example>
                <div style="display: flex; flex-direction: column; gap: 8px; max-width: 300px;">
                  <ValidatedPasswordBox
                    ref="passwordInput"
                    header="Password"
                    placeholder="Enter password..."
                    :minLength="8"
                    v-model="passwordValue"
                    @validationChanged="onPasswordValidationChanged" />
                  <WinButton primary
                    :disabled="!isPasswordValid"
                    @click="onSubmitPassword">
                    Submit
                  </WinButton>
                </div>
              </template>
              <template #options>
                <p class="output-text">{{ passwordOutput || 'Enter a valid password and click Submit' }}</p>
              </template>
            </WinControlExample>

            <!-- UserControl Section -->
            <div class="section-header" style="margin-top: 24px;">
              <h2 class="subtitle">UserControl</h2>
            </div>

            <div class="description-section">
              <p class="description-text">
                A UserControl is a reusable component that combines existing controls and logic into a cohesive unit.
                It allows for encapsulation of functionality and a consistent design across multiple instances.
              </p>
            </div>

            <!-- Example 3: Temperature Converter UserControl -->
            <WinControlExample
              headerText="Temperature Converter UserControl example"
              :theme="pageTheme"
              :templateCode="example3Template"
              :vueCode="example3Vue">
              <template #example>
                <TemperatureConverter />
              </template>
            </WinControlExample>
      </div>
    </WinScrollViewer>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import CounterControl from '../../components/examples/CounterControl.vue';
import ValidatedPasswordBox from '../../components/examples/ValidatedPasswordBox.vue';
import TemperatureConverter from '../../components/examples/TemperatureConverter.vue';
import { useFavorites } from '../composables/useFavorites';
import { usePageTheme } from '../composables/usePageTheme';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'customusercontrols');

const { isFavorite: checkFavorite, toggleFavorite: toggleFav } = useFavorites();
const isFavorite = computed(() => checkFavorite(pageKey.value));
const isFavoriteState = ref(isFavorite.value);

watch(isFavorite, (newVal) => {
  isFavoriteState.value = newVal;
});

const toggleFavorite = () => {
  toggleFav(pageKey.value);
};

const { pageTheme, toggleTheme: doToggleTheme } = usePageTheme('system');
const toggleTheme = () => doToggleTheme();

// Example 2: Password validation
const passwordValue = ref('');
const isPasswordValid = ref(false);
const passwordOutput = ref('');

const onPasswordValidationChanged = (valid) => {
  isPasswordValid.value = valid;
};

const onSubmitPassword = () => {
  if (isPasswordValid.value) {
    passwordOutput.value = 'Password submitted successfully!';
  }
};

// Code examples
const example1Template = `<!-- Generic.xaml -->
<Style TargetType="local:CounterControl">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:CounterControl">
        <StackPanel HorizontalAlignment="Left" Spacing="8">
          <TextBlock x:Name="CountText" FontSize="20" Text="0" />
          <Button x:Name="ActionButton" Content="Increase" Width="100" />
        </StackPanel>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>

<!-- Usage -->
<controls:CounterControl Mode="Increment" />
<controls:CounterControl Mode="Decrement" />`;

const example1Vue = `// Custom control with DependencyProperty
public sealed class CounterControl : Control
{
    public static readonly DependencyProperty CountProperty =
        DependencyProperty.Register(nameof(Count), typeof(int),
            typeof(CounterControl), new PropertyMetadata(0));

    public static readonly DependencyProperty ModeProperty =
        DependencyProperty.Register(nameof(Mode), typeof(CounterMode),
            typeof(CounterControl), new PropertyMetadata(CounterMode.Increment));

    protected override void OnApplyTemplate()
    {
        ActionButton = GetTemplateChild("ActionButton") as Button;
        CountText = GetTemplateChild("CountText") as TextBlock;

        if (ActionButton != null)
        {
            ActionButton.Click += (s, e) => {
                Count = Mode == CounterMode.Increment ? Count + 1 : Count - 1;
                UpdateUI();
            };
        }
    }
}`;

const example2Template = `<Style TargetType="local:ValidatedPasswordBox">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:ValidatedPasswordBox">
        <StackPanel Spacing="4">
          <PasswordBox x:Name="PasswordInput" />
          <RichTextBlock x:Name="ValidationRichText"
                         AutomationProperties.LiveSetting="Polite"
                         Visibility="Collapsed"/>
        </StackPanel>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>

<!-- Usage -->
<controls:ValidatedPasswordBox x:Name="PasswordInput"
                               MinLength="8"
                               Header="Password" />
<Button Content="Submit"
        IsEnabled="{x:Bind PasswordInput.IsValid, Mode=OneWay}" />`;

const example2Vue = `public sealed partial class ValidatedPasswordBox : Control
{
    public static readonly DependencyProperty PasswordProperty =
        DependencyProperty.Register(nameof(Password), typeof(string),
            typeof(ValidatedPasswordBox),
            new PropertyMetadata(string.Empty, OnPasswordChanged));

    public bool IsValid { get; private set; }

    private void UpdateValidationMessages()
    {
        bool hasMinLength = Password.Length >= MinLength;
        bool hasUppercase = Password.Any(char.IsUpper);
        bool hasNumber = Password.Any(char.IsDigit);

        IsValid = hasMinLength && hasUppercase && hasNumber;

        // Update validation UI
        if (!hasUppercase) ShowError("Missing uppercase");
        if (!hasNumber) ShowError("Missing number");
        if (!hasMinLength) ShowError("Too short!");
    }
}`;

const example3Template = `<!-- TemperatureConverterControl.xaml -->
<UserControl>
  <StackPanel Spacing="8">
    <TextBox Header="Enter Temperature in Celsius"
             x:Name="InputTextBox"
             Width="200"
             PlaceholderText="Celsius" />
    <Button Content="Convert to Fahrenheit"
            Width="200"
            Click="Button_Click" />
    <TextBlock x:Name="ResultTextBlock" FontWeight="SemiBold" />
  </StackPanel>
</UserControl>

<!-- Usage -->
<local:TemperatureConverterControl />`;

const example3Vue = `public sealed partial class TemperatureConverterControl : UserControl
{
    public TemperatureConverterControl()
    {
        this.InitializeComponent();
    }

    private void Button_Click(object sender, RoutedEventArgs e)
    {
        if (double.TryParse(InputTextBox.Text, out double celsius))
        {
            double fahrenheit = (celsius * 9 / 5) + 32;
            ResultTextBlock.Text = $"Fahrenheit: {fahrenheit:F2}°F";
        }
        else
        {
            ResultTextBlock.Text = "Invalid input!";
        }
    }
}`;
</script>

<style scoped>
.page-header {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.page-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  align-items: center;
}

.icon {
  font-size: 16px;
}

.section-header {
  margin: 8px 0;
}

.subtitle {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.description-section {
  margin-bottom: 16px;
}

.description-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.inline-code {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  background-color: var(--card-background-secondary);
  padding: 2px 6px;
  border-radius: 3px;
}

.feature-list {
  margin: 8px 0;
  padding-left: 24px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.8;
}

.feature-list li {
  margin-bottom: 6px;
}

.key-points {
  margin-top: 12px;
  padding: 12px;
  background-color: var(--card-background-secondary);
  border-radius: 4px;
}

.key-points-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.output-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}
</style>
