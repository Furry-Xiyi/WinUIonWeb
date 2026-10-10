import{Fi as e,I as t,Lt as n,Ti as r,Wi as i,Wt as a,a as o,ai as s,di as c,et as l,hi as u,o as d,or as f,ri as p,sr as m,t as h,wi as g,yi as _}from"./ScrollViewer-PoO_ma9Z.js";import{n as v}from"./ContentPresenter-NCdCdNyK.js";import{t as y}from"./Button-DjU0urmJ.js";import{t as b}from"./StackPanel-CT7pl8zy.js";import{t as x}from"./Slider-DAa-nQWm.js";import{t as S}from"./ThemeShadow-Bvobt2oM.js";import{t as C}from"./ToggleButton-DwmhXZge.js";import{a as w,t as T}from"./ControlExample-C1ahTZEr.js";import{t as E}from"./pageState-BN3kXI7L.js";var D=`--- header
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
`,O={__name:`ThemeShadowPage`,setup(e,{expose:a}){a();let{t:s}=l(),c=u(`currentPage`),g=p(()=>c?.value||`themeshadow`),{isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j}=E(g.value),M=i({});r(f,M);let N=e=>p(()=>s(e)),P=N(`text.theme-shadow`),F=N(`text.theme-shadow-description`),I=N(`sample.themeshadow.applied-border`),L=N(`sample.themeshadow.shadow-intensity`),R=N(`sample.themeshadow.z-translation`),z=N(`gallery.toggle-theme`),B=p(()=>s(O.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=p(()=>O.value?``:``),H=`--- header
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
`.split(/--- c#\s*\r?\n/)[1]?.trim()??``,W=p(()=>{let e=M.ShadowRect?.Translation??{X:0,Y:0,Z:0};return s(`sample.themeshadow.translation-output`,{x:e.X,y:e.Y,z:e.Z})}),G=p(()=>s(`sample.themeshadow.receivers-output`,{count:M.shadow?.Receivers.Count??0})),K=(e,t)=>{M.ShadowRect&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(t?.NewValue??e?.Value??32)})},q=()=>{M.shadow?.Receivers.Add(M.ShadowCastGrid),M.ShadowRect&&M.TranslationSliderInApp&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(M.TranslationSliderInApp.Value)})};_(()=>{M.shadow&&M.ShadowCastGrid&&M.shadow.Receivers.Remove(M.ShadowCastGrid)}),r(m,{PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q});let J={t:s,currentPage:c,pageKey:g,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,namescope:M,resource:N,PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q,computed:p,inject:u,onBeforeUnmount:_,provide:r,shallowReactive:i,Border:v,Button:y,ControlExample:T,get ControlExampleSubstitution(){return w},FontIcon:o,Grid:n,Page:t,ScrollViewer:h,Slider:x,StackPanel:b,TextBlock:d,ThemeShadow:S,ToggleButton:C,get useI18n(){return l},get xamlNameScopeKey(){return f},get xamlScopeKey(){return m},get createPageState(){return E},get sample(){return D}};return Object.defineProperty(J,"__isScriptSetup",{enumerable:!1,value:!0}),J}};function k(t,n,r,i,a,o){return g(),s(i.Page,null,{default:e(()=>[c(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[c(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[c(i.StackPanel,{class:`page-heading`},{default:e(()=>[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle, Mode=OneWay}`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:``})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`},{default:e(()=>[c(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),c(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[c(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`ThemeShadow\\ThemeshadowAppliedBorder.txt`,HeaderText:`{x:Bind SampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp, Mode=OneWay}`},{default:e(()=>[c(i.ControlExample.Example,null,{default:e(()=>[c(i.Grid,{"x:Name":`Example3Grid`,Padding:`36`},{default:e(()=>[c(i.Grid,{"x:Name":`ShadowCastGrid`}),c(i.Border,{"x:Name":`ShadowRect`,Width:`200`,Height:`200`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`{ThemeResource OverlayCornerRadius}`,Loaded:`ShadowRect_Loaded`},{default:e(()=>[c(i.Border.Shadow,null,{default:e(()=>[c(i.ThemeShadow,{"x:Name":`shadow`})]),_:1})]),_:1})]),_:1})]),_:1}),c(i.ControlExample.Output,null,{default:e(()=>[c(i.StackPanel,null,{default:e(()=>[c(i.TextBlock,{Text:`{x:Bind TranslationOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),c(i.TextBlock,{Text:`{x:Bind ReceiversOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),c(i.ControlExample.Options,null,{default:e(()=>[c(i.Slider,{"x:Name":`TranslationSliderInApp`,Width:`200`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind ShadowIntensityName, Mode=OneWay}`,Header:`{x:Bind TranslationHeader, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`64`,Minimum:`0`,SmallChange:`1`,StepFrequency:`1`,ValueChanged:`TranslationSliderInApp_ValueChanged`,Value:`32`})]),_:1}),c(i.ControlExample.Substitutions,null,{default:e(()=>[c(i.ControlExampleSubstitution,{Key:`TranslationSlider`,Value:`{x:Bind TranslationSliderInApp.Value, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var A=a(O,[[`render`,k],[`__scopeId`,`data-v-7d3c1f3d`],[`__file`,`ThemeShadowPage.vue`]]);export{A as default};