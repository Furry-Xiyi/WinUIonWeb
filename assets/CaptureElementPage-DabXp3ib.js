import{Ci as e,Ei as t,Gi as n,Li as r,Lt as i,Pi as a,Wt as o,_i as ee,a as te,ai as s,et as ne,gi as re,hi as ie,mi as c,nr as ae,o as oe,pi as l,qi as u,si as d,t as se,xi as ce}from"./ScrollViewer-BWDA_C78.js";import{t as le}from"./Button-BNDPNdYJ.js";import{o as ue,s as de}from"./ItemsView-CDH66l7e.js";import{t as fe}from"./ContentDialog-CoLzvISE.js";import{t as pe}from"./Image-i6y7QZ_e.js";import{t as me}from"./StackPanel-sg_Bd5oB.js";import{t as he}from"./MediaPlayerElement-5B779U1S.js";import{t as f}from"./ToggleButton-HP5wmrvH.js";import{t as ge}from"./ToggleSwitch-DmoyCBpS.js";import{t as _e}from"./ControlExample-CzGyf8u0.js";import{t as ve}from"./pageState-CcJibQcm.js";var ye=`<Grid MinWidth="400" MinHeight="300" RowSpacing="10" ColumnSpacing="4">
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
`,be=`using Windows.Media.Capture.Frames;
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
`,xe=`<!-- Optional camera switching extension -->
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
`,Se=`// Optional camera switching extension to CaptureElementPreviewPage.
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
`,p=c({__name:`CaptureElementPage`,props:{IsCameraSwitchingEnabled:{type:[Boolean,String],default:!0}},setup(t,{expose:r}){r();let o=t,l=ie(),d=s(()=>{let e=ae(o.IsCameraSwitchingEnabled,l);return e===!0||typeof e==`string`&&e.trim().toLowerCase()===`true`}),p=n(!0);a(d,e=>{p.value=e},{immediate:!0});let{t:m}=ne(),h=m(`text.capture-element-camera-preview`),Ce=m(`text.capture-element-description`),we=m(`sample.capture.preview`),Te=m(`gallery.page-header.toggle-theme`),Ee=m(`gallery.page-header.favorite`),De=m(`sample.capture.captured-label`),Oe=m(`sample.capture.mirror-preview`),ke=m(`sample.capture.mirror-tooltip`),Ae=m(`sample.capture.capture-photo`),je=m(`sample.capture.enable-camera-switching`),Me=m(`sample.capture.switch-camera`),g=n(``),_=n(``),v=n(``),y=n(``),b=n(`None`),x=null,Ne=e=>{x=e},S=ee(`currentPage`),C=s(()=>S?.value||`captureelement`),{isFavoriteState:w,pageTheme:Pe,toggleTheme:Fe,toggleFavorite:Ie}=ve(C.value),Le=s(()=>w.value?``:``),T=n(!1),Re=s(()=>T.value?{ScaleX:-1,ScaleY:1}:null),E=u(null),D=u(null),O=n(!1),k=n(``),A=n(``),j=n(``),M=n(!1),N=n(!1),P=u([]),F=n(``),I=s(()=>d.value&&p.value&&P.value.length>1),ze=s(()=>I.value?`Visible`:`Collapsed`),L=s(()=>I.value&&!N.value&&!M.value),R=n([]),Be=s(()=>R.value.length?`Visible`:`Collapsed`),z=s(()=>!!(E.value&&O.value&&!M.value&&!N.value)),Ve=s(()=>k.value===`viewing`?m(`sample.capture.viewing`,{name:A.value}):k.value?m(`sample.capture.${k.value}`):``),B=s(()=>T.value?`
        // Mirror the preview
        captureElement.RenderTransform = new ScaleTransform() { ScaleX = -1 };
        captureElement.RenderTransformOrigin = new Point(0.5, 0.5);
`:``),He=s(()=>ye+`

`+xe.replaceAll(`$(CameraSwitchingEnabled)`,p.value?`True`:`False`)),Ue=s(()=>be.replaceAll(`$(MirrorPreview)`,B.value)+`

`+Se.replaceAll(`$(CameraSwitchingEnabled)`,p.value?`true`:`false`)),We=e=>{T.value=e.IsOn},Ge=e=>{p.value=d.value&&e.IsOn},V=()=>{O.value=!!(E.value&&D.value?.srcObject===E.value&&D.value.readyState>=2&&D.value.videoWidth)},H=()=>{!E.value||D.value?.srcObject!==E.value||(k.value=`start-failed`,j.value=m(`sample.capture.start-failed`),J())},U=()=>{D.value?.removeEventListener(`loadeddata`,V),D.value?.removeEventListener(`playing`,V),D.value?.removeEventListener(`error`,H)},Ke=e=>{U(),D.value=e.MediaPlayer,D.value.addEventListener(`loadeddata`,V),D.value.addEventListener(`playing`,V),D.value.addEventListener(`error`,H),V()},qe=c({name:`CaptureSnapshotImages`,inheritAttrs:!1,setup:()=>()=>R.value.map((e,t)=>re(pe,{key:e.id,Source:e.source,Width:100,MaxWidth:100,Stretch:`Uniform`,"AutomationProperties.Name":m(`sample.capture.captured-photo`,{number:R.value.length-t})}))}),W=!1,G=0,K=0,q=0,J=()=>{++G,E.value?.getTracks().forEach(e=>e.stop()),E.value=null,O.value=!1,N.value=!1,F.value=``,D.value&&(D.value.pause(),D.value.srcObject=null)},Y=async()=>{let e=++K;if(navigator.mediaDevices?.enumerateDevices)try{let t=await navigator.mediaDevices.enumerateDevices();if(W||e!==K)return;P.value=[...new Map(t.filter(e=>e.kind===`videoinput`&&e.deviceId).map(e=>[e.deviceId,e])).values()]}catch{!W&&e===K&&(P.value=[])}},X=()=>{Y()},Z=async e=>{g.value=m(e?`sample.capture.access-denied-title`:`sample.capture.error-title`),_.value=m(e?`sample.capture.privacy-message`:`sample.capture.start-failed`),v.value=e?m(`sample.capture.privacy-settings`):``,y.value=m(e?`sample.capture.cancel`:`sample.capture.ok`),b.value=e?`Primary`:`None`;let t=await x?.ShowAsync();!W&&t===`Primary`&&(window.location.href=`ms-settings:privacy-webcam`)},Q=async e=>{J(),F.value=e||``;let t=++G;if(N.value=!0,!navigator.mediaDevices?.getUserMedia){k.value=`no-devices`,j.value=m(`sample.capture.no-devices`),N.value=!1;return}try{let n=await navigator.mediaDevices.getUserMedia({video:e?{deviceId:{exact:e}}:!0,audio:!1});if(W||t!==G){n.getTracks().forEach(e=>e.stop());return}let r=n.getVideoTracks()[0];if(!r){n.getTracks().forEach(e=>e.stop()),k.value=`no-devices`,j.value=m(`sample.capture.no-devices`);return}r.addEventListener(`ended`,()=>{E.value!==n||W||(k.value=`start-failed`,j.value=m(`sample.capture.start-failed`),J())},{once:!0}),A.value=r.label||m(`sample.capture.integrated-camera`),F.value=r.getSettings().deviceId||e||``,k.value=`viewing`,E.value=n,e&&(j.value=m(`sample.capture.viewing`,{name:A.value})),Y()}catch(e){if(W||t!==G)return;let n=e instanceof DOMException?e.name:``;k.value=n===`NotAllowedError`||n===`SecurityError`?`access-denied`:n===`NotFoundError`||n===`DevicesNotFoundError`?`no-devices`:`start-failed`,j.value=m(`sample.capture.${k.value}`),k.value!==`no-devices`&&Z(k.value===`access-denied`)}finally{!W&&t===G&&(N.value=!1)}},Je=()=>{if(!L.value)return;let e=P.value.findIndex(e=>e.deviceId===F.value),t=P.value[(e+1)%P.value.length];t&&Q(t.deviceId)},Ye=async()=>{let e=D.value;if(!z.value||!e)return;let t=E.value;M.value=!0;try{let n=document.createElement(`canvas`);n.width=e.videoWidth,n.height=e.videoHeight;let r=n.getContext(`2d`);if(!r)throw Error(`CanvasUnavailable`);r.drawImage(e,0,0,n.width,n.height);let i=await new Promise(e=>n.toBlob(e,`image/jpeg`,.92));if(!i)throw Error(`PhotoUnavailable`);if(W||E.value!==t)return;R.value.unshift({id:++q,source:URL.createObjectURL(i)}),j.value=m(`sample.capture.photo-captured`)}catch{W||(j.value=m(`sample.capture.capture-failed`))}finally{M.value=!1}};e(()=>{navigator.mediaDevices?.addEventListener(`devicechange`,X),Q()}),ce(()=>{W=!0,++K,navigator.mediaDevices?.removeEventListener(`devicechange`,X),x?.Hide(),x=null,U(),J(),D.value=null,R.value.forEach(e=>URL.revokeObjectURL(e.source))});let $={props:o,instance:l,allowsCameraSwitching:d,cameraSwitchingEnabled:p,t:m,pageTitle:h,pageDescription:Ce,exampleHeader:we,themeLabel:Te,favoriteLabel:Ee,capturedLabel:De,mirrorLabel:Oe,mirrorTooltip:ke,captureLabel:Ae,cameraSwitchingLabel:je,switchCameraLabel:Me,cameraDialogTitle:g,cameraDialogContent:_,cameraDialogPrimaryText:v,cameraDialogCloseText:y,cameraDialogDefaultButton:b,get cameraDialog(){return x},set cameraDialog(e){x=e},CameraDialog_Loaded:Ne,currentPage:S,pageKey:C,isFavoriteState:w,pageTheme:Pe,toggleTheme:Fe,toggleFavorite:Ie,favoriteGlyph:Le,mirrorPreview:T,mirrorTransform:Re,mediaCapture:E,activeVideo:D,previewReady:O,sourceState:k,sourceName:A,outputText:j,takingPhoto:M,startingCapture:N,cameraDevices:P,currentCameraDeviceId:F,showCameraSwitch:I,cameraSwitchVisibility:ze,canSwitchCamera:L,photos:R,capturedVisibility:Be,canCapture:z,frameSourceText:Ve,MirrorTextReplacement:B,captureXaml:He,captureCSharp:Ue,MirrorToggleSwitch_Toggled:We,CameraSwitching_Toggled:Ge,onPreviewLoaded:V,onPreviewFailed:H,detachPreviewEvents:U,CaptureElement_Loaded:Ke,SnapshotImages:qe,get unloaded(){return W},set unloaded(e){W=e},get startVersion(){return G},set startVersion(e){G=e},get deviceEnumerationVersion(){return K},set deviceEnumerationVersion(e){K=e},get photoId(){return q},set photoId(e){q=e},StopCaptureElement:J,RefreshCameraDevices:Y,CameraDevices_Changed:X,ShowCameraError:Z,StartCaptureElement:Q,SwitchCamera_Click:Je,CapturePhoto_Click:Ye,Button:le,ColumnDefinition:de,ContentDialog:fe,ControlExample:_e,FontIcon:te,Grid:i,MediaPlayerElement:he,RowDefinition:ue,ScrollViewer:se,StackPanel:me,TextBlock:oe,ToggleButton:f,ToggleSwitch:ge};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function m(e,n,i,a,o,ee){return t(),d(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[l(a.StackPanel,{class:`gallery-item-page`},{default:r(()=>[l(a.StackPanel,{class:`page-heading`},{default:r(()=>[l(a.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),l(a.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:r(()=>[l(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind themeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind themeLabel, Mode=OneWay}`},{default:r(()=>[l(a.TextBlock,{class:`icon`,Text:``})]),_:1}),l(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=TwoWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`},{default:r(()=>[l(a.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),l(a.StackPanel,{class:`gallery-page-content`},{default:r(()=>[l(a.ControlExample,{"x:Name":`Example1`,class:`capture-gallery-example`,HeaderText:`{x:Bind exampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind captureXaml, Mode=OneWay}`,CSharp:`{x:Bind captureCSharp, Mode=OneWay}`},{default:r(()=>[l(a.ControlExample.Example,null,{default:r(()=>[l(a.ScrollViewer,{class:`capture-display-boundary`,Height:`300`,HorizontalScrollMode:`Enabled`,HorizontalScrollBarVisibility:`Auto`,VerticalScrollMode:`Disabled`,VerticalScrollBarVisibility:`Disabled`},{default:r(()=>[l(a.Grid,{class:`capture-preview-grid`,MinWidth:`400`,MinHeight:`300`,RowSpacing:`10`,ColumnSpacing:`4`},{default:r(()=>[l(a.Grid.RowDefinitions,null,{default:r(()=>[l(a.RowDefinition,{Height:`Auto`}),l(a.RowDefinition,{Height:`*`})]),_:1}),l(a.Grid.ColumnDefinitions,null,{default:r(()=>[l(a.ColumnDefinition,{Width:`*`}),l(a.ColumnDefinition,{Width:`100`})]),_:1}),l(a.TextBlock,{"x:Name":`frameSourceName`,"Grid.Row":`0`,"Grid.Column":`0`,VerticalAlignment:`Center`,Text:`{x:Bind frameSourceText, Mode=OneWay}`,TextTrimming:`CharacterEllipsis`}),l(a.Grid,{class:`capture-preview-host`,"Grid.Row":`1`,"Grid.Column":`0`},{default:r(()=>[l(a.MediaPlayerElement,{"x:Name":`captureElement`,class:`capture-live-preview`,AutoPlay:`True`,Stretch:`Uniform`,Source:`{x:Bind mediaCapture, Mode=OneWay}`,RenderTransform:`{x:Bind mirrorTransform, Mode=OneWay}`,RenderTransformOrigin:`0.5,0.5`,Loaded:`CaptureElement_Loaded`}),l(a.Button,{"x:Name":`switchCameraButton`,class:`capture-camera-switch`,Width:`32`,Height:`32`,MinWidth:`32`,Padding:`0`,Margin:`8`,HorizontalAlignment:`Right`,VerticalAlignment:`Top`,HorizontalContentAlignment:`Center`,VerticalContentAlignment:`Center`,Click:`SwitchCamera_Click`,Visibility:`{x:Bind cameraSwitchVisibility, Mode=OneWay}`,IsEnabled:`{x:Bind canSwitchCamera, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind switchCameraLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind switchCameraLabel, Mode=OneWay}`},{default:r(()=>[l(a.FontIcon,{Glyph:``,FontSize:`16`,Width:`16`,Height:`16`,HorizontalAlignment:`Center`,VerticalAlignment:`Center`})]),_:1})]),_:1}),l(a.TextBlock,{"x:Name":`capturedText`,"Grid.Row":`0`,"Grid.Column":`1`,VerticalAlignment:`Center`,Text:`{x:Bind capturedLabel, Mode=OneWay}`,Visibility:`{x:Bind capturedVisibility, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(a.Grid,{"x:Name":`captureContainer`,class:`capture-container`,"Grid.Row":`1`,"Grid.Column":`1`},{default:r(()=>[l(a.Grid,{class:`capture-expand-to-fill`},{default:r(()=>[l(a.ScrollViewer,{class:`capture-snapshots-scroll`,VerticalScrollMode:`Enabled`,VerticalScrollBarVisibility:`Auto`,HorizontalScrollMode:`Disabled`,HorizontalScrollBarVisibility:`Disabled`},{default:r(()=>[l(a.StackPanel,{"x:Name":`snapshots`,class:`capture-snapshots`,Spacing:`2`},{default:r(()=>[l(a.SnapshotImages)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(a.ControlExample.Output,null,{default:r(()=>[l(a.TextBlock,{class:`capture-output`,Text:`{x:Bind outputText, Mode=OneWay}`,TextWrapping:`WrapWholeWords`,"AutomationProperties.LiveSetting":`Polite`})]),_:1}),l(a.ControlExample.Options,null,{default:r(()=>[l(a.StackPanel,{class:`capture-options`},{default:r(()=>[l(a.ToggleSwitch,{"x:Name":`mirrorSwitch`,Header:`{x:Bind mirrorLabel, Mode=OneWay}`,IsOn:`{x:Bind mirrorPreview, Mode=TwoWay}`,Toggled:`MirrorToggleSwitch_Toggled`,"ToolTipService.ToolTip":`{x:Bind mirrorTooltip, Mode=OneWay}`}),l(a.ToggleSwitch,{"x:Name":`cameraSwitchingSwitch`,Header:`{x:Bind cameraSwitchingLabel, Mode=OneWay}`,IsOn:`{x:Bind cameraSwitchingEnabled, Mode=TwoWay}`,IsEnabled:`{x:Bind allowsCameraSwitching, Mode=OneWay}`,Toggled:`CameraSwitching_Toggled`}),l(a.Button,{"x:Name":`captureButton`,Click:`CapturePhoto_Click`,Content:`{x:Bind captureLabel, Mode=OneWay}`,IsEnabled:`{x:Bind canCapture, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),l(a.ContentDialog,{"x:Name":`CameraAccessDialog`,Loaded:`CameraDialog_Loaded`,Title:`{x:Bind cameraDialogTitle, Mode=OneWay}`,Content:`{x:Bind cameraDialogContent, Mode=OneWay}`,PrimaryButtonText:`{x:Bind cameraDialogPrimaryText, Mode=OneWay}`,CloseButtonText:`{x:Bind cameraDialogCloseText, Mode=OneWay}`,DefaultButton:`{x:Bind cameraDialogDefaultButton, Mode=OneWay}`,RequestedTheme:`{x:Bind pageTheme, Mode=OneWay}`})]),_:1})]),_:1})}var h=o(p,[[`render`,m],[`__scopeId`,`data-v-880e4ddc`],[`__file`,`CaptureElementPage.vue`]]);export{h as default};