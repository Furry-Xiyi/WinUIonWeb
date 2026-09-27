<template>
  <Page xmlns:models="using:WinUIGallery.Models" xmlns:converters="using:WinUIGallery.Converters">
    <Page.Resources>
      <MenuItemTemplateSelector x:Key="selector">
        <MenuItemTemplateSelector.ItemTemplate>
          <DataTemplate x:DataType="models:Category">
            <NavigationViewItem Content="{x:Bind Name}" ToolTipService.ToolTip="{x:Bind Tooltip}">
              <NavigationViewItem.Icon>
                <SymbolIcon Symbol="{x:Bind Glyph}" />
              </NavigationViewItem.Icon>
            </NavigationViewItem>
          </DataTemplate>
        </MenuItemTemplateSelector.ItemTemplate>
      </MenuItemTemplateSelector>
    </Page.Resources>
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind pageTitle, Mode=OneWay}" />
          <TextBlock class="page-description" Text="{x:Bind pageDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal">
            <Button class="header-action" AutomationProperties.Name="{x:Bind Labels.ChangeTheme, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind Labels.ChangeTheme, Mode=OneWay}" Click="toggleTheme"><TextBlock class="icon" Text="&#xE793;" /></Button>
            <ToggleButton class="header-action" AutomationProperties.Name="{x:Bind favoriteButtonName, Mode=OneWay}" ToolTipService.ToolTip="{x:Bind favoriteButtonName, Mode=OneWay}" IsChecked="{x:Bind isFavoriteState, Mode=TwoWay}" Click="toggleFavorite"><TextBlock class="icon" Text="{x:Bind favoriteGlyph, Mode=OneWay}" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content navigationview-samples" Spacing="0">
          <StackPanel.Resources>
            <ResourceDictionary>
              <ResourceDictionary.ThemeDictionaries>
                <ResourceDictionary x:Key="Light">
                  <SolidColorBrush x:Key="myBrush" Color="{StaticResource SystemBaseHighColor}" />
                  <AcrylicBrush x:Key="NavigationViewExpandedPaneBackground" FallbackColor="#F2F2F2" TintColor="White" TintOpacity="0.8" />
                </ResourceDictionary>
                <ResourceDictionary x:Key="Dark">
                  <SolidColorBrush x:Key="myBrush" Color="{StaticResource SystemBaseHighColor}" />
                  <AcrylicBrush x:Key="NavigationViewExpandedPaneBackground" FallbackColor="#1F1F1F" TintColor="#1F1F1F" TintOpacity="0.8" />
                </ResourceDictionary>
                <ResourceDictionary x:Key="HighContrast">
                  <SolidColorBrush x:Key="myBrush" Color="{ThemeResource SystemColorButtonFaceColor}" />
                </ResourceDictionary>
              </ResourceDictionary.ThemeDictionaries>
            </ResourceDictionary>
          </StackPanel.Resources>
          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationviewDefaultPanedisplaymode.txt" WebViewHeight="250" class="navigationview-example" HeaderText="{x:Bind Labels.DefaultHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Default, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.DefaultDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample5" Grid.Row="1" Height="460" Header="{x:Bind Labels.HeaderText, Mode=OneWay}" IsTabStop="False" PaneDisplayMode="Auto" SelectionChanged="NavigationView_SelectionChanged5" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem1, Mode=OneWay}" Icon="Play" Tag="SamplePage1" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem2, Mode=OneWay}" Icon="Save" Tag="SamplePage2" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem3, Mode=OneWay}" Icon="Refresh" Tag="SamplePage3" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem4, Mode=OneWay}" Icon="Download" Tag="SamplePage4" />
                  </NavigationView.MenuItems>
                  <Frame x:Name="contentFrame5" Margin="0,0,0,0" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Options />
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Default, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationviewPanedisplaymodeTop.txt" WebViewHeight="200" class="navigationview-example" HeaderText="{x:Bind Labels.TopHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Top, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.TopDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample6" Grid.Row="1" Height="460" Header="{x:Bind Labels.HeaderText, Mode=OneWay}" IsTabStop="False" PaneDisplayMode="Top" SelectionChanged="NavigationView_SelectionChanged6" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem1, Mode=OneWay}" Tag="SamplePage1" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem2, Mode=OneWay}" Tag="SamplePage2" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem3, Mode=OneWay}" Tag="SamplePage3" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem4, Mode=OneWay}" Tag="SamplePage3" />
                  </NavigationView.MenuItems>
                  <Frame x:Name="contentFrame6" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Options />
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Top, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationviewSwitchesPaneOrientation.txt" WebViewHeight="450" class="navigationview-example" HeaderText="{x:Bind Labels.AdaptiveHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Adaptive, Mode=OneWay}">
            <ControlExample.Example>
              <Grid x:Name="InnerGrid" class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.AdaptiveDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample2" Grid.Row="1" Height="460" IsTabStop="False" PaneDisplayMode="Auto" SelectionChanged="NavigationView_SelectionChanged2" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem1, Mode=OneWay}" Tag="SamplePage1" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem2, Mode=OneWay}" Tag="SamplePage2" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem3, Mode=OneWay}" Tag="SamplePage3" />
                    <NavigationViewItem Content="{x:Bind Labels.MenuItem4, Mode=OneWay}" Tag="SamplePage4" />
                  </NavigationView.MenuItems>
                  <NavigationView.Content>
                    <Frame x:Name="contentFrame2" />
                  </NavigationView.Content>
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Options />
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Adaptive, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationViewTyingSelectionFocusTabs.txt" WebViewHeight="800" class="navigationview-example" HeaderText="{x:Bind Labels.TabsHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Tabs, Mode=OneWay}" CSharp="{x:Bind SampleCSharp.Tabs, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.TabsDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample7" Grid.Row="1" Height="460" IsBackButtonVisible="Collapsed" IsTabStop="False" PaneDisplayMode="Top" SelectionChanged="NavigationView_SelectionChanged7" SelectionFollowsFocus="Enabled" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.Item1, Mode=OneWay}" Tag="SamplePage1" />
                    <NavigationViewItem Content="{x:Bind Labels.Item2, Mode=OneWay}" Tag="SamplePage2" />
                    <NavigationViewItem Content="{x:Bind Labels.Item3, Mode=OneWay}" Tag="SamplePage3" />
                    <NavigationViewItem Content="{x:Bind Labels.Item4, Mode=OneWay}" Tag="SamplePage4" />
                  </NavigationView.MenuItems>
                  <Frame x:Name="contentFrame7" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Options />
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Tabs, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationViewDataBinding.txt" WebViewHeight="950" class="navigationview-example" HeaderText="{x:Bind Labels.DataBindingHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.DataBinding, Mode=OneWay}" CSharp="{x:Bind SampleCSharp.DataBinding, Mode=OneWay}">
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.DataBindingDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample4" Grid.Row="1" Height="460" IsTabStop="False" MenuItemTemplateSelector="{StaticResource selector}" MenuItemsSource="{x:Bind Categories, Mode=OneWay}" SelectionChanged="NavigationView_SelectionChanged4" class="navigationview-sample">
                  <StackPanel>
                    <Frame x:Name="contentFrame4" Margin="0,0,0,0" />
                  </StackPanel>
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Options />
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.DataBinding, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationviewFooterMenuItems.txt" class="navigationview-example" HeaderText="{x:Bind Labels.FooterHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Footer, Mode=OneWay}">
            <ControlExample.Options>
              <StackPanel>
                <RadioButtons Header="{x:Bind Labels.PanePosition, Mode=OneWay}" SelectedIndex="0">
                  <RadioButton x:Name="nvSample9Left" Checked="panePositionLeft_Checked" Content="{x:Bind Labels.LeftMode, Mode=OneWay}" />
                  <RadioButton x:Name="nvSample9Top" Checked="panePositionTop_Checked" Content="{x:Bind Labels.TopMode, Mode=OneWay}" />
                </RadioButtons>
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="PaneDisplay" Value="{x:Bind nvSample9.PaneDisplayMode, Mode=OneWay}" />
            </ControlExample.Substitutions>
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Margin="0,0,0,12" Text="{x:Bind Labels.FooterDescription, Mode=OneWay}" TextWrapping="WrapWholeWords" />
                <NavigationView x:Name="nvSample9" Grid.Row="1" Height="460" Header="{x:Bind Labels.HeaderText, Mode=OneWay}" IsSettingsVisible="False" IsTabStop="False" PaneDisplayMode="Left" SelectionChanged="NavigationView_SelectionChanged9" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.Browse, Mode=OneWay}" Icon="Library" Tag="SamplePage1" />
                    <NavigationViewItem Content="{x:Bind Labels.TrackOrder, Mode=OneWay}" Icon="Map" Tag="SamplePage2" />
                    <NavigationViewItem Content="{x:Bind Labels.OrderHistory, Mode=OneWay}" Icon="Tag" Tag="SamplePage3" />
                  </NavigationView.MenuItems>
                  <NavigationView.FooterMenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.Account, Mode=OneWay}" Icon="Contact" Tag="SamplePage4" />
                    <NavigationViewItem Content="{x:Bind Labels.YourCart, Mode=OneWay}" Icon="Shop" Tag="SamplePage5" />
                    <NavigationViewItem Content="{x:Bind Labels.Help, Mode=OneWay}" Icon="Help" Tag="SamplePage5" />
                  </NavigationView.FooterMenuItems>
                  <Frame x:Name="contentFrame9" Margin="0,0,0,0" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Footer, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\HierarchicalNavigationview.txt" class="navigationview-example" HeaderText="{x:Bind Labels.HierarchicalHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Hierarchy, Mode=OneWay}">
            <ControlExample.Options>
              <StackPanel>
                <TextBlock Margin="0,12,0,0" Text="{x:Bind Labels.PanePositionProperty, Mode=OneWay}" />
                <RadioButton x:Name="nvSample8Left" Checked="panePositionLeft_Checked" Content="{x:Bind Labels.LeftMode, Mode=OneWay}" GroupName="hierachicalGroup" IsChecked="True" />
                <RadioButton x:Name="nvSample8Top" Checked="panePositionTop_Checked" Content="{x:Bind Labels.TopMode, Mode=OneWay}" GroupName="hierachicalGroup" />
                <RadioButton x:Name="nvSample8LeftCompact" Checked="panePositionLeftCompact_Checked" Content="{x:Bind Labels.LeftCompactMode, Mode=OneWay}" GroupName="hierachicalGroup" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="PaneDisplay" Value="{x:Bind nvSample8.PaneDisplayMode, Mode=OneWay}" />
            </ControlExample.Substitutions>
            <ControlExample.Example>
              <Grid class="navigationview-sample-layout">
                <Grid.RowDefinitions>
                  <RowDefinition Height="Auto" />
                  <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>
                <TextBlock Grid.Row="0" Margin="0,0,0,12" TextWrapping="WrapWholeWords" />
                <RichTextBlock class="hierarchy-description" Margin="0,0,0,15" TextWrapping="Wrap">
                  <Paragraph>
                    <Run Text="{x:Bind Labels.HierarchyDescription1, Mode=OneWay}" />
                    <LineBreak />
                  </Paragraph>
                  <Paragraph>
                    <Run Text="{x:Bind Labels.HierarchyDescription2, Mode=OneWay}" />
                    <LineBreak />
                  </Paragraph>
                  <Paragraph>
                    <Run Text="{x:Bind Labels.HierarchyDescription3, Mode=OneWay}" />
                    <LineBreak />
                  </Paragraph>
                  <Paragraph>
                    <Run Text="{x:Bind Labels.HierarchyDescription4, Mode=OneWay}" />
                  </Paragraph>
                </RichTextBlock>
                <NavigationView x:Name="nvSample8" Grid.Row="1" Height="460" IsTabStop="False" PaneDisplayMode="Left" SelectionChanged="NavigationView_SelectionChanged8" class="navigationview-sample">
                  <NavigationView.MenuItems>
                    <NavigationViewItem Content="{x:Bind Labels.Home, Mode=OneWay}" Icon="Home" Tag="SamplePage1" ToolTipService.ToolTip="{x:Bind Labels.Home, Mode=OneWay}" />
                    <NavigationViewItem Content="{x:Bind Labels.Account, Mode=OneWay}" Icon="Contact" Tag="SamplePage2" ToolTipService.ToolTip="{x:Bind Labels.Account, Mode=OneWay}">
                      <NavigationViewItem.MenuItems>
                        <NavigationViewItem Content="{x:Bind Labels.Mail, Mode=OneWay}" Icon="Mail" Tag="SamplePage3" ToolTipService.ToolTip="{x:Bind Labels.Mail, Mode=OneWay}" />
                        <NavigationViewItem Content="{x:Bind Labels.Calendar, Mode=OneWay}" Icon="Calendar" Tag="SamplePage4" ToolTipService.ToolTip="{x:Bind Labels.Calendar, Mode=OneWay}" />
                      </NavigationViewItem.MenuItems>
                    </NavigationViewItem>
                    <NavigationViewItem Content="{x:Bind Labels.DocumentOptions, Mode=OneWay}" Icon="Page2" SelectsOnInvoked="False" ToolTipService.ToolTip="{x:Bind Labels.DocumentOptions, Mode=OneWay}">
                      <NavigationViewItem.MenuItems>
                        <NavigationViewItem Content="{x:Bind Labels.CreateNew, Mode=OneWay}" Icon="NewFolder" Tag="SamplePage5" ToolTipService.ToolTip="{x:Bind Labels.CreateNew, Mode=OneWay}" />
                        <NavigationViewItem Content="{x:Bind Labels.UploadFile, Mode=OneWay}" Icon="OpenLocal" Tag="SamplePage6" ToolTipService.ToolTip="{x:Bind Labels.UploadFile, Mode=OneWay}" />
                      </NavigationViewItem.MenuItems>
                    </NavigationViewItem>
                  </NavigationView.MenuItems>
                  <Frame x:Name="contentFrame8" />
                </NavigationView>
              </Grid>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Hierarchy, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>

          <ControlExample VerticalAlignment="Top" HorizontalContentAlignment="Stretch" SampleDefinition="NavigationView\NavigationViewApiAction.txt" WebViewHeight="250" class="navigationview-example" HeaderText="{x:Bind Labels.ApiHeader, Mode=OneWay}" Theme="{x:Bind pageTheme, Mode=OneWay}" Xaml="{x:Bind SampleXaml.Api, Mode=OneWay}">
            <ControlExample.Options>
              <StackPanel>
                <CheckBox x:Name="settingsCheck" Click="settingsCheck_Click" Content="{x:Bind Labels.SettingsVisible, Mode=OneWay}" IsChecked="True" />
                <CheckBox x:Name="visibleCheck" Click="visibleCheck_Click" Content="{x:Bind Labels.BackVisible, Mode=OneWay}" IsChecked="True" />
                <CheckBox x:Name="enableCheck" Click="enableCheck_Click" Content="{x:Bind Labels.BackEnabled, Mode=OneWay}" IsChecked="False" />
                <CheckBox x:Name="autoSuggestCheck" Click="autoSuggestCheck_Click" Content="{x:Bind Labels.AutosuggestVisible, Mode=OneWay}" IsChecked="True" />
                <TextBlock Margin="0,12,0,0" Text="{x:Bind Labels.HeaderLabel, Mode=OneWay}" />
                <TextBox x:Name="headerText" AutomationProperties.Name="{x:Bind Labels.HeaderProperty, Mode=OneWay}" Text="{x:Bind Labels.HeaderValue, Mode=OneWay}" />
                <CheckBox x:Name="headerCheck" Click="headerCheck_Click" Content="{x:Bind Labels.AlwaysShowHeader, Mode=OneWay}" IsChecked="True" />
                <TextBlock Margin="0,12,0,0" Text="{x:Bind Labels.PaneTitleLabel, Mode=OneWay}" />
                <TextBox x:Name="paneText" AutomationProperties.Name="{x:Bind Labels.PaneTitleProperty, Mode=OneWay}" Text="{x:Bind Labels.PaneTitleValue, Mode=OneWay}" />
                <CheckBox x:Name="panemc_Check" Click="panemc_Check_Click" Content="{x:Bind Labels.PaneCustomVisible, Mode=OneWay}" IsChecked="False" />
                <CheckBox x:Name="paneFooterCheck" Click="paneFooterCheck_Click" Content="{x:Bind Labels.PaneFooterVisible, Mode=OneWay}" IsChecked="False" />
                <TextBlock Margin="0,12,0,0" Text="{x:Bind Labels.PanePositionProperty, Mode=OneWay}" />
                <RadioButton x:Name="nvSampleLeft" Checked="panePositionLeft_Checked" Content="{x:Bind Labels.Left, Mode=OneWay}" IsChecked="True" GroupName="apiPanePosition" />
                <RadioButton x:Name="nvSampleTop" Margin="0,0,0,12" Checked="panePositionTop_Checked" Content="{x:Bind Labels.Top, Mode=OneWay}" GroupName="apiPanePosition" />
                <CheckBox x:Name="sffCheck" Click="sffCheck_Click" Content="{x:Bind Labels.KeyboardSelectionFollowsFocus, Mode=OneWay}" IsChecked="False" />
                <CheckBox x:Name="suppressselectionCheck_Checked" Click="suppressselectionCheck_Checked_Click" Content="{x:Bind Labels.SuppressMenuItem2, Mode=OneWay}" IsChecked="False" />
              </StackPanel>
            </ControlExample.Options>
            <ControlExample.Substitutions>
              <ControlExampleSubstitution Key="SettingsVis" Value="{x:Bind settingsCheck.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="BackButtonVis" Value="{x:Bind nvSample.IsBackButtonVisible, Mode=OneWay}" />
              <ControlExampleSubstitution Key="BackButtonEn" Value="{x:Bind enableCheck.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="HeaderText" Value="{x:Bind headerText.Text, Mode=OneWay}" />
              <ControlExampleSubstitution Key="ShowHeader" Value="{x:Bind headerCheck.IsChecked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="PaneTitleText" Value="{x:Bind paneText.Text, Mode=OneWay}" />
              <ControlExampleSubstitution Key="PaneCustomContentVis" Value="{x:Bind paneCustomContentVisibility, Mode=OneWay}" />
              <ControlExampleSubstitution Key="PaneFooterVis" Value="{x:Bind paneFooterVisibility, Mode=OneWay}" />
              <ControlExampleSubstitution Key="PaneDisplayMode" Value="{x:Bind nvSample.PaneDisplayMode, Mode=OneWay}" />
              <ControlExampleSubstitution Key="SelectionFollowsFocus" Value="{x:Bind nvSample.SelectionFollowsFocus, Mode=OneWay}" />
              <ControlExampleSubstitution Key="SelectsOnInvoked" Value="{x:Bind SamplePage2Item.SelectsOnInvoked, Mode=OneWay}" />
              <ControlExampleSubstitution Key="NavViewASB" x:Name="navViewASB" />
            </ControlExample.Substitutions>
            <ControlExample.Example>
              <NavigationView x:Name="nvSample" Height="540" Margin="0,12,0,0" ExpandedModeThresholdWidth="500" Header="{x:Bind headerText.Text, Mode=TwoWay}" IsTabStop="False" PaneDisplayMode="Left" PaneTitle="{x:Bind paneText.Text, Mode=TwoWay}" SelectionChanged="NavigationView_SelectionChanged" class="navigationview-sample">
                <NavigationView.MenuItems>
                  <NavigationViewItem x:Name="SamplePage1Item" Content="{x:Bind Labels.MenuItem1, Mode=OneWay}" Tag="SamplePage1">
                    <NavigationViewItem.Icon>
                      <SymbolIcon Symbol="Play" />
                    </NavigationViewItem.Icon>
                  </NavigationViewItem>
                  <NavigationViewItemHeader Content="{x:Bind Labels.Actions, Mode=OneWay}" />
                  <NavigationViewItem x:Name="SamplePage2Item" Content="{x:Bind Labels.MenuItem2, Mode=OneWay}" SelectsOnInvoked="{x:Bind selectsOnInvoked, Mode=OneWay}" Tag="SamplePage2">
                    <NavigationViewItem.Icon>
                      <SymbolIcon Symbol="Save" />
                    </NavigationViewItem.Icon>
                  </NavigationViewItem>
                  <NavigationViewItem x:Name="SamplePage3Item" Content="{x:Bind Labels.MenuItem3, Mode=OneWay}" Tag="SamplePage3">
                    <NavigationViewItem.Icon>
                      <SymbolIcon Symbol="Refresh" />
                    </NavigationViewItem.Icon>
                  </NavigationViewItem>
                </NavigationView.MenuItems>
                <NavigationView.PaneCustomContent>
                  <HyperlinkButton x:Name="PaneHyperlink" Margin="12,0" Content="{x:Bind Labels.MoreInfo, Mode=OneWay}" Visibility="{x:Bind paneCustomContentVisibility, Mode=OneWay}" />
                </NavigationView.PaneCustomContent>
                <NavigationView.AutoSuggestBox>
                  <AutoSuggestBox AutomationProperties.Name="{x:Bind Labels.Search, Mode=OneWay}" QueryIcon="Find"  />
                </NavigationView.AutoSuggestBox>
                <NavigationView.PaneFooter>
                  <StackPanel x:Name="FooterStackPanel" Orientation="{x:Bind paneFooterOrientation, Mode=OneWay}" Visibility="{x:Bind paneFooterVisibility, Mode=OneWay}">
                    <NavigationViewItem AutomationProperties.Name="{x:Bind Labels.Download, Mode=OneWay}" Icon="Download" />
                    <NavigationViewItem AutomationProperties.Name="{x:Bind Labels.Favorite, Mode=OneWay}" Icon="Favorite" />
                  </StackPanel>
                </NavigationView.PaneFooter>
                <Frame x:Name="contentFrame" />
              </NavigationView>
            </ControlExample.Example>
            <ControlExample.Output><TextBlock class="navigationview-output" Text="{x:Bind Outputs.Api, Mode=OneWay}" TextWrapping="WrapWholeWords" /></ControlExample.Output>
          </ControlExample>
          <VisualStateManager.VisualStateGroups>
            <VisualStateGroup>
              <VisualState>
                <VisualState.StateTriggers>
                  <AdaptiveTrigger MinWindowWidth="{x:Bind nvSample2.CompactModeThresholdWidth}" />
                </VisualState.StateTriggers>
                <VisualState.Setters>
                  <Setter Target="nvSample2.PaneDisplayMode" Value="Top" />
                </VisualState.Setters>
              </VisualState>
            </VisualStateGroup>
          </VisualStateManager.VisualStateGroups>
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
  </Page>
</template>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, h, inject, markRaw, onBeforeUnmount, onMounted, provide, ref, shallowReactive } from 'vue'
import Button from '../../components/Button.vue'
import CheckBox from '../../components/CheckBox.vue'
import ControlExample from '../../components/ControlExample.vue'
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties'
import Frame from '../../components/Frame.vue'
import Grid from '../../components/Grid.vue'
import HyperlinkButton from '../../components/HyperlinkButton.vue'
import AutoSuggestBox from '../../components/AutoSuggestBox.vue'
import NavigationView from '../../components/NavigationView.vue'
import { MenuItemTemplateSelector, NavigationViewItem, NavigationViewItemHeader } from '../../components/NavigationViewProperties'
import Page from '../../components/Page.vue'
import RadioButton from '../../components/RadioButton.vue'
import RadioButtons from '../../components/RadioButtons.vue'
import RichTextBlock from '../../components/RichTextBlock.vue'
import ScrollViewer from '../../components/ScrollViewer.vue'
import StackPanel from '../../components/StackPanel.vue'
import SymbolIcon from '../../components/SymbolIcon.vue'
import TextBlock from '../../components/TextBlock.vue'
import TextBox from '../../components/TextBox.vue'
import ToggleButton from '../../components/ToggleButton.vue'
import { DataTemplate } from '../../components/CollectionProperties'
import AcrylicBrush from '../../components/AcrylicBrush'
import { ResourceDictionary, SolidColorBrush } from '../../components/xamlPrimitives'
import { normalizeXamlNodes, resolveXamlValue, xamlNameScopeKey } from '../../components/xamlRuntime'
import { useI18n } from '../../components/i18n/index'
import { createPageState } from '../../utils/pageState'
import NavigationViewSamplePage from '../components/NavigationViewSamplePage.vue'
import defaultDefinition from '../samples/NavigationView/NavigationviewDefaultPanedisplaymode.txt?raw'
import topDefinition from '../samples/NavigationView/NavigationviewPanedisplaymodeTop.txt?raw'
import adaptiveDefinition from '../samples/NavigationView/NavigationviewSwitchesPaneOrientation.txt?raw'
import tabsDefinition from '../samples/NavigationView/NavigationViewTyingSelectionFocusTabs.txt?raw'
import dataBindingDefinition from '../samples/NavigationView/NavigationViewDataBinding.txt?raw'
import footerDefinition from '../samples/NavigationView/NavigationviewFooterMenuItems.txt?raw'
import hierarchyDefinition from '../samples/NavigationView/HierarchicalNavigationview.txt?raw'
import apiDefinition from '../samples/NavigationView/NavigationViewApiAction.txt?raw'

defineOptions({ name: 'NavigationViewPage' })
const { t } = useI18n()
const currentPage = inject<{ value: string } | null>('currentPage', null)
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || 'navigationview')
const namescope = shallowReactive<Record<string, any>>({})
provide(xamlNameScopeKey, namescope)
const resourceKeys = {
  Description: "text.navigationview-description",
  DefaultHeader: "sample.navigationview.default-header",
  TopHeader: "sample.navigationview.top-header",
  AdaptiveHeader: "sample.navigationview.adaptive-header",
  TabsHeader: "sample.navigationview.tabs-header",
  DataBindingHeader: "sample.navigationview.data-binding-header",
  FooterHeader: "sample.navigationview.footer-header",
  HierarchicalHeader: "sample.navigationview.hierarchical-header",
  ApiHeader: "sample.navigationview.api-header",
  DefaultDescription: "sample.navigationview.default-description",
  TopDescription: "sample.navigationview.top-description",
  AdaptiveDescription: "sample.navigationview.adaptive-description",
  TabsDescription: "sample.navigationview.tabs-description",
  DataBindingDescription: "sample.navigationview.data-binding-description",
  FooterDescription: "sample.navigationview.footer-description",
  HierarchyDescription1: "sample.navigationview.hierarchy-description-1",
  HierarchyDescription2: "sample.navigationview.hierarchy-description-2",
  HierarchyDescription3: "sample.navigationview.hierarchy-description-3",
  HierarchyDescription4: "sample.navigationview.hierarchy-description-4",
  HeaderText: "sample.navigationview.header-text",
  MenuItem1: "sample.navigationview.menu-item-1",
  MenuItem2: "sample.navigationview.menu-item-2",
  MenuItem3: "sample.navigationview.menu-item-3",
  MenuItem4: "sample.navigationview.menu-item-4",
  Item1: "sample.navigationview.item-1",
  Item2: "sample.navigationview.item-2",
  Item3: "sample.navigationview.item-3",
  Item4: "sample.navigationview.item-4",
  SamplePage: "sample.navigationview.sample-page",
  SettingsPage: "sample.navigationview.settings-page",
  LoremTitle: "sample.navigationview.lorem-title",
  LoremBody: "sample.navigationview.lorem-body",
  Category: "sample.navigationview.category",
  CategoryTooltip: "sample.navigationview.category-tooltip",
  Browse: "sample.navigationview.browse",
  TrackOrder: "sample.navigationview.track-order",
  OrderHistory: "sample.navigationview.order-history",
  Account: "sample.navigationview.account",
  YourCart: "sample.navigationview.your-cart",
  Help: "sample.navigationview.help",
  PanePosition: "sample.navigationview.pane-position",
  PanePositionProperty: "sample.navigationview.pane-position-property",
  LeftMode: "sample.navigationview.left-mode",
  TopMode: "sample.navigationview.top-mode",
  LeftCompactMode: "sample.navigationview.left-compact-mode",
  Home: "sample.navigationview.home",
  Mail: "sample.navigationview.mail",
  Calendar: "sample.navigationview.calendar",
  DocumentOptions: "sample.navigationview.document-options",
  CreateNew: "sample.navigationview.create-new",
  UploadFile: "sample.navigationview.upload-file",
  SettingsVisible: "sample.navigationview.settings-visible",
  BackVisible: "sample.navigationview.back-visible",
  BackEnabled: "sample.navigationview.back-enabled",
  AutosuggestVisible: "sample.navigationview.autosuggest-visible",
  HeaderLabel: "sample.navigationview.header-label",
  HeaderValue: "sample.navigationview.header-value",
  AlwaysShowHeader: "sample.navigationview.always-show-header",
  PaneTitleLabel: "sample.navigationview.pane-title-label",
  PaneTitleValue: "sample.navigationview.pane-title-value",
  PaneCustomVisible: "sample.navigationview.pane-custom-visible",
  PaneFooterVisible: "sample.navigationview.pane-footer-visible",
  Left: "sample.navigationview.left",
  Top: "sample.navigationview.top",
  KeyboardSelectionFollowsFocus: "sample.navigationview.keyboard-selection-follows-focus",
  SuppressMenuItem2: "sample.navigationview.suppress-menu-item-2",
  Actions: "sample.navigationview.actions",
  MoreInfo: "sample.navigationview.more-info",
  Search: "sample.navigationview.search",
  Download: "sample.navigationview.download",
  Favorite: "sample.navigationview.favorite",
  ChangeTheme: "sample.navigationview.change-theme",
  AddFavorite: "sample.navigationview.add-favorite",
  RemoveFavorite: "sample.navigationview.remove-favorite",
  HeaderProperty: "sample.navigationview.header-property",
  PaneTitleProperty: "sample.navigationview.pane-title-property",
  LoremShortBody: "sample.navigationview.lorem-short-body",
}
const Labels = computed(() => Object.fromEntries(Object.entries(resourceKeys).map(([key, resource]) => [key, t(resource)])))
const pageTitle = computed(() => t('text.navigationview'))
const pageDescription = computed(() => t('text.navigationview-description'))
const favoriteButtonName = computed(() => t(isFavoriteState.value ? 'sample.navigationview.remove-favorite' : 'sample.navigationview.add-favorite'))
const favoriteGlyph = computed(() => isFavoriteState.value ? '\uE735' : '\uE734')

// The XAML text objects preserve the official RichTextBlock/Paragraph hierarchy.
const Paragraph = defineComponent({ name: 'Paragraph', setup(_, { slots }) {
  const instance = getCurrentInstance()
  return () => h('p', normalizeXamlNodes(slots.default?.() ?? [], instance))
} })
const Run = defineComponent({ name: 'Run', props: { Text: { type: String, default: '' } }, setup(props) {
  const instance = getCurrentInstance()
  return () => h('span', String(resolveXamlValue(props.Text, instance) ?? ''))
} })
const LineBreak = defineComponent({ name: 'LineBreak', setup: () => () => h('br') })
// These resource and visual-state objects never enter the content visual tree.
const structural = (name: string) => defineComponent({ name, setup: () => () => null })
const VisualStateManager = { VisualStateGroups: structural('VisualStateManager.VisualStateGroups') }
const VisualStateGroup = structural('VisualStateGroup')
const VisualState = Object.assign(structural('VisualState'), { StateTriggers: structural('VisualState.StateTriggers'), Setters: structural('VisualState.Setters') })
const AdaptiveTrigger = structural('AdaptiveTrigger')
const Setter = structural('Setter')

const Categories = computed(() => ['Home', 'Keyboard', 'Library', 'Mail'].map((Glyph, index) => ({
  Name: t('sample.navigationview.category', { number: index + 1 }),
  Tooltip: t('sample.navigationview.category-tooltip', { number: index + 1 }),
  Glyph,
  Number: index + 1
})))
const samplePageTypes = Object.fromEntries(['SamplePage1', 'SamplePage2', 'SamplePage3', 'SamplePage4', 'SamplePage5', 'SamplePage6', 'SamplePage7', 'SampleSettingsPage'].map(Page => [Page, markRaw(defineComponent({
  name: Page,
  props: ['Parameter', 'NavigationTransitionInfo', 'NavigationVersion'],
  setup(props) { return () => h(NavigationViewSamplePage, { Page, NavigationTransitionInfo: props.NavigationTransitionInfo, NavigationVersion: props.NavigationVersion }) }
}))]))
const navigationResults = shallowReactive<Record<string, { Item: string; Page: string }>>({})
const Outputs = computed(() => Object.fromEntries(['Default', 'Top', 'Adaptive', 'Tabs', 'DataBinding', 'Footer', 'Hierarchy', 'Api'].map(key => {
  const result = navigationResults[key]
  const page = result?.Page === 'SampleSettingsPage'
    ? t('sample.navigationview.settings-page')
    : t('sample.navigationview.sample-page', { number: result?.Page.match(/(\d+)$/)?.[1] ?? '' })
  return [key, result ? t('sample.navigationview.selection-output', { item: result.Item, page }) : t('sample.navigationview.no-selection')]
})))
const navigateSelection = (key: string, sampleName: string, frameName: string, sender: any, args: any, updateHeader = false, category = false, transition = false) => {
  if (!args?.SelectedItem && !args?.IsSettingsSelected) {
    delete navigationResults[key]
    return
  }
  const selected = args.SelectedItem
  const Page = args.IsSettingsSelected ? 'SampleSettingsPage' : category ? 'SamplePage1' : selected.Tag
  const pageType = samplePageTypes[Page]
  const nav = namescope[sampleName] ?? sender
  const frame = namescope[frameName]
  if (!pageType || !frame) return
  const navigated = key === 'Tabs'
    ? frame.NavigateToType?.(pageType, null, { TransitionInfoOverride: args.RecommendedNavigationTransitionInfo, IsNavigationStackEnabled: false })
    : frame.Navigate?.(pageType, null, transition ? args.RecommendedNavigationTransitionInfo : null)
  if (!navigated) return
  if (updateHeader && !args.IsSettingsSelected) nav.Header = t('sample.navigationview.sample-page', { number: category ? selected.Number ?? String(selected.Name).match(/(\d+)$/)?.[1] : String(Page).match(/(\d+)$/)?.[1] })
  navigationResults[key] = { Item: args.IsSettingsSelected ? t('sample.navigationview.settings-item') : String(selected.Content ?? selected.Name ?? ''), Page }
}
const NavigationView_SelectionChanged5 = (sender: any, args = sender) => navigateSelection('Default', 'nvSample5', 'contentFrame5', sender, args, true)
const NavigationView_SelectionChanged6 = (sender: any, args = sender) => navigateSelection('Top', 'nvSample6', 'contentFrame6', sender, args)
const NavigationView_SelectionChanged2 = (sender: any, args = sender) => navigateSelection('Adaptive', 'nvSample2', 'contentFrame2', sender, args)
const NavigationView_SelectionChanged7 = (sender: any, args = sender) => navigateSelection('Tabs', 'nvSample7', 'contentFrame7', sender, args, false, false, true)
const NavigationView_SelectionChanged4 = (sender: any, args = sender) => navigateSelection('DataBinding', 'nvSample4', 'contentFrame4', sender, args, true, true)
const NavigationView_SelectionChanged9 = (sender: any, args = sender) => navigateSelection('Footer', 'nvSample9', 'contentFrame9', sender, args, false, false, true)
const NavigationView_SelectionChanged8 = (sender: any, args = sender) => navigateSelection('Hierarchy', 'nvSample8', 'contentFrame8', sender, args, true)
const NavigationView_SelectionChanged = (sender: any, args = sender) => navigateSelection('Api', 'nvSample', 'contentFrame', sender, args, true)

const apiAutoSuggest = ref(true)
let initialAutoSuggestBox: any = null
const paneCustomContentVisibility = ref('Collapsed')
const paneFooterVisibility = ref('Collapsed')
const paneFooterOrientation = ref('Vertical')
const selectsOnInvoked = ref(true)
const checked = (sender: any) => sender?.IsChecked === true
const settingsCheck_Click = (sender: any) => { if (namescope.nvSample) namescope.nvSample.IsSettingsVisible = checked(sender) }
const visibleCheck_Click = (sender: any) => { if (namescope.nvSample) namescope.nvSample.IsBackButtonVisible = checked(sender) ? 'Visible' : 'Collapsed' }
const enableCheck_Click = (sender: any) => { if (namescope.nvSample) namescope.nvSample.IsBackEnabled = checked(sender) }
const autoSuggestCheck_Click = (sender: any) => {
  apiAutoSuggest.value = checked(sender)
  if (namescope.nvSample) namescope.nvSample.AutoSuggestBox = apiAutoSuggest.value ? initialAutoSuggestBox : null
  setASBSubstitutionString()
}
const headerCheck_Click = (sender: any) => { if (namescope.nvSample) namescope.nvSample.AlwaysShowHeader = checked(sender) }
const panemc_Check_Click = (sender: any) => { paneCustomContentVisibility.value = checked(sender) ? 'Visible' : 'Collapsed' }
const paneFooterCheck_Click = (sender: any) => { paneFooterVisibility.value = checked(sender) ? 'Visible' : 'Collapsed' }
const sffCheck_Click = (sender: any) => { if (namescope.nvSample) namescope.nvSample.SelectionFollowsFocus = checked(sender) ? 'Enabled' : 'Disabled' }
const suppressselectionCheck_Checked_Click = (sender: any) => {
  selectsOnInvoked.value = !checked(sender)
  if (namescope.SamplePage2Item) namescope.SamplePage2Item.SelectsOnInvoked = selectsOnInvoked.value
}
const radioName = (sender: any) => sender?.Name ?? Object.keys(namescope).find(name => namescope[name] === sender)
const setPanePosition = (sender: any, mode: string) => {
  if (!checked(sender)) return
  const name = String(radioName(sender) ?? '')
  const sampleName = name.replace(/(?:LeftCompact|Left|Top)$/, '')
  const nav = namescope[sampleName]
  if (!nav) return
  for (const option of ['Left', 'Top', 'LeftCompact']) {
    const radio = namescope[sampleName + option]
    if (radio) radio.IsChecked = mode === option
  }
  nav.PaneDisplayMode = mode
  nav.IsPaneOpen = mode === 'Left'
  if (sampleName === 'nvSample') paneFooterOrientation.value = mode === 'Top' ? 'Horizontal' : 'Vertical'
}
const panePositionLeft_Checked = (sender: any) => setPanePosition(sender, 'Left')
const panePositionTop_Checked = (sender: any) => setPanePosition(sender, 'Top')
const panePositionLeftCompact_Checked = (sender: any) => setPanePosition(sender, 'LeftCompact')
const updateAdaptiveState = () => {
  const nav = namescope.nvSample2
  if (nav) nav.PaneDisplayMode = window.innerWidth >= Number(nav.CompactModeThresholdWidth ?? 641) ? 'Top' : 'Auto'
}
const setASBSubstitutionString = () => {
  if (namescope.navViewASB) namescope.navViewASB.Value = apiAutoSuggest.value
    ? '\n    <NavigationView.AutoSuggestBox>\n        <AutoSuggestBox QueryIcon="Find" AutomationProperties.Name="Search" />\n    </NavigationView.AutoSuggestBox>\n'
    : ''
}
const initialSelections = [
  ['nvSample2', NavigationView_SelectionChanged2], ['nvSample5', NavigationView_SelectionChanged5],
  ['nvSample6', NavigationView_SelectionChanged6], ['nvSample7', NavigationView_SelectionChanged7],
  ['nvSample8', NavigationView_SelectionChanged8], ['nvSample9', NavigationView_SelectionChanged9]
] as const
onMounted(() => {
  for (const [name, handler] of initialSelections) {
    const nav = namescope[name]
    const item = nav?.MenuItems?.[0]
    if (!item) continue
    nav.SelectedItem = item
    const frameName = name.replace('nvSample', 'contentFrame')
    if (!namescope[frameName]?.CurrentSourcePageType) handler(nav, { SelectedItem: item, IsSettingsSelected: false })
  }
  if (namescope.nvSample4) {
    namescope.nvSample4.SelectedItem = Categories.value[0]
    if (!namescope.contentFrame4?.CurrentSourcePageType) NavigationView_SelectionChanged4(namescope.nvSample4, { SelectedItem: Categories.value[0], IsSettingsSelected: false })
  }
  initialAutoSuggestBox = namescope.nvSample?.AutoSuggestBox ?? null
  setASBSubstitutionString()
  updateAdaptiveState()
  window.addEventListener('resize', updateAdaptiveState)
})
onBeforeUnmount(() => window.removeEventListener('resize', updateAdaptiveState))

const definitions = { Default: defaultDefinition, Top: topDefinition, Adaptive: adaptiveDefinition, Tabs: tabsDefinition, DataBinding: dataBindingDefinition, Footer: footerDefinition, Hierarchy: hierarchyDefinition, Api: apiDefinition }
const section = (definition: string, name: string) => [...definition.matchAll(/--- (header|xaml|c#)\s*\r?\n([\s\S]*?)(?=\r?\n--- |$)/g)].find(match => match[1] === name)?.[2]?.trim() ?? ''
const xamlEscape = (value: unknown) => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const SampleXaml = computed(() => {
  const nav = namescope.nvSample
  const substitutions: Record<string, unknown> = {
    SettingsVis: nav?.IsSettingsVisible ?? true,
    BackButtonVis: nav?.IsBackButtonVisible ?? 'Auto', BackButtonEn: nav?.IsBackEnabled ?? false,
    HeaderText: nav?.Header ?? Labels.value.HeaderValue, ShowHeader: nav?.AlwaysShowHeader ?? true,
    PaneTitleText: nav?.PaneTitle ?? Labels.value.PaneTitleValue,
    PaneCustomContentVis: paneCustomContentVisibility.value, PaneFooterVis: paneFooterVisibility.value,
    PaneDisplayMode: nav?.PaneDisplayMode ?? 'Left', SelectionFollowsFocus: nav?.SelectionFollowsFocus ?? 'Disabled',
    SelectsOnInvoked: selectsOnInvoked.value,
    NavViewASB: apiAutoSuggest.value ? '\n    <NavigationView.AutoSuggestBox>\n        <AutoSuggestBox QueryIcon="Find" AutomationProperties.Name="Search" />\n    </NavigationView.AutoSuggestBox>\n' : ''
  }
  return Object.fromEntries(Object.entries(definitions).map(([key, definition]) => [key, section(definition, 'xaml').replace(/\$\((\w+)\)/g, (_, name: string) => {
    if (name === 'PaneDisplay') return xamlEscape(key === 'Footer' ? namescope.nvSample9?.PaneDisplayMode ?? 'Left' : namescope.nvSample8?.PaneDisplayMode ?? 'Left')
    if (name === 'NavViewASB') return String(substitutions[name] ?? '')
    const value = substitutions[name]
    return xamlEscape(typeof value === 'boolean' ? value ? 'True' : 'False' : value)
  })]))
})
const SampleCSharp = computed(() => ({ Tabs: section(tabsDefinition, 'c#'), DataBinding: section(dataBindingDefinition, 'c#') }))
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 72px 8px 0; font-size: 28px; font-weight: 600; }
.page-description { margin: 0 72px 16px 0; color: var(--text-secondary); line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; gap: 4px; }
.icon { font-size: 16px; line-height: 16px; }
.gallery-page-content, .navigationview-sample-layout { width: 100%; min-width: 0; max-width: 100%; }
.navigationview-sample { width: 100%; min-width: 0; max-width: 100%; overflow: hidden; }
.hierarchy-description { margin-bottom: 15px; }
.navigationview-output { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
.navigationview-samples :deep(.navigationview-example) { margin-top: 16px; }
.navigationview-samples :deep(.navigationview-example .control-example-frame .example-container) {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto;
}
.navigationview-samples :deep(.navigationview-example .control-example-frame .example-container.has-options) {
  /* Keep the display column stable while option values (for example a long
     Header or PaneTitle) change. The official Options presenter is capped at
     320px; reserving that track prevents the NavigationView from being
     remeasured when the controls wrap. */
  grid-template-columns: minmax(0, 1fr) 320px;
}
.navigationview-samples :deep(.navigationview-example .control-example-frame .example-display) {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}
.navigationview-samples :deep(.navigationview-example .control-example-frame .example-output) {
  grid-column: 1;
  grid-row: 2;
  justify-self: stretch;
  max-width: none;
  margin: 0 12px 12px;
}
.navigationview-samples :deep(.navigationview-example .control-example-frame .example-options) {
  grid-column: 2;
  grid-row: 1 / span 2;
  min-width: 0;
  width: auto;
  max-width: 320px;
}
.navigationview-samples :deep(.navigationview-example .example-options .win-checkbox),
.navigationview-samples :deep(.navigationview-example .example-options .win-radio-button) { max-width: 100%; }
.navigationview-samples :deep(.navigationview-example .example-options .checkbox-content),
.navigationview-samples :deep(.navigationview-example .example-options .win-radio-content) { white-space: normal; overflow-wrap: anywhere; }
@media (max-width: 739px) {
  .navigationview-samples :deep(.navigationview-example .control-example-frame .example-container),
  .navigationview-samples :deep(.navigationview-example .control-example-frame .example-container.has-options) { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
  .navigationview-samples :deep(.navigationview-example .control-example-frame .example-display) { grid-column: 1; grid-row: 1; min-width: 0; }
  .navigationview-samples :deep(.navigationview-example .control-example-frame .example-output) { grid-column: 1; grid-row: 2; justify-self: stretch; max-width: none; margin: 0 12px 12px; }
  .navigationview-samples :deep(.navigationview-example .control-example-frame .example-options) { grid-column: 1; grid-row: 3; max-width: none; margin-top: 24px; border-left: 0; border-top: 1px solid var(--DividerStrokeColorDefaultBrush, var(--stroke-divider)); }
}
</style>
