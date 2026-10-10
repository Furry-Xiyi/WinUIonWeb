import{Ai as e,Bi as t,Cn as ee,Li as te,Mn as n,Ni as r,Yi as ne,_i as i,bi as a,bn as o,ci as s,dr as c,fr as l,gi as u,ki as d,o as f,p as re,t as ie,ui as p}from"./ScrollViewer-CHNE18MA.js";import{n as m}from"./animatedIconInput-KLJFL83R.js";import{t as ae}from"./Button-DO0TiUOq.js";import{i as oe,t as se}from"./AnimatedIcon-OuDw4imM.js";import{r as ce,t as le}from"./NavigationView-BY488s-A.js";import{t as ue}from"./StackPanel-C60XOD66.js";import{t as de}from"./ToggleButton-ZsjZg8Nu.js";import{t as fe}from"./ComboBox-CjdqaKdN.js";import{t as pe}from"./inlineControlProperties-k1PUSjJA.js";import{t as me}from"./ControlExample-BKyw2NwY.js";import{t as he}from"./pageState-Djrh7EdY.js";var h=`--- header
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
`,_=i({__name:`AnimatedIconPage`,setup(t,{expose:n}){n();let r=a(`currentPage`),i=s(()=>r?.value||`animatedicon`),{isFavoriteState:u,pageTheme:d,toggleTheme:p,toggleFavorite:_}=he(i.value),{t:v}=re(),y=s(()=>v(`sample.animatedicon.page-title`)),b=s(()=>v(`sample.animatedicon.page-description`)),x=s(()=>v(`sample.animatedicon.button-header`)),S=s(()=>v(`sample.animatedicon.navigation-header`)),C=s(()=>v(`sample.animatedicon.button-description`)),w=s(()=>v(`sample.animatedicon.lottie`)),T=s(()=>v(`sample.animatedicon.animation-guidance`)),E=s(()=>v(`sample.animatedicon.navigation-description`)),D=s(()=>v(`sample.animatedicon.custom-animation-description`)),O=s(()=>v(`sample.animatedicon.example-button-name`)),k=s(()=>v(`sample.animatedicon.kind`)),A=s(()=>v(`sample.animatedicon.game-settings`)),_e=s(()=>v(`gallery.page-header.toggle-theme`)),j=s(()=>v(`gallery.page-header.favorite`)),M=s(()=>u.value?``:``),N=ne({}),P=s(()=>v(`sample.animatedicon.source.back`)),F=s(()=>v(`sample.animatedicon.source.chevron-down-small`)),I=s(()=>v(`sample.animatedicon.source.chevron-right-down-small`)),L=s(()=>v(`sample.animatedicon.source.chevron-up-down-small`)),R=s(()=>v(`sample.animatedicon.source.find`)),z=s(()=>v(`sample.animatedicon.source.global-navigation-button`)),B=s(()=>v(`sample.animatedicon.source.settings`)),V=s(()=>N.AnimatedVisualSourceSelection?.SelectedItem?.Tag??`AnimatedFindVisualSource`),H=s(()=>/AnimatedChevron(?:RightDown|UpDown)SmallVisualSource$/.test(V.value)),U=s(()=>H.value?`NormalOff`:`Normal`),W=!1,G=!1,K=new Map,ve=e=>e?(K.has(e)||K.set(e,oe(e)),K.get(e)??null):null,ye={AnimatedIconPage:{GetAnimationSourceFromString:ve}},q=e=>e+(G?`On`:`Off`),J=()=>m.SetState(N.SearchAnimatedIcon,q(W?`PointerOver`:`Normal`)),be=()=>{W=!0,m.SetState(N.SearchAnimatedIcon,H.value?q(`PointerOver`):`PointerOver`)},Y=()=>{W=!1,m.SetState(N.SearchAnimatedIcon,H.value?q(`Normal`):`Normal`)},xe=()=>{H.value&&m.SetState(N.SearchAnimatedIcon,q(`Pressed`))},X=()=>{H.value&&J()},Se=Y,Ce=X,we=()=>{H.value&&(G=!G,J())};te(V,()=>{W=!1,G=!1,m.SetState(N.SearchAnimatedIcon,U.value)},{flush:`post`});let Z=(e,t)=>e.match(RegExp(`(?:^|\\r?\\n)--- `+t+`\\r?\\n([\\s\\S]*?)(?=\\r?\\n--- |$)`))?.[1].trim()??``,Q=s(()=>Z(H.value?g:h,`xaml`)),Te=s(()=>Z(H.value?g:h,`c#`)),Ee=Z(ge,`xaml`);e(c,N),e(l,{pageTitle:y,pageDescription:b,buttonHeader:x,navigationHeader:S,buttonDescription:C,lottieLabel:w,animationGuidance:T,navigationDescription:E,customAnimationDescription:D,exampleButtonName:O,kindLabel:k,gameSettingsLabel:A,toggleThemeLabel:_e,favoriteLabel:j,favoriteGlyph:M,isFavoriteState:u,pageTheme:d,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,toggleTheme:p,toggleFavorite:_,Button_Click:we,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,initialAnimationState:U,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,controlPages:ye});let $={currentPage:r,pageKey:i,isFavoriteState:u,pageTheme:d,toggleTheme:p,toggleFavorite:_,t:v,pageTitle:y,pageDescription:b,buttonHeader:x,navigationHeader:S,buttonDescription:C,lottieLabel:w,animationGuidance:T,navigationDescription:E,customAnimationDescription:D,exampleButtonName:O,kindLabel:k,gameSettingsLabel:A,toggleThemeLabel:_e,favoriteLabel:j,favoriteGlyph:M,names:N,backLabel:P,downArrowLabel:F,rightDownArrowLabel:I,upDownArrowLabel:L,findLabel:R,navigationLabel:z,settingsLabel:B,selectedSourceName:V,isDirectionalArrow:H,initialAnimationState:U,get previewPointerOver(){return W},set previewPointerOver(e){W=e},get previewDirectionOn(){return G},set previewDirectionOn(e){G=e},animationSources:K,GetAnimationSourceFromString:ve,controlPages:ye,directionalState:q,restoreDirectionalState:J,Button_PointerEntered:be,Button_PointerExited:Y,Button_PointerPressed:xe,Button_PointerReleased:X,Button_PointerCanceled:Se,Button_PointerCaptureLost:Ce,Button_Click:we,sampleSection:Z,buttonXaml:Q,buttonCSharp:Te,navigationXaml:Ee,AnimatedIcon:se,Button:ae,ComboBox:fe,get ComboBoxItem(){return pe},ControlExample:me,NavigationView:le,Page:ee,ScrollViewer:ie,StackPanel:ue,TextBlock:f,ToggleButton:de,get ControlExampleSubstitution(){return o},get NavigationViewItem(){return ce}};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function v(e,ee,te,n,ne,i){let a=r(`Run`),o=r(`Hyperlink`),s=r(`LineBreak`),c=r(`SymbolIconSource`),l=r(`animatedvisuals:AnimatedSettingsVisualSource`),f=r(`FontIconSource`);return d(),p(n.Page,null,{default:t(()=>[u(n.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(n.StackPanel,{class:`gallery-item-page`},{default:t(()=>[u(n.StackPanel,{class:`page-heading`},{default:t(()=>[u(n.TextBlock,{class:`page-header`,Text:`{x:Bind pageTitle, Mode=OneWay}`}),u(n.TextBlock,{class:`page-description`,Text:`{x:Bind pageDescription, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(n.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`},{default:t(()=>[u(n.Button,{class:`header-action`,"AutomationProperties.Name":`{x:Bind toggleThemeLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind toggleThemeLabel, Mode=OneWay}`,Click:`toggleTheme`},{default:t(()=>[u(n.TextBlock,{class:`icon`,Text:``,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1}),u(n.ToggleButton,{class:`header-action`,"AutomationProperties.Name":`{x:Bind favoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind favoriteLabel, Mode=OneWay}`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`},{default:t(()=>[u(n.TextBlock,{class:`icon`,Text:`{x:Bind favoriteGlyph, Mode=OneWay}`,FontFamily:`{ThemeResource SymbolThemeFontFamily}`})]),_:1})]),_:1})]),_:1}),u(n.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(n.ControlExample,{"x:Name":`AnimatedIconExample1`,HeaderText:`{x:Bind buttonHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind buttonXaml, Mode=OneWay}`,CSharp:`{x:Bind buttonCSharp, Mode=OneWay}`},{default:t(()=>[u(n.ControlExample.Example,null,{default:t(()=>[u(n.StackPanel,{class:`animated-icon-example`},{default:t(()=>[u(n.TextBlock,{TextWrapping:`WrapWholeWords`},{default:t(()=>[u(a,{Text:`{x:Bind buttonDescription, Mode=OneWay}`}),u(o,{NavigateUri:`https://aka.ms/lottie`},{default:t(()=>[u(a,{Text:`{x:Bind lottieLabel, Mode=OneWay}`})]),_:1}),u(a,{Text:`{x:Bind animationGuidance, Mode=OneWay}`}),u(s)]),_:1}),u(n.Button,{Width:`75`,HorizontalAlignment:`Left`,"AutomationProperties.Name":`{x:Bind exampleButtonName, Mode=OneWay}`,Click:`Button_Click`,PointerEntered:`Button_PointerEntered`,PointerExited:`Button_PointerExited`,PointerPressed:`Button_PointerPressed`,PointerReleased:`Button_PointerReleased`,PointerCanceled:`Button_PointerCanceled`,PointerCaptureLost:`Button_PointerCaptureLost`},{default:t(()=>[u(n.AnimatedIcon,{"x:Name":`SearchAnimatedIcon`,Source:`{x:Bind controlPages:AnimatedIconPage.GetAnimationSourceFromString(AnimatedVisualSourceSelection.SelectedItem.Tag), Mode=OneWay}`,"AnimatedIcon.State":`{x:Bind initialAnimationState, Mode=OneWay}`},{default:t(()=>[u(n.AnimatedIcon.FallbackIconSource,null,{default:t(()=>[u(c,{Symbol:`Find`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(n.ControlExample.Output),u(n.ControlExample.Options,null,{default:t(()=>[u(n.ComboBox,{"x:Name":`AnimatedVisualSourceSelection`,class:`animated-icon-kind`,MinWidth:`340`,VerticalAlignment:`Center`,Header:`{x:Bind kindLabel, Mode=OneWay}`,SelectedIndex:`4`},{default:t(()=>[u(n.ComboBoxItem,{Content:`{x:Bind backLabel, Mode=OneWay}`,Tag:`AnimatedBackVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind downArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronDownSmallVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind rightDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronRightDownSmallVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind upDownArrowLabel, Mode=OneWay}`,Tag:`AnimatedChevronUpDownSmallVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind findLabel, Mode=OneWay}`,Tag:`AnimatedFindVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind navigationLabel, Mode=OneWay}`,Tag:`AnimatedGlobalNavigationButtonVisualSource`}),u(n.ComboBoxItem,{Content:`{x:Bind settingsLabel, Mode=OneWay}`,Tag:`AnimatedSettingsVisualSource`})]),_:1})]),_:1}),u(n.ControlExample.Substitutions,null,{default:t(()=>[u(n.ControlExampleSubstitution,{Key:`AnimatedVisualSourceKind`,Value:`{x:Bind AnimatedVisualSourceSelection.SelectedItem.Tag, Mode=OneWay}`})]),_:1})]),_:1}),u(n.ControlExample,{"x:Name":`AnimatedIconExample2`,HeaderText:`{x:Bind navigationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind navigationXaml, Mode=OneWay}`},{default:t(()=>[u(n.ControlExample.Example,null,{default:t(()=>[u(n.StackPanel,{class:`animated-icon-example`},{default:t(()=>[u(n.TextBlock,{TextWrapping:`WrapWholeWords`},{default:t(()=>[u(a,{Text:`{x:Bind navigationDescription, Mode=OneWay}`}),u(s),u(s),u(a,{Text:`{x:Bind customAnimationDescription, Mode=OneWay}`}),u(s),u(s)]),_:1}),u(n.NavigationView,{class:`animated-icon-navigation`,Height:`300`,MinHeight:`300`,IsSettingsVisible:`False`},{default:t(()=>[u(n.NavigationView.MenuItems,null,{default:t(()=>[u(n.NavigationViewItem,{Content:`{x:Bind gameSettingsLabel, Mode=OneWay}`},{default:t(()=>[u(n.NavigationViewItem.Icon,null,{default:t(()=>[u(n.AnimatedIcon,{"x:Name":`GameSettingsIcon`},{default:t(()=>[u(n.AnimatedIcon.Source,null,{default:t(()=>[u(l)]),_:1}),u(n.AnimatedIcon.FallbackIconSource,null,{default:t(()=>[u(f,{Glyph:``})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(n.ControlExample.Output),u(n.ControlExample.Options)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var y=n(_,[[`render`,v],[`__scopeId`,`data-v-eeb08ed1`],[`__file`,`AnimatedIconPage.vue`]]);export{y as default};