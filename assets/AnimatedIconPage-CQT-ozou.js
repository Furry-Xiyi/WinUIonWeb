import{Ai as e,Di as t,Ei as n,I as ee,Ki as te,Li as r,Pi as i,Wt as a,_i as ne,ai as o,cr as s,et as c,mi as l,o as u,pi as d,si as f,sr as p,t as re}from"./ScrollViewer-BWDA_C78.js";import{i as ie,t as ae}from"./AnimatedIcon-CPSSzV35.js";import{n as m}from"./animatedIconInput-a87BRGj9.js";import{t as oe}from"./Button-BNDPNdYJ.js";import{t as se}from"./ComboBox-c_LaT8fC.js";import{t as ce}from"./inlineControlProperties-CBoqGJWv.js";import{r as le,t as ue}from"./NavigationView-BXIseH2I.js";import{t as de}from"./StackPanel-sg_Bd5oB.js";import{t as fe}from"./ToggleButton-HP5wmrvH.js";import{a as pe,t as me}from"./ControlExample-CzGyf8u0.js";import{t as he}from"./pageState-CcJibQcm.js";var h=`--- header
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
`,g=`--- header
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
`,ge=`--- header
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
`,_=l({__name:`AnimatedIconPage`,setup(e,{expose:n}){n();let r=ne(`currentPage`),a=o(()=>r?.value||`animatedicon`),{isFavoriteState:l,pageTheme:d,toggleTheme:f,toggleFavorite:_}=he(a.value),{t:v}=c(),y=o(()=>v(`sample.animatedicon.page-title`)),b=o(()=>v(`sample.animatedicon.page-description`)),x=o(()=>v(`sample.animatedicon.button-header`)),S=o(()=>v(`sample.animatedicon.navigation-header`)),C=o(()=>v(`sample.animatedicon.button-description`)),w=o(()=>v(`sample.animatedicon.lottie`)),T=o(()=>v(`sample.animatedicon.animation-guidance`)),E=o(()=>v(`sample.animatedicon.navigation-description`)),D=o(()=>v(`sample.animatedicon.custom-animation-description`)),O=o(()=>v(`sample.animatedicon.example-button-name`)),k=o(()=>v(`sample.animatedicon.kind`)),A=o(()=>v(`sample.animatedicon.game-settings`)),j=o(()=>v(`gallery.page-header.toggle-theme`)),_e=o(()=>v(`gallery.page-header.favorite`)),M=o(()=>l.value?``:``),N=te({}),P=o(()=>v(`sample.animatedicon.source.back`)),F=o(()=>v(`sample.animatedicon.source.chevron-down-small`)),I=o(()=>v(`sample.animatedicon.source.chevron-right-down-small`)),L=o(()=>v(`sample.animatedicon.source.chevron-up-down-small`)),R=o(()=>v(`sample.animatedicon.source.find`)),z=o(()=>v(`sample.animatedicon.source.global-navigation-button`)),B=o(()=>v(`sample.animatedicon.source.settings`)),V=o(()=>N.AnimatedVisualSourceSelection?.SelectedItem?.Tag??`AnimatedFindVisualSource`),H=o(()=>/AnimatedChevron(?:RightDown|UpDown)SmallVisualSource$/.test(V.value)),U=o(()=>H.value?`NormalOff`:`Normal`),W=!1,G=!1,K=new Map,ve=e=>e?(K.has(e)||K.set(e,ie(e)),K.get(e)??null):null,ye={AnimatedIconPage:{GetAnimationSourceFromString:ve}},q=e=>e+(G?`On`:`Off`),J=()=>m.SetState(N.SearchAnimatedIcon,q(W?`PointerOver`:`Normal`)),be=()=>{W=!0,m.SetState(N.SearchAnimatedIcon,H.value?q(`PointerOver`):`PointerOver`)},Y=()=>{W=!1,m.SetState(N.SearchAnimatedIcon,H.value?q(`Normal`):`Normal`)},xe=()=>{H.value&&m.SetState(N.SearchAnimatedIcon,q(`Pressed`))},X=()=>{H.value&&J()},Se=Y,Ce=X,we=()=>{H.value&&(G=!G,J())};i(V,()=>{W=!1,G=!1,m.SetState(N.SearchAnimatedIcon,U.value)},{flush:`post`});let Z=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``,Q=o(()=>Z(H.value?g:h,`xaml`)),Te=o(()=>Z(H.value?g:h,`c#`)),Ee=Z(ge,`xaml`);t(p,N),t(s,{pageTitle:y,pageDescription:b,buttonHeader:x,navigationHeader:S,buttonDescription:C,lottieLabel:w,animationGuidance:T,navigationDescription:E,customAnimationDescription:D,exampleButtonName:O,kindLabel:k,gameSettingsLabel:A,toggleThemeLabel:j,favoriteLabel:_e,favoriteGlyph:M,isFavoriteState:l,pageTheme:d,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,toggleTheme:f,toggleFavorite:_,Button_Click:we,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,initialAnimationState:U,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,controlPages:ye});let $={currentPage:r,pageKey:a,isFavoriteState:l,pageTheme:d,toggleTheme:f,toggleFavorite:_,t:v,pageTitle:y,pageDescription:b,buttonHeader:x,navigationHeader:S,buttonDescription:C,lottieLabel:w,animationGuidance:T,navigationDescription:E,customAnimationDescription:D,exampleButtonName:O,kindLabel:k,gameSettingsLabel:A,toggleThemeLabel:j,favoriteLabel:_e,favoriteGlyph:M,names:N,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,selectedSourceName:V,isDirectionalArrow:H,initialAnimationState:U,get previewPointerOver(){return W},set previewPointerOver(e){W=e},get previewDirectionOn(){return G},set previewDirectionOn(e){G=e},animationSources:K,GetAnimationSourceFromString:ve,controlPages:ye,directionalState:q,restoreDirectionalState:J,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,Button_Click:we,sampleSection:Z,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,AnimatedIcon:ae,Button:oe,ComboBox:se,get ComboBoxItem(){return ce},ControlExample:me,NavigationView:ue,Page:ee,ScrollViewer:re,StackPanel:de,TextBlock:u,ToggleButton:fe,get ControlExampleSubstitution(){return pe},get NavigationViewItem(){return le}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function v(t,ee,te,i,a,ne){let o=e(`Run`),s=e(`Hyperlink`),c=e(`LineBreak`),l=e(`SymbolIconSource`),u=e(`animatedvisuals:AnimatedSettingsVisualSource`),p=e(`FontIconSource`);return n(),f(i.Page,null,{default:r(()=>[d(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[d(i.StackPanel,{class:`gallery-item-page`},{default:r(()=>[d(i.StackPanel,{class:`page-heading`},{default:r(()=>[d(i.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),d(i.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:r(()=>[d(i.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind toggleThemeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind toggleThemeLabel, Mode=OneWay}`,Click:`toggleTheme`},{default:r(()=>[d(i.TextBlock,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),d(i.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:r(()=>[d(i.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),d(i.StackPanel,{class:`gallery-page-content`},{default:r(()=>[d(i.ControlExample,{"x:Name":`AnimatedIconExample1`,HeaderText:`{x:Bind buttonHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonXaml, Mode=OneWay}`,CSharp:`{x:Bind buttonCSharp, Mode=OneWay}`},{default:r(()=>[d(i.ControlExample.Example,null,{default:r(()=>[d(i.StackPanel,{class:`animated-icon-example`},{default:r(()=>[d(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:r(()=>[d(o,{Text:`{x:Bind buttonDescription, Mode=OneWay}`}),d(s,{NavigateUri:`https://aka.ms/lottie`},{default:r(()=>[d(o,{Text:`{x:Bind lottieLabel, Mode=OneWay}`})]),_:1}),d(o,{Text:`{x:Bind animationGuidance, Mode=OneWay}`}),d(c)]),_:1}),d(i.Button,{Width:`75`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind exampleButtonName, Mode=OneWay}`,Click:`Button_Click`,PointerEntered:`Button_PointerEntered`,PointerExited:`Button_PointerExited`,PointerPressed:`Button_PointerPressed`,PointerReleased:`Button_PointerReleased`,PointerCanceled:`Button_PointerCanceled`,PointerCaptureLost:`Button_PointerCaptureLost`},{default:r(()=>[d(i.AnimatedIcon,{"x:Name":`SearchAnimatedIcon`,Source:`{x:Bind controlPages:AnimatedIconPage.GetAnimationSourceFromString(AnimatedVisualSourceSelection.SelectedItem.Tag), Mode=OneWay}`,"AnimatedIcon.State":`{x:Bind initialAnimationState, Mode=OneWay}`},{default:r(()=>[d(i.AnimatedIcon.FallbackIconSource,null,{default:r(()=>[d(l,{Symbol:`Find`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options,null,{default:r(()=>[d(i.ComboBox,{"x:Name":`AnimatedVisualSourceSelection`,class:`animated-icon-kind`,MinWidth:`340`,VerticalAlignment:`Center`,Header:`{x:Bind kindLabel, Mode=OneWay}`,SelectedIndex:`4`},{default:r(()=>[d(i.ComboBoxItem,{Content:`{x:Bind backLabel, Mode=OneWay}`,Tag:`AnimatedBackVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind downArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronDownSmallVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind rightDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronRightDownSmallVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind upDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronUpDownSmallVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind findLabel, Mode=OneWay}`,Tag:`AnimatedFindVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind navigationLabel, Mode=OneWay}`,Tag:`AnimatedGlobalNavigationButtonVisualSource`}),d(i.ComboBoxItem,{Content:`{x:Bind settingsLabel, Mode=OneWay}`,Tag:`AnimatedSettingsVisualSource`})]),_:1})]),_:1}),d(i.ControlExample.Substitutions,null,{default:r(()=>[d(i.ControlExampleSubstitution,{Key:`AnimatedVisualSourceKind`,Value:`{x:Bind AnimatedVisualSourceSelection.SelectedItem.Tag, Mode=OneWay}`})]),_:1})]),_:1}),d(i.ControlExample,{"x:Name":`AnimatedIconExample2`,HeaderText:`{x:Bind navigationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind navigationXaml, Mode=OneWay}`},{default:r(()=>[d(i.ControlExample.Example,null,{default:r(()=>[d(i.StackPanel,{class:`animated-icon-example`},{default:r(()=>[d(i.TextBlock,{TextWrapping:`WrapWholeWords`},{default:r(()=>[d(o,{Text:`{x:Bind navigationDescription, Mode=OneWay}`}),d(c),d(c),d(o,{Text:`{x:Bind customAnimationDescription, Mode=OneWay}`}),d(c),d(c)]),_:1}),d(i.NavigationView,{class:`animated-icon-navigation`,Height:`300`,MinHeight:`300`,IsSettingsVisible:`False`},{default:r(()=>[d(i.NavigationView.MenuItems,null,{default:r(()=>[d(i.NavigationViewItem,{Content:`{x:Bind gameSettingsLabel, Mode=OneWay}`},{default:r(()=>[d(i.NavigationViewItem.Icon,null,{default:r(()=>[d(i.AnimatedIcon,{"x:Name":`GameSettingsIcon`},{default:r(()=>[d(i.AnimatedIcon.Source,null,{default:r(()=>[d(u)]),_:1}),d(i.AnimatedIcon.FallbackIconSource,null,{default:r(()=>[d(p,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(i.ControlExample.Output),d(i.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var y=a(_,[[`render`,v],[`__scopeId`,`data-v-eeb08ed1`],[`__file`,`AnimatedIconPage.vue`]]);export{y as default};