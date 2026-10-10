import{$i as e,Bi as t,Ei as n,En as r,Ji as i,Li as ee,Mn as a,Xi as o,_i as s,a as c,bi as te,ci as l,gi as u,ki as ne,o as d,or as f,p,t as m,ui as h,vi as g,wi as re,yi as ie}from"./ScrollViewer-B43ymvAj.js";import{t as _}from"./Button-B49t7g4C.js";import{o as v,s as y}from"./ItemsView-BZtcyp6v.js";import{t as ae}from"./Image-DEHWrAx2.js";import{t as b}from"./StackPanel-Dy6dKYi5.js";import{t as oe}from"./ToggleButton-DDZy2gVz.js";import{t as se}from"./MediaPlayerElement-BV-TZQ5E.js";import{t as x}from"./ControlExample-Ddvmn5_c.js";import{t as S}from"./ToggleSwitch-BF1aWkaE.js";import{t as C}from"./ContentDialog-BljMl00e.js";import{t as ce}from"./pageState-BQHW0me4.js";var le=`<Grid MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="*" />
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*" />
        <ColumnDefinition Width="100" />
    </Grid.ColumnDefinitions>
    <TextBlock x:Name="frameSourceName" Grid.Row="0" Grid.Column="0" VerticalAlignment="Center" />
    <MediaPlayerElement x:Name="captureElement" Grid.Row="1" Grid.Column="0" Stretch="Uniform" AutoPlay="True" />
    <TextBlock x:Name="capturedText" Visibility="Collapsed" Grid.Row="0" Grid.Column="1" VerticalAlignment="Center" Text="Captured:" />
    <Grid x:Name="captureContainer" Grid.Row="1" Grid.Column="1">
        <ScrollViewer VerticalScrollMode="Enabled">
            <StackPanel x:Name="snapshots" Spacing="2" />
        </ScrollViewer>
    </Grid>
</Grid>
`,ue=`using Windows.Media.Capture.Frames;
using Windows.Media.Capture;

    private MediaFrameSourceGroup mediaFrameSourceGroup;
    private MediaCapture mediaCapture;

    async private void StartCaptureElement()
    {
        var groups = await MediaFrameSourceGroup.FindAllAsync();
        if (groups.Count == 0)
        {
            frameSourceName.Text = "No camera devices found.";
            return;
        }
        mediaFrameSourceGroup = groups.First();

        frameSourceName.Text = "Viewing: " + mediaFrameSourceGroup.DisplayName;
        mediaCapture = new MediaCapture();
        var mediaCaptureInitializationSettings = new MediaCaptureInitializationSettings()
        {
            SourceGroup = this.mediaFrameSourceGroup,
            SharingMode = MediaCaptureSharingMode.SharedReadOnly,
            StreamingCaptureMode = StreamingCaptureMode.Video,
            MemoryPreference = MediaCaptureMemoryPreference.Cpu
        };
        await mediaCapture.InitializeAsync(mediaCaptureInitializationSettings);

        // Set the MediaPlayerElement's Source property to the MediaSource for the mediaCapture.
        var frameSource = mediaCapture.FrameSources[this.mediaFrameSourceGroup.SourceInfos[0].Id];
        captureElement.Source = Windows.Media.Core.MediaSource.CreateFromMediaFrameSource(frameSource);
$(MirrorPreview)    }

    async private void CapturePhoto_Click(object sender, RoutedEventArgs e)
    {
        // Capture a photo to a stream
        var imgFormat = ImageEncodingProperties.CreateJpeg();
        var stream = new InMemoryRandomAccessStream();
        await mediaCapture.CapturePhotoToStreamAsync(imgFormat, stream);
        stream.Seek(0);

        // Show the photo in an Image element
        BitmapImage bmpImage = new BitmapImage();
        await bmpImage.SetSourceAsync(stream);
        var image = new Image() { Source = bmpImage };
        snapshots.Children.Insert(0, image);

        capturedText.Visibility = Visibility.Visible;
    }
`,de=`<!-- Optional camera switching extension -->
<Grid>
    <MediaPlayerElement x:Name="captureElement" AutoPlay="True" Stretch="Uniform" />
    <Button x:Name="switchCameraButton"
            Width="32" Height="32" MinWidth="32" Padding="0" Margin="8"
            HorizontalAlignment="Right" VerticalAlignment="Top"
            HorizontalContentAlignment="Center" VerticalContentAlignment="Center"
            Click="SwitchCamera_Click"
            Loaded="CameraSwitch_Loaded"
            Visibility="Collapsed"
            AutomationProperties.Name="Switch camera"
            ToolTipService.ToolTip="Switch camera">
        <FontIcon Glyph="&#xE89E;" FontSize="16" Width="16" Height="16"
                  HorizontalAlignment="Center" VerticalAlignment="Center" />
    </Button>
</Grid>

<StackPanel Spacing="8">
    <ToggleSwitch x:Name="cameraSwitchingOption"
                  Header="Camera switching"
                  IsOn="$(CameraSwitchingEnabled)"
                  Toggled="CameraSwitchingOption_Toggled" />
</StackPanel>
`,w=`// Optional camera switching extension to CaptureElementPreviewPage.
public bool IsCameraSwitchingEnabled { get; set; } = $(CameraSwitchingEnabled);
private IReadOnlyList<MediaFrameSourceGroup> cameraGroups = Array.Empty<MediaFrameSourceGroup>();
private bool switchingCamera;

private async void CameraSwitch_Loaded(object sender, RoutedEventArgs e)
{
    await RefreshCameraGroupsAsync();
}

private async Task RefreshCameraGroupsAsync()
{
    cameraGroups = await MediaFrameSourceGroup.FindAllAsync();
    switchCameraButton.Visibility = IsCameraSwitchingEnabled && cameraGroups.Count > 1
        ? Visibility.Visible : Visibility.Collapsed;
}

private void CameraSwitchingOption_Toggled(object sender, RoutedEventArgs e)
{
    IsCameraSwitchingEnabled = ((ToggleSwitch)sender).IsOn;
    switchCameraButton.Visibility = IsCameraSwitchingEnabled && cameraGroups.Count > 1
        ? Visibility.Visible : Visibility.Collapsed;
}

private async void SwitchCamera_Click(object sender, RoutedEventArgs e)
{
    if (!IsCameraSwitchingEnabled || switchingCamera) return;
    switchingCamera = true;
    switchCameraButton.IsEnabled = false;
    captureButton.IsEnabled = false;
    try
    {
        await RefreshCameraGroupsAsync();
        if (cameraGroups.Count < 2) return;
        int index = cameraGroups.ToList().FindIndex(group => group.Id == mediaFrameSourceGroup?.Id);
        mediaFrameSourceGroup = cameraGroups[(index + 1) % cameraGroups.Count];
        captureElement.Source = null;
        mediaCapture?.Dispose();
        mediaCapture = new MediaCapture();
        await mediaCapture.InitializeAsync(new MediaCaptureInitializationSettings
        {
            SourceGroup = mediaFrameSourceGroup,
            SharingMode = MediaCaptureSharingMode.SharedReadOnly,
            StreamingCaptureMode = StreamingCaptureMode.Video,
            MemoryPreference = MediaCaptureMemoryPreference.Cpu
        });
        var frameSource = mediaCapture.FrameSources[mediaFrameSourceGroup.SourceInfos[0].Id];
        captureElement.Source = Windows.Media.Core.MediaSource.CreateFromMediaFrameSource(frameSource);
        frameSourceName.Text = "Viewing: " + mediaFrameSourceGroup.DisplayName;
    }
    catch (Exception)
    {
        captureElement.Source = null;
        mediaCapture?.Dispose();
        mediaCapture = null;
    }
    finally
    {
        switchingCamera = false;
        switchCameraButton.IsEnabled = true;
        captureButton.IsEnabled = mediaCapture != null;
    }
}
`,T=a(s({__name:`CaptureElementPage`,props:{IsCameraSwitchingEnabled:{type:[Boolean,String],default:!0}},setup(a){let T=a,fe=g(),E=l(()=>{let e=f(T.IsCameraSwitchingEnabled,fe);return e===!0||typeof e==`string`&&e.trim().toLowerCase()===`true`}),D=i(!0);ee(E,e=>{D.value=e},{immediate:!0});let{t:O}=p();O(`text.capture-element-camera-preview`),O(`text.capture-element-description`),O(`sample.capture.preview`),O(`gallery.page-header.toggle-theme`),O(`gallery.page-header.favorite`),O(`sample.capture.captured-label`),O(`sample.capture.mirror-preview`),O(`sample.capture.mirror-tooltip`),O(`sample.capture.capture-photo`),O(`sample.capture.enable-camera-switching`),O(`sample.capture.switch-camera`);let pe=i(``),me=i(``),he=i(``),k=i(``),A=i(`None`),j=null,M=te(`currentPage`),{isFavoriteState:N,pageTheme:ge,toggleTheme:_e,toggleFavorite:ve}=ce(l(()=>M?.value||`captureelement`).value);l(()=>N.value?``:``);let P=i(!1);l(()=>P.value?{ScaleX:-1,ScaleY:1}:null);let F=o(null),I=o(null),L=i(!1),R=i(``),z=i(``),B=i(``),V=i(!1),H=i(!1),U=o([]),W=i(``),G=l(()=>E.value&&D.value&&U.value.length>1);l(()=>G.value?`Visible`:`Collapsed`),l(()=>G.value&&!H.value&&!V.value);let K=i([]);l(()=>K.value.length?`Visible`:`Collapsed`),l(()=>!!(F.value&&L.value&&!V.value&&!H.value)),l(()=>R.value===`viewing`?O(`sample.capture.viewing`,{name:z.value}):R.value?O(`sample.capture.${R.value}`):``);let ye=l(()=>P.value?`
        // Mirror the preview
        captureElement.RenderTransform = new ScaleTransform() { ScaleX = -1 };
        captureElement.RenderTransformOrigin = new Point(0.5, 0.5);
`:``);l(()=>le+`

`+de.replaceAll(`$(CameraSwitchingEnabled)`,D.value?`True`:`False`)),l(()=>ue.replaceAll(`$(MirrorPreview)`,ye.value)+`

`+w.replaceAll(`$(CameraSwitchingEnabled)`,D.value?`true`:`false`));let q=()=>{L.value=!!(F.value&&I.value?.srcObject===F.value&&I.value.readyState>=2&&I.value.videoWidth)},be=()=>{!F.value||I.value?.srcObject!==F.value||(R.value=`start-failed`,B.value=O(`sample.capture.start-failed`),Z())},xe=()=>{I.value?.removeEventListener(`loadeddata`,q),I.value?.removeEventListener(`playing`,q),I.value?.removeEventListener(`error`,be)},Se=s({name:`CaptureSnapshotImages`,inheritAttrs:!1,setup:()=>()=>K.value.map((e,t)=>ie(ae,{key:e.id,Source:e.source,Width:100,MaxWidth:100,Stretch:`Uniform`,"AutomationProperties.Name":O(`sample.capture.captured-photo`,{number:K.value.length-t})}))}),J=!1,Y=0,X=0,Z=()=>{++Y,F.value?.getTracks().forEach(e=>e.stop()),F.value=null,L.value=!1,H.value=!1,W.value=``,I.value&&(I.value.pause(),I.value.srcObject=null)},Q=async()=>{let e=++X;if(navigator.mediaDevices?.enumerateDevices)try{let t=await navigator.mediaDevices.enumerateDevices();if(J||e!==X)return;U.value=[...new Map(t.filter(e=>e.kind===`videoinput`&&e.deviceId).map(e=>[e.deviceId,e])).values()]}catch{!J&&e===X&&(U.value=[])}},$=()=>{Q()},Ce=async e=>{pe.value=O(e?`sample.capture.access-denied-title`:`sample.capture.error-title`),me.value=O(e?`sample.capture.privacy-message`:`sample.capture.start-failed`),he.value=e?O(`sample.capture.privacy-settings`):``,k.value=O(e?`sample.capture.cancel`:`sample.capture.ok`),A.value=e?`Primary`:`None`;let t=await j?.ShowAsync();!J&&t===`Primary`&&(window.location.href=`ms-settings:privacy-webcam`)},we=async e=>{Z(),W.value=e||``;let t=++Y;if(H.value=!0,!navigator.mediaDevices?.getUserMedia){R.value=`no-devices`,B.value=O(`sample.capture.no-devices`),H.value=!1;return}try{let n=await navigator.mediaDevices.getUserMedia({video:e?{deviceId:{exact:e}}:!0,audio:!1});if(J||t!==Y){n.getTracks().forEach(e=>e.stop());return}let r=n.getVideoTracks()[0];if(!r){n.getTracks().forEach(e=>e.stop()),R.value=`no-devices`,B.value=O(`sample.capture.no-devices`);return}r.addEventListener(`ended`,()=>{F.value!==n||J||(R.value=`start-failed`,B.value=O(`sample.capture.start-failed`),Z())},{once:!0}),z.value=r.label||O(`sample.capture.integrated-camera`),W.value=r.getSettings().deviceId||e||``,R.value=`viewing`,F.value=n,e&&(B.value=O(`sample.capture.viewing`,{name:z.value})),Q()}catch(e){if(J||t!==Y)return;let n=e instanceof DOMException?e.name:``;R.value=n===`NotAllowedError`||n===`SecurityError`?`access-denied`:n===`NotFoundError`||n===`DevicesNotFoundError`?`no-devices`:`start-failed`,B.value=O(`sample.capture.${R.value}`),R.value!==`no-devices`&&Ce(R.value===`access-denied`)}finally{!J&&t===Y&&(H.value=!1)}};return n(()=>{navigator.mediaDevices?.addEventListener(`devicechange`,$),we()}),re(()=>{J=!0,++X,navigator.mediaDevices?.removeEventListener(`devicechange`,$),j?.Hide(),j=null,xe(),Z(),I.value=null,K.value.forEach(e=>URL.revokeObjectURL(e.source))}),(n,i)=>(ne(),h(m,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(b,{class:`gallery-item-page`},{default:t(()=>[u(b,{class:`page-heading`},{default:t(()=>[u(d,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(d,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(b,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(_,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeLabel, Mode=OneWay}`},{default:t(()=>[u(d,{class:`icon`,Text:``})]),_:1}),u(oe,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:t(()=>[u(d,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),u(b,{class:`gallery-page-content`},{default:t(()=>[u(x,{"x:Name":`Example1`,class:`capture-gallery-example`,HeaderText:`{x:Bind exampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind captureXaml, Mode=OneWay}`,CSharp:`{x:Bind captureCSharp, Mode=OneWay}`},{default:t(()=>[u(x.Example,null,{default:t(()=>[u(m,{class:`capture-display-boundary`,Height:`300`,HorizontalScrollMode:`Enabled`,HorizontalScrollBarVisibility:`Auto`,VerticalScrollMode:`Disabled`,VerticalScrollBarVisibility:`Disabled`},{default:t(()=>[u(r,{class:`capture-preview-grid`,MinWidth:`400`,MinHeight:`300`,RowSpacing:`10`,ColumnSpacing:`4`},{default:t(()=>[u(r.RowDefinitions,null,{default:t(()=>[u(v,{Height:`Auto`}),u(v,{Height:`*`})]),_:1}),u(r.ColumnDefinitions,null,{default:t(()=>[u(y,{Width:`*`}),u(y,{Width:`100`})]),_:1}),u(d,{"x:Name":`frameSourceName`,"Grid.Row":`0`,"Grid.Column":`0`,VerticalAlignment:`Center`,Text:`{x:Bind frameSourceText, Mode=OneWay}`,TextTrimming:`CharacterEllipsis`}),u(r,{class:`capture-preview-host`,"Grid.Row":`1`,"Grid.Column":`0`},{default:t(()=>[u(se,{"x:Name":`captureElement`,class:`capture-live-preview`,AutoPlay:`True`,Stretch:`Uniform`,Source:`{x:Bind mediaCapture, Mode=OneWay}`,RenderTransform:`{x:Bind mirrorTransform, Mode=OneWay}`,RenderTransformOrigin:`0.5,0.5`,Loaded:`CaptureElement_Loaded`}),u(_,{"x:Name":`switchCameraButton`,class:`capture-camera-switch`,Width:`32`,Height:`32`,MinWidth:`32`,Padding:`0`,Margin:`8`,HorizontalAlignment:`Right`,VerticalAlignment:`Top`,HorizontalContentAlignment:`Center`,VerticalContentAlignment:`Center`,Click:`SwitchCamera_Click`,Visibility:`{x:Bind cameraSwitchVisibility, Mode=OneWay}`,IsEnabled:`{x:Bind canSwitchCamera, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind switchCameraLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind switchCameraLabel, Mode=OneWay}`},{default:t(()=>[u(c,{Glyph:``,FontSize:`16`,Width:`16`,Height:`16`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`})]),_:1})]),_:1}),u(d,{"x:Name":`capturedText`,"Grid.Row":`0`,"Grid.Column":`1`,VerticalAlignment:`Center`,Text:`{x:Bind capturedLabel, Mode=OneWay}`,Visibility:`{x:Bind capturedVisibility, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(r,{"x:Name":`captureContainer`,class:`capture-container`,"Grid.Row":`1`,"Grid.Column":`1`},{default:t(()=>[u(r,{class:`capture-expand-to-fill`},{default:t(()=>[u(m,{class:`capture-snapshots-scroll`,VerticalScrollMode:`Enabled`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:t(()=>[u(b,{"x:Name":`snapshots`,class:`capture-snapshots`,Spacing:`2`},{default:t(()=>[u(e(Se))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(x.Output,null,{default:t(()=>[u(d,{class:`capture-output`,Text:`{x:Bind outputText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),u(x.Options,null,{default:t(()=>[u(b,{class:`capture-options`},{default:t(()=>[u(S,{"x:Name":`mirrorSwitch`,Header:`{x:Bind mirrorLabel, Mode=OneWay}`,IsOn:`{x:Bind mirrorPreview, Mode=TwoWay}`,Toggled:`MirrorToggleSwitch_Toggled`,"ToolTipService.ToolTip":`{x:Bind mirrorTooltip, Mode=OneWay}`}),u(S,{"x:Name":`cameraSwitchingSwitch`,Header:`{x:Bind cameraSwitchingLabel, Mode=OneWay}`,IsOn:`{x:Bind cameraSwitchingEnabled, Mode=TwoWay}`,IsEnabled:`{x:Bind allowsCameraSwitching, Mode=OneWay}`,Toggled:`CameraSwitching_Toggled`}),u(_,{"x:Name":`captureButton`,Click:`CapturePhoto_Click`,Content:`{x:Bind captureLabel, Mode=OneWay}`,IsEnabled:`{x:Bind canCapture, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),u(C,{"x:Name":`CameraAccessDialog`,Loaded:`CameraDialog_Loaded`,Title:`{x:Bind cameraDialogTitle, Mode=OneWay}`,Content:`{x:Bind cameraDialogContent, Mode=OneWay}`,PrimaryButtonText:`{x:Bind cameraDialogPrimaryText, Mode=OneWay}`,CloseButtonText:`{x:Bind cameraDialogCloseText, Mode=OneWay}`,DefaultButton:`{x:Bind cameraDialogDefaultButton, Mode=OneWay}`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-880e4ddc`]]);export{T as default};