import{Ai as e,Bi as t,Cn as n,En as r,Mn as i,Yi as a,a as o,bi as s,bn as c,ci as l,dr as u,fr as d,gi as f,ki as p,o as m,p as h,t as g,ui as _,wi as v}from"./ScrollViewer-CHNE18MA.js";import{n as y}from"./ContentPresenter-pBVZeWXF.js";import{t as b}from"./Button-DO0TiUOq.js";import{t as x}from"./StackPanel-C60XOD66.js";import{t as S}from"./ToggleButton-ZsjZg8Nu.js";import{t as C}from"./Slider-8IBh_tz8.js";import{t as w}from"./ControlExample-BKyw2NwY.js";import{t as T}from"./ThemeShadow-X2F5mTIX.js";import{t as E}from"./pageState-Djrh7EdY.js";var D=`--- header
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
`,O={__name:`ThemeShadowPage`,setup(t,{expose:i}){i();let{t:f}=h(),p=s(`currentPage`),_=l(()=>p?.value||`themeshadow`),{isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j}=E(_.value),M=a({});e(u,M);let N=e=>l(()=>f(e)),P=N(`text.theme-shadow`),F=N(`text.theme-shadow-description`),I=N(`sample.themeshadow.applied-border`),L=N(`sample.themeshadow.shadow-intensity`),R=N(`sample.themeshadow.z-translation`),z=N(`gallery.toggle-theme`),B=l(()=>f(O.value?`gallery.remove-favorite`:`gallery.add-favorite`)),V=l(()=>O.value?``:``),H=`--- header
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
`.split(/--- c#\s*\r?\n/)[1]?.trim()??``,W=l(()=>{let e=M.ShadowRect?.Translation??{X:0,Y:0,Z:0};return f(`sample.themeshadow.translation-output`,{x:e.X,y:e.Y,z:e.Z})}),G=l(()=>f(`sample.themeshadow.receivers-output`,{count:M.shadow?.Receivers.Count??0})),K=(e,t)=>{M.ShadowRect&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(t?.NewValue??e?.Value??32)})},q=()=>{M.shadow?.Receivers.Add(M.ShadowCastGrid),M.ShadowRect&&M.TranslationSliderInApp&&(M.ShadowRect.Translation={X:0,Y:0,Z:Number(M.TranslationSliderInApp.Value)})};v(()=>{M.shadow&&M.ShadowCastGrid&&M.shadow.Receivers.Remove(M.ShadowCastGrid)}),e(d,{PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q});let J={t:f,currentPage:p,pageKey:_,isFavoriteState:O,pageTheme:k,toggleTheme:A,toggleFavorite:j,namescope:M,resource:N,PageTitle:P,PageDescription:F,SampleHeader:I,ShadowIntensityName:L,TranslationHeader:R,ThemeButtonLabel:z,FavoriteButtonLabel:B,FavoriteGlyph:V,SampleXaml:H,SampleCSharp:U,TranslationOutput:W,ReceiversOutput:G,TranslationSliderInApp_ValueChanged:K,ShadowRect_Loaded:q,computed:l,inject:s,onBeforeUnmount:v,provide:e,shallowReactive:a,Border:y,Button:b,ControlExample:w,get ControlExampleSubstitution(){return c},FontIcon:o,Grid:r,Page:n,ScrollViewer:g,Slider:C,StackPanel:x,TextBlock:m,ThemeShadow:T,ToggleButton:S,get useI18n(){return h},get xamlNameScopeKey(){return u},get xamlScopeKey(){return d},get createPageState(){return E},get sample(){return D}};return Object.defineProperty(J,"__isScriptSetup",{enumerable:!1,value:!0}),J}};function k(e,n,r,i,a,o){return p(),_(i.Page,null,{default:t(()=>[f(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[f(i.StackPanel,{class:`gallery-item-page`},{default:t(()=>[f(i.StackPanel,{class:`page-heading`},{default:t(()=>[f(i.TextBlock,{class:`page-header`,Text:`{x:Bind PageTitle, Mode=OneWay}`}),f(i.TextBlock,{class:`page-description`,Text:`{x:Bind PageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[f(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:``})]),_:1}),f(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`},{default:t(()=>[f(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),f(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[f(i.ControlExample,{"x:Name":`Example3`,SampleDefinition:`ThemeShadow\\ThemeshadowAppliedBorder.txt`,HeaderText:`{x:Bind SampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp, Mode=OneWay}`},{default:t(()=>[f(i.ControlExample.Example,null,{default:t(()=>[f(i.Grid,{"x:Name":`Example3Grid`,Padding:`36`},{default:t(()=>[f(i.Grid,{"x:Name":`ShadowCastGrid`}),f(i.Border,{"x:Name":`ShadowRect`,Width:`200`,Height:`200`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`{ThemeResource OverlayCornerRadius}`,Loaded:`ShadowRect_Loaded`},{default:t(()=>[f(i.Border.Shadow,null,{default:t(()=>[f(i.ThemeShadow,{"x:Name":`shadow`})]),_:1})]),_:1})]),_:1})]),_:1}),f(i.ControlExample.Output,null,{default:t(()=>[f(i.StackPanel,null,{default:t(()=>[f(i.TextBlock,{Text:`{x:Bind TranslationOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(i.TextBlock,{Text:`{x:Bind ReceiversOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),f(i.ControlExample.Options,null,{default:t(()=>[f(i.Slider,{"x:Name":`TranslationSliderInApp`,Width:`200`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind ShadowIntensityName, Mode=OneWay}`,Header:`{x:Bind TranslationHeader, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`64`,Minimum:`0`,SmallChange:`1`,StepFrequency:`1`,ValueChanged:`TranslationSliderInApp_ValueChanged`,Value:`32`})]),_:1}),f(i.ControlExample.Substitutions,null,{default:t(()=>[f(i.ControlExampleSubstitution,{Key:`TranslationSlider`,Value:`{x:Bind TranslationSliderInApp.Value, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var A=i(O,[[`render`,k],[`__scopeId`,`data-v-7d3c1f3d`],[`__file`,`ThemeShadowPage.vue`]]);export{A as default};