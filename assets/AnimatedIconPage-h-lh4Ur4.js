import{$i as e,Ai as t,Bi as n,Cn as ee,Li as te,Mn as r,Ni as i,Yi as a,_i as o,bi as s,bn as c,ci as l,dr as u,fr as ne,gi as d,ki as re,o as f,p as ie,t as ae,ui as oe}from"./ScrollViewer-B43ymvAj.js";import{n as p}from"./animatedIconInput-CaWWYsFu.js";import{t as m}from"./Button-B49t7g4C.js";import{i as se,t as h}from"./AnimatedIcon-CaCf32-Y.js";import{r as g,t as _}from"./NavigationView-D3DkomVv.js";import{t as v}from"./StackPanel-Dy6dKYi5.js";import{t as ce}from"./ToggleButton-DDZy2gVz.js";import{t as le}from"./ComboBox-nqHKK9K4.js";import{t as y}from"./inlineControlProperties-DBSF73Uo.js";import{t as b}from"./ControlExample-Ddvmn5_c.js";import{t as ue}from"./pageState-BQHW0me4.js";var x=`--- header
Adding AnimatedIcon to a button
--- xaml
<Button PointerEntered="Button_PointerEntered" PointerExited="Button_PointerExited" Width="75">
    <AnimatedIcon x:Name="SearchAnimatedIcon">
        <AnimatedIcon.Source>
            <animatedvisuals:$(AnimatedVisualSourceKind)/>
        </AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource>
            <SymbolIconSource Symbol="Find"/>
        </AnimatedIcon.FallbackIconSource>
    </AnimatedIcon>
</Button>
--- c#
private void Button_PointerEntered(object sender, PointerRoutedEventArgs e)
{
    AnimatedIcon.SetState(this.SearchAnimatedIcon, "PointerOver");
}

private void Button_PointerExited(object sender, PointerRoutedEventArgs e)
{
    AnimatedIcon.SetState(this.SearchAnimatedIcon, "Normal");
}
`,S=`--- header
Adding AnimatedIcon to a button
--- xaml
<Button Click="Button_Click"
        PointerEntered="Button_PointerEntered"
        PointerExited="Button_PointerExited"
        PointerPressed="Button_PointerPressed"
        PointerReleased="Button_PointerReleased"
        PointerCanceled="Button_PointerCanceled"
        PointerCaptureLost="Button_PointerCaptureLost"
        Width="75" HorizontalAlignment="Left">
    <AnimatedIcon x:Name="SearchAnimatedIcon" AnimatedIcon.State="NormalOff">
        <AnimatedIcon.Source>
            <animatedvisuals:$(AnimatedVisualSourceKind)/>
        </AnimatedIcon.Source>
        <AnimatedIcon.FallbackIconSource>
            <SymbolIconSource Symbol="Find"/>
        </AnimatedIcon.FallbackIconSource>
    </AnimatedIcon>
</Button>
--- c#
private bool isDirectionOn;
private bool isPointerOver;

private string DirectionalState(string state)
{
    return state + (isDirectionOn ? "On" : "Off");
}

private void RestoreDirectionalState()
{
    AnimatedIcon.SetState(this.SearchAnimatedIcon,
        DirectionalState(isPointerOver ? "PointerOver" : "Normal"));
}

private void Button_Click(object sender, RoutedEventArgs e)
{
    isDirectionOn = !isDirectionOn;
    RestoreDirectionalState();
}

private void Button_PointerEntered(object sender, PointerRoutedEventArgs e)
{
    isPointerOver = true;
    AnimatedIcon.SetState(this.SearchAnimatedIcon, DirectionalState("PointerOver"));
}

private void Button_PointerExited(object sender, PointerRoutedEventArgs e)
{
    isPointerOver = false;
    RestoreDirectionalState();
}

private void Button_PointerPressed(object sender, PointerRoutedEventArgs e)
{
    AnimatedIcon.SetState(this.SearchAnimatedIcon, DirectionalState("Pressed"));
}

private void Button_PointerReleased(object sender, PointerRoutedEventArgs e)
{
    RestoreDirectionalState();
}

private void Button_PointerCanceled(object sender, PointerRoutedEventArgs e)
{
    isPointerOver = false;
    RestoreDirectionalState();
}

private void Button_PointerCaptureLost(object sender, PointerRoutedEventArgs e)
{
    RestoreDirectionalState();
}
`,de=`--- header
Adding AnimatedIcon to a NavigationView
--- xaml
<NavigationView>
    <NavigationView.MenuItems>
        <NavigationViewItem Content = "Game Settings">
            <NavigationViewItem.Icon>
                <AnimatedIcon x:Name='AnimatedIcon'>
                    <AnimatedIcon.Source>
                        <animatedvisuals:AnimatedSettingsVisualSource/>
                    </AnimatedIcon.Source>
                    <AnimatedIcon.FallbackIconSource>
                        <FontIconSource Glyph="&#xE713;"/>
                    </AnimatedIcon.FallbackIconSource>
                </AnimatedIcon>
            </NavigationViewItem.Icon>
        </NavigationViewItem>
    </NavigationView.MenuItems>
</NavigationView>
`,C=r(o({__name:`AnimatedIconPage`,setup(r){let o=s(`currentPage`),{isFavoriteState:C,pageTheme:fe,toggleTheme:pe,toggleFavorite:w}=ue(l(()=>o?.value||`animatedicon`).value),{t:T}=ie(),E=l(()=>T(`sample.animatedicon.page-title`)),D=l(()=>T(`sample.animatedicon.page-description`)),O=l(()=>T(`sample.animatedicon.button-header`)),k=l(()=>T(`sample.animatedicon.navigation-header`)),A=l(()=>T(`sample.animatedicon.button-description`)),j=l(()=>T(`sample.animatedicon.lottie`)),M=l(()=>T(`sample.animatedicon.animation-guidance`)),N=l(()=>T(`sample.animatedicon.navigation-description`)),P=l(()=>T(`sample.animatedicon.custom-animation-description`)),F=l(()=>T(`sample.animatedicon.example-button-name`)),I=l(()=>T(`sample.animatedicon.kind`)),L=l(()=>T(`sample.animatedicon.game-settings`)),R=l(()=>T(`gallery.page-header.toggle-theme`)),z=l(()=>T(`gallery.page-header.favorite`)),B=l(()=>C.value?``:``),V=a({}),me=l(()=>T(`sample.animatedicon.source.back`)),he=l(()=>T(`sample.animatedicon.source.chevron-down-small`)),ge=l(()=>T(`sample.animatedicon.source.chevron-right-down-small`)),_e=l(()=>T(`sample.animatedicon.source.chevron-up-down-small`)),ve=l(()=>T(`sample.animatedicon.source.find`)),ye=l(()=>T(`sample.animatedicon.source.global-navigation-button`)),be=l(()=>T(`sample.animatedicon.source.settings`)),H=l(()=>V.AnimatedVisualSourceSelection?.SelectedItem?.Tag??`AnimatedFindVisualSource`),U=l(()=>/AnimatedChevron(?:RightDown|UpDown)SmallVisualSource$/.test(H.value)),W=l(()=>U.value?`NormalOff`:`Normal`),G=!1,K=!1,q=new Map,xe={AnimatedIconPage:{GetAnimationSourceFromString:e=>e?(q.has(e)||q.set(e,se(e)),q.get(e)??null):null}},J=e=>e+(K?`On`:`Off`),Y=()=>p.SetState(V.SearchAnimatedIcon,J(G?`PointerOver`:`Normal`)),Se=()=>{G=!0,p.SetState(V.SearchAnimatedIcon,U.value?J(`PointerOver`):`PointerOver`)},X=()=>{G=!1,p.SetState(V.SearchAnimatedIcon,U.value?J(`Normal`):`Normal`)},Ce=()=>{U.value&&p.SetState(V.SearchAnimatedIcon,J(`Pressed`))},Z=()=>{U.value&&Y()},we=X,Q=Z,Te=()=>{U.value&&(K=!K,Y())};te(H,()=>{G=!1,K=!1,p.SetState(V.SearchAnimatedIcon,W.value)},{flush:`post`});let $=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``,Ee=l(()=>$(U.value?S:x,`xaml`)),De=l(()=>$(U.value?S:x,`c#`)),Oe=$(de,`xaml`);return t(u,V),t(ne,{pageTitle:E,pageDescription:D,buttonHeader:O,navigationHeader:k,buttonDescription:A,lottieLabel:j,animationGuidance:M,navigationDescription:N,customAnimationDescription:P,exampleButtonName:F,kindLabel:I,gameSettingsLabel:L,toggleThemeLabel:R,favoriteLabel:z,favoriteGlyph:B,isFavoriteState:C,pageTheme:fe,buttonXaml:Ee,buttonCSharp:De,navigationXaml:Oe,toggleTheme:pe,toggleFavorite:w,Button_Click:Te,Button_PointerEntered:Se,Button_PointerExited:X,Button_PointerPressed:Ce,Button_PointerReleased:Z,Button_PointerCanceled:we,Button_PointerCaptureLost:Q,initialAnimationState:W,backLabel:me,downArrowLabel:he,rightDownArrowLabel:ge,upDownArrowLabel:_e,findLabel:ve,navigationLabel:ye,settingsLabel:be,controlPages:xe}),(t,te)=>{let r=i(`Run`),a=i(`Hyperlink`),o=i(`LineBreak`),s=i(`SymbolIconSource`),l=i(`animatedvisuals:AnimatedSettingsVisualSource`),u=i(`FontIconSource`);return re(),oe(ee,null,{default:n(()=>[d(ae,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(v,{class:`gallery-item-page`},{default:n(()=>[d(v,{class:`page-heading`},{default:n(()=>[d(f,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),d(f,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(v,{class:`page-header-actions`,Orientation:`Horizontal`},{default:n(()=>[d(m,{class:`header-action`,"AutomationProperties.Name":`{x:Bind toggleThemeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind toggleThemeLabel, Mode=OneWay}`,Click:`toggleTheme`},{default:n(()=>[d(f,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),d(ce,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:n(()=>[d(f,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),d(v,{class:`gallery-page-content`},{default:n(()=>[d(b,{"x:Name":`AnimatedIconExample1`,HeaderText:`{x:Bind buttonHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonXaml, Mode=OneWay}`,CSharp:`{x:Bind buttonCSharp, Mode=OneWay}`},{default:n(()=>[d(b.Example,null,{default:n(()=>[d(v,{class:`animated-icon-example`},{default:n(()=>[d(f,{TextWrapping:`WrapWholeWords`},{default:n(()=>[d(r,{Text:`{x:Bind buttonDescription, Mode=OneWay}`}),d(a,{NavigateUri:`https://aka.ms/lottie`},{default:n(()=>[d(r,{Text:`{x:Bind lottieLabel, Mode=OneWay}`})]),_:1}),d(r,{Text:`{x:Bind animationGuidance, Mode=OneWay}`}),d(o)]),_:1}),d(m,{Width:`75`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind exampleButtonName, Mode=OneWay}`,Click:`Button_Click`,PointerEntered:`Button_PointerEntered`,PointerExited:`Button_PointerExited`,PointerPressed:`Button_PointerPressed`,PointerReleased:`Button_PointerReleased`,PointerCanceled:`Button_PointerCanceled`,PointerCaptureLost:`Button_PointerCaptureLost`},{default:n(()=>[d(h,{"x:Name":`SearchAnimatedIcon`,Source:`{x:Bind controlPages:AnimatedIconPage.GetAnimationSourceFromString(AnimatedVisualSourceSelection.SelectedItem.Tag), Mode=OneWay}`,"AnimatedIcon.State":`{x:Bind initialAnimationState, Mode=OneWay}`},{default:n(()=>[d(h.FallbackIconSource,null,{default:n(()=>[d(s,{Symbol:`Find`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(b.Output),d(b.Options,null,{default:n(()=>[d(le,{"x:Name":`AnimatedVisualSourceSelection`,class:`animated-icon-kind`,MinWidth:`340`,VerticalAlignment:`Center`,Header:`{x:Bind kindLabel, Mode=OneWay}`,SelectedIndex:`4`},{default:n(()=>[d(e(y),{Content:`{x:Bind backLabel, Mode=OneWay}`,Tag:`AnimatedBackVisualSource`}),d(e(y),{Content:`{x:Bind downArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronDownSmallVisualSource`}),d(e(y),{Content:`{x:Bind rightDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronRightDownSmallVisualSource`}),d(e(y),{Content:`{x:Bind upDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronUpDownSmallVisualSource`}),d(e(y),{Content:`{x:Bind findLabel, Mode=OneWay}`,Tag:`AnimatedFindVisualSource`}),d(e(y),{Content:`{x:Bind navigationLabel, Mode=OneWay}`,Tag:`AnimatedGlobalNavigationButtonVisualSource`}),d(e(y),{Content:`{x:Bind settingsLabel, Mode=OneWay}`,Tag:`AnimatedSettingsVisualSource`})]),_:1})]),_:1}),d(b.Substitutions,null,{default:n(()=>[d(e(c),{Key:`AnimatedVisualSourceKind`,Value:`{x:Bind AnimatedVisualSourceSelection.SelectedItem.Tag, Mode=OneWay}`})]),_:1})]),_:1}),d(b,{"x:Name":`AnimatedIconExample2`,HeaderText:`{x:Bind navigationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind navigationXaml, Mode=OneWay}`},{default:n(()=>[d(b.Example,null,{default:n(()=>[d(v,{class:`animated-icon-example`},{default:n(()=>[d(f,{TextWrapping:`WrapWholeWords`},{default:n(()=>[d(r,{Text:`{x:Bind navigationDescription, Mode=OneWay}`}),d(o),d(o),d(r,{Text:`{x:Bind customAnimationDescription, Mode=OneWay}`}),d(o),d(o)]),_:1}),d(_,{class:`animated-icon-navigation`,Height:`300`,MinHeight:`300`,IsSettingsVisible:`False`},{default:n(()=>[d(_.MenuItems,null,{default:n(()=>[d(e(g),{Content:`{x:Bind gameSettingsLabel, Mode=OneWay}`},{default:n(()=>[d(e(g).Icon,null,{default:n(()=>[d(h,{"x:Name":`GameSettingsIcon`},{default:n(()=>[d(h.Source,null,{default:n(()=>[d(l)]),_:1}),d(h.FallbackIconSource,null,{default:n(()=>[d(u,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(b.Output),d(b.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),[[`__scopeId`,`data-v-eeb08ed1`]]);export{C as default};