import{Fi as e,I as t,Mi as ee,Oi as n,Ti as r,Wi as i,Wt as a,ai as o,di as s,et as te,fi as c,hi as ne,o as l,or as u,ri as d,sr as re,t as ie,wi as f}from"./ScrollViewer-PoO_ma9Z.js";import{i as ae,t as oe}from"./AnimatedIcon-DuN3HEfB.js";import{n as p}from"./animatedIconInput-CNzwpj2y.js";import{t as se}from"./Button-DjU0urmJ.js";import{t as ce}from"./ComboBox-UT72V9ez.js";import{t as le}from"./inlineControlProperties-DcOtwrbn.js";import{r as ue,t as de}from"./NavigationView-xNn5QdJI.js";import{t as fe}from"./StackPanel-CT7pl8zy.js";import{t as pe}from"./ToggleButton-DwmhXZge.js";import{a as me,t as he}from"./ControlExample-C1ahTZEr.js";import{t as ge}from"./pageState-BN3kXI7L.js";var m=`--- header
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
`,h=`--- header
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
`,_e=`--- header
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
`,g=c({__name:`AnimatedIconPage`,setup(e,{expose:n}){n();let a=ne(`currentPage`),o=d(()=>a?.value||`animatedicon`),{isFavoriteState:s,pageTheme:c,toggleTheme:f,toggleFavorite:g}=ge(o.value),{t:_}=te(),v=d(()=>_(`sample.animatedicon.page-title`)),y=d(()=>_(`sample.animatedicon.page-description`)),b=d(()=>_(`sample.animatedicon.button-header`)),x=d(()=>_(`sample.animatedicon.navigation-header`)),S=d(()=>_(`sample.animatedicon.button-description`)),C=d(()=>_(`sample.animatedicon.lottie`)),w=d(()=>_(`sample.animatedicon.animation-guidance`)),T=d(()=>_(`sample.animatedicon.navigation-description`)),E=d(()=>_(`sample.animatedicon.custom-animation-description`)),D=d(()=>_(`sample.animatedicon.example-button-name`)),O=d(()=>_(`sample.animatedicon.kind`)),k=d(()=>_(`sample.animatedicon.game-settings`)),A=d(()=>_(`gallery.page-header.toggle-theme`)),j=d(()=>_(`gallery.page-header.favorite`)),M=d(()=>s.value?``:``),N=i({}),P=d(()=>_(`sample.animatedicon.source.back`)),F=d(()=>_(`sample.animatedicon.source.chevron-down-small`)),I=d(()=>_(`sample.animatedicon.source.chevron-right-down-small`)),L=d(()=>_(`sample.animatedicon.source.chevron-up-down-small`)),R=d(()=>_(`sample.animatedicon.source.find`)),z=d(()=>_(`sample.animatedicon.source.global-navigation-button`)),B=d(()=>_(`sample.animatedicon.source.settings`)),V=d(()=>N.AnimatedVisualSourceSelection?.SelectedItem?.Tag??`AnimatedFindVisualSource`),H=d(()=>/AnimatedChevron(?:RightDown|UpDown)SmallVisualSource$/.test(V.value)),U=d(()=>H.value?`NormalOff`:`Normal`),W=!1,G=!1,K=new Map,ve=e=>e?(K.has(e)||K.set(e,ae(e)),K.get(e)??null):null,ye={AnimatedIconPage:{GetAnimationSourceFromString:ve}},q=e=>e+(G?`On`:`Off`),J=()=>p.SetState(N.SearchAnimatedIcon,q(W?`PointerOver`:`Normal`)),be=()=>{W=!0,p.SetState(N.SearchAnimatedIcon,H.value?q(`PointerOver`):`PointerOver`)},Y=()=>{W=!1,p.SetState(N.SearchAnimatedIcon,H.value?q(`Normal`):`Normal`)},xe=()=>{H.value&&p.SetState(N.SearchAnimatedIcon,q(`Pressed`))},X=()=>{H.value&&J()},Se=Y,Ce=X,we=()=>{H.value&&(G=!G,J())};ee(V,()=>{W=!1,G=!1,p.SetState(N.SearchAnimatedIcon,U.value)},{flush:`post`});let Z=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``,Q=d(()=>Z(H.value?h:m,`xaml`)),Te=d(()=>Z(H.value?h:m,`c#`)),Ee=Z(_e,`xaml`);r(u,N),r(re,{pageTitle:v,pageDescription:y,buttonHeader:b,navigationHeader:x,buttonDescription:S,lottieLabel:C,animationGuidance:w,navigationDescription:T,customAnimationDescription:E,exampleButtonName:D,kindLabel:O,gameSettingsLabel:k,toggleThemeLabel:A,favoriteLabel:j,favoriteGlyph:M,isFavoriteState:s,pageTheme:c,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,toggleTheme:f,toggleFavorite:g,Button_Click:we,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,initialAnimationState:U,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,controlPages:ye});let $={currentPage:a,pageKey:o,isFavoriteState:s,pageTheme:c,toggleTheme:f,toggleFavorite:g,t:_,pageTitle:v,pageDescription:y,buttonHeader:b,navigationHeader:x,buttonDescription:S,lottieLabel:C,animationGuidance:w,navigationDescription:T,customAnimationDescription:E,exampleButtonName:D,kindLabel:O,gameSettingsLabel:k,toggleThemeLabel:A,favoriteLabel:j,favoriteGlyph:M,names:N,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,selectedSourceName:V,isDirectionalArrow:H,initialAnimationState:U,get previewPointerOver(){return W},set previewPointerOver(e){W=e},get previewDirectionOn(){return G},set previewDirectionOn(e){G=e},animationSources:K,GetAnimationSourceFromString:ve,controlPages:ye,directionalState:q,restoreDirectionalState:J,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,Button_Click:we,sampleSection:Z,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,AnimatedIcon:oe,Button:se,ComboBox:ce,get ComboBoxItem(){return le},ControlExample:he,NavigationView:de,Page:t,ScrollViewer:ie,StackPanel:fe,TextBlock:l,ToggleButton:pe,get ControlExampleSubstitution(){return me},get NavigationViewItem(){return ue}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function _(t,ee,r,i,a,te){let c=n(`Run`),ne=n(`Hyperlink`),l=n(`LineBreak`),u=n(`SymbolIconSource`),d=n(`animatedvisuals:AnimatedSettingsVisualSource`),re=n(`FontIconSource`);return f(),o(i.Page,null,{default:e(()=>[s(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[s(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[s(i.StackPanel,{class:`page-heading`},{default:e(()=>[s(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),s(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),s(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:e(()=>[s(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind toggleThemeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind toggleThemeLabel, Mode=OneWay}`,Click:`toggleTheme`},{default:e(()=>[s(i.TextBlock,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),s(i.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:e(()=>[s(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),s(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[s(i.ControlExample,{"x:Name":`AnimatedIconExample1`,HeaderText:`{x:Bind buttonHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonXaml, Mode=OneWay}`,CSharp:`{x:Bind buttonCSharp, Mode=OneWay}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{class:`animated-icon-example`},{default:e(()=>[s(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:e(()=>[s(c,{Text:`{x:Bind buttonDescription, Mode=OneWay}`}),s(ne,{NavigateUri:`https://aka.ms/lottie`},{default:e(()=>[s(c,{Text:`{x:Bind lottieLabel, Mode=OneWay}`})]),_:1}),s(c,{Text:`{x:Bind animationGuidance, Mode=OneWay}`}),s(l)]),_:1}),s(i.Button,{Width:`75`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind exampleButtonName, Mode=OneWay}`,Click:`Button_Click`,PointerEntered:`Button_PointerEntered`,PointerExited:`Button_PointerExited`,PointerPressed:`Button_PointerPressed`,PointerReleased:`Button_PointerReleased`,PointerCanceled:`Button_PointerCanceled`,PointerCaptureLost:`Button_PointerCaptureLost`},{default:e(()=>[s(i.AnimatedIcon,{"x:Name":`SearchAnimatedIcon`,Source:`{x:Bind controlPages:AnimatedIconPage.GetAnimationSourceFromString(AnimatedVisualSourceSelection.SelectedItem.Tag), Mode=OneWay}`,"AnimatedIcon.State":`{x:Bind initialAnimationState, Mode=OneWay}`},{default:e(()=>[s(i.AnimatedIcon.FallbackIconSource,null,{default:e(()=>[s(u,{Symbol:`Find`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample.Output),s(i.ControlExample.Options,null,{default:e(()=>[s(i.ComboBox,{"x:Name":`AnimatedVisualSourceSelection`,class:`animated-icon-kind`,MinWidth:`340`,VerticalAlignment:`Center`,Header:`{x:Bind kindLabel, Mode=OneWay}`,SelectedIndex:`4`},{default:e(()=>[s(i.ComboBoxItem,{Content:`{x:Bind backLabel, Mode=OneWay}`,Tag:`AnimatedBackVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind downArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronDownSmallVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind rightDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronRightDownSmallVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind upDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronUpDownSmallVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind findLabel, Mode=OneWay}`,Tag:`AnimatedFindVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind navigationLabel, Mode=OneWay}`,Tag:`AnimatedGlobalNavigationButtonVisualSource`}),s(i.ComboBoxItem,{Content:`{x:Bind settingsLabel, Mode=OneWay}`,Tag:`AnimatedSettingsVisualSource`})]),_:1})]),_:1}),s(i.ControlExample.Substitutions,null,{default:e(()=>[s(i.ControlExampleSubstitution,{Key:`AnimatedVisualSourceKind`,Value:`{x:Bind AnimatedVisualSourceSelection.SelectedItem.Tag, Mode=OneWay}`})]),_:1})]),_:1}),s(i.ControlExample,{"x:Name":`AnimatedIconExample2`,HeaderText:`{x:Bind navigationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind navigationXaml, Mode=OneWay}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{class:`animated-icon-example`},{default:e(()=>[s(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:e(()=>[s(c,{Text:`{x:Bind navigationDescription, Mode=OneWay}`}),s(l),s(l),s(c,{Text:`{x:Bind customAnimationDescription, Mode=OneWay}`}),s(l),s(l)]),_:1}),s(i.NavigationView,{class:`animated-icon-navigation`,Height:`300`,MinHeight:`300`,IsSettingsVisible:`False`},{default:e(()=>[s(i.NavigationView.MenuItems,null,{default:e(()=>[s(i.NavigationViewItem,{Content:`{x:Bind gameSettingsLabel, Mode=OneWay}`},{default:e(()=>[s(i.NavigationViewItem.Icon,null,{default:e(()=>[s(i.AnimatedIcon,{"x:Name":`GameSettingsIcon`},{default:e(()=>[s(i.AnimatedIcon.Source,null,{default:e(()=>[s(d)]),_:1}),s(i.AnimatedIcon.FallbackIconSource,null,{default:e(()=>[s(re,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample.Output),s(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var v=a(g,[[`render`,_],[`__scopeId`,`data-v-eeb08ed1`],[`__file`,`AnimatedIconPage.vue`]]);export{v as default};