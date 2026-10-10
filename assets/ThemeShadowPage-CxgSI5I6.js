import{$i as e,Ai as t,Bi as n,Cn as r,En as i,Mn as a,Yi as o,a as s,bi as c,bn as l,ci as u,dr as d,fr as f,gi as p,ki as m,o as h,p as g,t as _,ui as v,wi as y}from"./ScrollViewer-B43ymvAj.js";import{n as b}from"./ContentPresenter-7i8kdghk.js";import{t as x}from"./Button-B49t7g4C.js";import{t as S}from"./StackPanel-Dy6dKYi5.js";import{t as C}from"./ToggleButton-DDZy2gVz.js";import{t as w}from"./Slider-BxSTiKC1.js";import{t as T}from"./ControlExample-Ddvmn5_c.js";import{t as E}from"./ThemeShadow-CJXdN5na.js";import{t as D}from"./pageState-BQHW0me4.js";var O=a({__name:`ThemeShadowPage`,setup(a){let{t:O}=g(),k=c(`currentPage`),{isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N}=D(u(()=>k?.value||`themeshadow`).value),P=o({});t(d,P);let F=e=>u(()=>O(e)),I=F(`text.theme-shadow`),L=F(`text.theme-shadow-description`),R=F(`sample.themeshadow.applied-border`),z=F(`sample.themeshadow.shadow-intensity`),B=F(`sample.themeshadow.z-translation`),V=F(`gallery.toggle-theme`),H=u(()=>O(A.value?`gallery.remove-favorite`:`gallery.add-favorite`)),U=u(()=>A.value?``:``),W=`--- header
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
`.split(/--- xaml\s*\r?\n/)[1]?.split(/--- c#\s*\r?\n/)[0]?.trim()??``,G=`--- header
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
`.split(/--- c#\s*\r?\n/)[1]?.trim()??``,K=u(()=>{let e=P.ShadowRect?.Translation??{X:0,Y:0,Z:0};return O(`sample.themeshadow.translation-output`,{x:e.X,y:e.Y,z:e.Z})}),q=u(()=>O(`sample.themeshadow.receivers-output`,{count:P.shadow?.Receivers.Count??0}));return y(()=>{P.shadow&&P.ShadowCastGrid&&P.shadow.Receivers.Remove(P.ShadowCastGrid)}),t(f,{PageTitle:I,PageDescription:L,SampleHeader:R,ShadowIntensityName:z,TranslationHeader:B,ThemeButtonLabel:V,FavoriteButtonLabel:H,FavoriteGlyph:U,SampleXaml:W,SampleCSharp:G,TranslationOutput:K,ReceiversOutput:q,isFavoriteState:A,pageTheme:j,toggleTheme:M,toggleFavorite:N,TranslationSliderInApp_ValueChanged:(e,t)=>{P.ShadowRect&&(P.ShadowRect.Translation={X:0,Y:0,Z:Number(t?.NewValue??e?.Value??32)})},ShadowRect_Loaded:()=>{P.shadow?.Receivers.Add(P.ShadowCastGrid),P.ShadowRect&&P.TranslationSliderInApp&&(P.ShadowRect.Translation={X:0,Y:0,Z:Number(P.TranslationSliderInApp.Value)})}}),(t,a)=>(m(),v(r,null,{default:n(()=>[p(_,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[p(S,{class:`gallery-item-page`},{default:n(()=>[p(S,{class:`page-heading`},{default:n(()=>[p(h,{class:`page-header`,Text:`{x:Bind PageTitle, Mode=OneWay}`}),p(h,{class:`page-description`,Text:`{x:Bind PageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(S,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[p(x,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind ThemeButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind ThemeButtonLabel, Mode=OneWay}`},{default:n(()=>[p(s,{Glyph:``})]),_:1}),p(C,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteButtonLabel, Mode=OneWay}`},{default:n(()=>[p(s,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`})]),_:1})]),_:1})]),_:1}),p(S,{class:`gallery-page-content`},{default:n(()=>[p(T,{"x:Name":`Example3`,SampleDefinition:`ThemeShadow\\ThemeshadowAppliedBorder.txt`,HeaderText:`{x:Bind SampleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SampleXaml, Mode=OneWay}`,CSharp:`{x:Bind SampleCSharp, Mode=OneWay}`},{default:n(()=>[p(T.Example,null,{default:n(()=>[p(i,{"x:Name":`Example3Grid`,Padding:`36`},{default:n(()=>[p(i,{"x:Name":`ShadowCastGrid`}),p(b,{"x:Name":`ShadowRect`,Width:`200`,Height:`200`,Background:`{ThemeResource CardBackgroundFillColorDefaultBrush}`,CornerRadius:`{ThemeResource OverlayCornerRadius}`,Loaded:`ShadowRect_Loaded`},{default:n(()=>[p(b.Shadow,null,{default:n(()=>[p(E,{"x:Name":`shadow`})]),_:1})]),_:1})]),_:1})]),_:1}),p(T.Output,null,{default:n(()=>[p(S,null,{default:n(()=>[p(h,{Text:`{x:Bind TranslationOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),p(h,{Text:`{x:Bind ReceiversOutput, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1})]),_:1}),p(T.Options,null,{default:n(()=>[p(w,{"x:Name":`TranslationSliderInApp`,Width:`200`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind ShadowIntensityName, Mode=OneWay}`,Header:`{x:Bind TranslationHeader, Mode=OneWay}`,IsFocusEngagementEnabled:`False`,Maximum:`64`,Minimum:`0`,SmallChange:`1`,StepFrequency:`1`,ValueChanged:`TranslationSliderInApp_ValueChanged`,Value:`32`})]),_:1}),p(T.Substitutions,null,{default:n(()=>[p(e(l),{Key:`TranslationSlider`,Value:`{x:Bind TranslationSliderInApp.Value, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-7d3c1f3d`]]);export{O as default};