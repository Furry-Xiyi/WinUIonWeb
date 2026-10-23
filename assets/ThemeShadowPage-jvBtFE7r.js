import{Di as e,Ei as t,I as n,Ki as r,Li as i,Lt as a,Wt as o,_i as s,a as c,ai as l,cr as u,et as d,o as f,pi as p,si as m,sr as h,t as g,xi as _}from"./ScrollViewer-BWDA_C78.js";import{n as v}from"./ContentPresenter-DMSXUCwi.js";import{t as y}from"./Button-BNDPNdYJ.js";import{t as b}from"./StackPanel-sg_Bd5oB.js";import{t as x}from"./Slider-C94Ax_X5.js";import{t as S}from"./ThemeShadow-C3RDtsQe.js";import{t as C}from"./ToggleButton-HP5wmrvH.js";import{a as w,t as T}from"./ControlExample-CzGyf8u0.js";import{t as E}from"./pageState-CcJibQcm.js";var D=`--- header
ThemeShadow applied to a Border
--- xaml
<Grid>
    <Grid x:Name="ShadowCastGrid"/>
    <Border x:Name="ShadowRect" Translation="0,0,$(TranslationSlider)" Loaded="ShadowRect_Loaded" Width="200" Height="200" CornerRadius="{ThemeResource OverlayCornerRadius}" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}">
        <Border.Shadow>
            <ThemeShadow x:Name="shadow"/>
        </Border.Shadow>
    </Border>
</Grid>
--- c#
private void ShadowRect_Loaded(object sender, RoutedEventArgs e)
{
    shadow.Receivers.Add(ShadowCastGrid);
}
`,O={__name:`ThemeShadowPage`,setup(t,{expose:i}){i();let{t:o}=d(),p=s(`currentPage`),m=l(()=>p?.value||`themeshadow`),{isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j}=E(m.value),M=r({});e(h,M);let N=e=>l(()=>o(e)),P=N(`text.theme-shadow`),F=N(`text.theme-shadow-description`),I=N(`sample.themeshadow.applied-border`),L=N(`sample.themeshadow.shadow-intensity`),R=N(`sample.themeshadow.z-translation`),z=N(`gallery.toggle-theme`),B=l(()=>o(O.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=l(()=>O.value?``:``),H=`--- header
ThemeShadow applied to a Border
--- xaml
<Grid>
    <Grid x:Name="ShadowCastGrid"/>
    <Border x:Name="ShadowRect" Translation="0,0,$(TranslationSlider)" Loaded="ShadowRect_Loaded" Width="200" Height="200" CornerRadius="{ThemeResource OverlayCornerRadius}" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}">
        <Border.Shadow>
            <ThemeShadow x:Name="shadow"/>
        </Border.Shadow>
    </Border>
</Grid>
--- c#
private void ShadowRect_Loaded(object sender, RoutedEventArgs e)
{
    shadow.Receivers.Add(ShadowCastGrid);
}
`.split(/--- xaml\s*\r?\n/)[1]?.split(/--- c#\s*\r?\n/)[0]?.trim()??``,U=`--- header
ThemeShadow applied to a Border
--- xaml
<Grid>
    <Grid x:Name="ShadowCastGrid"/>
    <Border x:Name="ShadowRect" Translation="0,0,$(TranslationSlider)" Loaded="ShadowRect_Loaded" Width="200" Height="200" CornerRadius="{ThemeResource OverlayCornerRadius}" Background="{ThemeResource CardBackgroundFillColorDefaultBrush}">
        <Border.Shadow>
            <ThemeShadow x:Name="shadow"/>
        </Border.Shadow>
    </Border>
</Grid>
--- c#
private void ShadowRect_Loaded(object sender, RoutedEventArgs e)
{
    shadow.Receivers.Add(ShadowCastGrid);
}
`.split(/--- c#\s*\r?\n/)[1]?.trim()??``,W=l(()=>{let e=M.ShadowRect?.Translation??{X:0,Y:0,Z:0};return o(`sample.themeshadow.translation-output`,{x:e.X,y:e.Y,z:e.Z})}),G=l(()=>o(`sample.themeshadow.receivers-output`,{count:M.shadow?.Receivers.Count??0})),K=(e,t)=>{M.ShadowRect&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(t?.NewValue??e?.Value??32)})},q=()=>{M.shadow?.Receivers.Add(M.ShadowCastGrid),M.ShadowRect&&M.TranslationSliderInApp&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(M.TranslationSliderInApp.Value)})};_(()=>{M.shadow&&M.ShadowCastGrid&&M.shadow.Receivers.Remove(M.ShadowCastGrid)}),e(u,{PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q});let J={t:o,currentPage:p,pageKey:m,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,namescope:M,resource:N,PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q,computed:l,inject:s,onBeforeUnmount:_,provide:e,shallowReactive:r,Border:v,Button:y,ControlExample:T,get ControlExampleSubstitution(){return w},FontIcon:c,Grid:a,Page:n,ScrollViewer:g,Slider:x,StackPanel:b,TextBlock:f,ThemeShadow:S,ToggleButton:C,get useI18n(){return d},get xamlNameScopeKey(){return h},get xamlScopeKey(){return u},get createPageState(){return E},get sample(){return D}};return Object.defineProperty(J,"__isScriptSetup",{enumerable:!1,value:!0}),J}};function k(e,n,r,a,o,s){return t(),m(a.Page,null,{default:i(()=>[p(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[p(a.StackPanel,{class:`gallery-item-page`},{default:i(()=>[p(a.StackPanel,{class:`page-heading`},{default:i(()=>[p(a.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle, Mode=OneWay}`}),p(a.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:i(()=>[p(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel, Mode=OneWay}`},{default:i(()=>[p(a.FontIcon,{Glyph:``})]),_:1}),p(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`},{default:i(()=>[p(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(a.StackPanel,{class:`gallery-page-content`},{default:i(()=>[p(a.ControlExample,{"x:Name":`Example3`,SampleDefinition:`ThemeShadow\\ThemeshadowAppliedBorder.txt`,HeaderText:`{x:Bind SampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp, Mode=OneWay}`},{default:i(()=>[p(a.ControlExample.Example,null,{default:i(()=>[p(a.Grid,{"x:Name":`Example3Grid`,Padding:`36`},{default:i(()=>[p(a.Grid,{"x:Name":`ShadowCastGrid`}),p(a.Border,{"x:Name":`ShadowRect`,Width:`200`,Height:`200`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`{ThemeResource OverlayCornerRadius}`,Loaded:`ShadowRect_Loaded`},{default:i(()=>[p(a.Border.Shadow,null,{default:i(()=>[p(a.ThemeShadow,{"x:Name":`shadow`})]),_:1})]),_:1})]),_:1})]),_:1}),p(a.ControlExample.Output,null,{default:i(()=>[p(a.StackPanel,null,{default:i(()=>[p(a.TextBlock,{Text:`{x:Bind TranslationOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(a.TextBlock,{Text:`{x:Bind ReceiversOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),p(a.ControlExample.Options,null,{default:i(()=>[p(a.Slider,{"x:Name":`TranslationSliderInApp`,Width:`200`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind ShadowIntensityName, Mode=OneWay}`,Header:`{x:Bind TranslationHeader, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`64`,Minimum:`0`,SmallChange:`1`,StepFrequency:`1`,ValueChanged:`TranslationSliderInApp_ValueChanged`,Value:`32`})]),_:1}),p(a.ControlExample.Substitutions,null,{default:i(()=>[p(a.ControlExampleSubstitution,{Key:`TranslationSlider`,Value:`{x:Bind TranslationSliderInApp.Value, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var A=o(O,[[`render`,k],[`__scopeId`,`data-v-7d3c1f3d`],[`__file`,`ThemeShadowPage.vue`]]);export{A as default};