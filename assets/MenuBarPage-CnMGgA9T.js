import{$i as e,Ai as t,Bi as n,Cn as r,Mn as i,Yi as a,a as o,bi as s,ci as c,dr as l,fr as u,gi as d,ki as f,o as p,p as m,t as h,ui as g}from"./ScrollViewer-B43ymvAj.js";import{t as _}from"./Button-B49t7g4C.js";import{t as v}from"./StackPanel-Dy6dKYi5.js";import{c as y,d as b,l as x,n as S,t as C}from"./MenuFlyoutItems-iTBXcIm-.js";import{t as w}from"./ToggleButton-DDZy2gVz.js";import{t as T}from"./ControlExample-Ddvmn5_c.js";import{n as E,t as D}from"./MenuBarItem-BxSDf536.js";import{t as O}from"./pageState-BQHW0me4.js";var k=`--- header
A simple MenuBar
--- xaml
<MenuBar>
    <MenuBarItem Title="File">
        <MenuFlyoutItem Text="New"/>
        <MenuFlyoutItem Text="Open..."/>
        <MenuFlyoutItem Text="Save"/>
        <MenuFlyoutItem Text="Exit"/>
    </MenuBarItem>

    <MenuBarItem Title="Edit">
        <MenuFlyoutItem Text="Undo"/>
        <MenuFlyoutItem Text="Cut"/>
        <MenuFlyoutItem Text="Copy"/>
        <MenuFlyoutItem Text="Paste"/>
    </MenuBarItem>

    <MenuBarItem Title="Help">
        <MenuFlyoutItem Text="About"/>
    </MenuBarItem>
</MenuBar>
`,A=`--- header
MenuBar with keyboard accelerators
--- xaml
<MenuBar>
  <MenuBarItem Title="File">
    <MenuFlyoutItem Text="New">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="N"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Open...">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="O"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Save">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="S"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Exit">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="E"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>

  <MenuBarItem Title="Edit">
    <MenuFlyoutItem Text="Undo">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="Z"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Cut">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="X"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Copy">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="C"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Paste">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="V"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>

  <MenuBarItem Title="Help">
    <MenuFlyoutItem Text="About">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Control" Key="I"/>
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>
</MenuBar>
`,j=`--- header
MenuBar with submenus, separators, and radio items
--- xaml
<MenuBar>
    <MenuBarItem Title="File">
        <MenuFlyoutSubItem Text="New">
            <MenuFlyoutItem Text="Plain Text Document"/>
            <MenuFlyoutItem Text="Rich Text Document"/>
            <MenuFlyoutItem Text="Other Formats..."/>
        </MenuFlyoutSubItem>
        <MenuFlyoutItem Text="Open..."/>
        <MenuFlyoutItem Text="Save"/>
        <MenuFlyoutSeparator />
        <MenuFlyoutItem Text="Exit"/>
    </MenuBarItem>

    <MenuBarItem Title="Edit">
        <MenuFlyoutItem Text="Undo"/>
        <MenuFlyoutItem Text="Cut"/>
        <MenuFlyoutItem Text="Copy"/>
        <MenuFlyoutItem Text="Paste"/>
    </MenuBarItem>

    <MenuBarItem Title="View">
        <MenuFlyoutItem Text="Output"/>
        <MenuFlyoutSeparator/>
        <RadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup"/>
        <RadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True"/>
        <MenuFlyoutSeparator/>
        <RadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup"/>
        <RadioMenuFlyoutItem Text="Medium icons" IsChecked="True" GroupName="SizeGroup"/>
        <RadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup"/>
    </MenuBarItem>

    <MenuBarItem Title="Help">
        <MenuFlyoutItem Text="About"/>
    </MenuBarItem>
</MenuBar>
`,M=i({__name:`MenuBarPage`,setup(i){let{t:M}=m(),{isFavoriteState:N,pageTheme:P,toggleTheme:F,toggleFavorite:I}=O(s(`currentPage`)?.value||`menubar`);t(l,a({}));let L=c(()=>({Title:M(`text.menubar`),Description:M(`text.the-menubar-simplifies-the-creation-of-basic-men`),ToggleTheme:M(`gallery.page-header.toggle-theme`),SimpleHeader:M(`text.a-simple-menubar`),KeyboardHeader:M(`sample.menubar.keyboard`),SubmenusHeader:M(`sample.menubar.submenus`),File:M(`MenuBarSample_File.Title`),Edit:M(`MenuBarSample_Edit.Title`),View:M(`MenuBarSample_View.Title`),Help:M(`MenuBarSample_Help.Title`),New:M(`MenuBarSample_New.Text`),Open:M(`MenuBarSample_Open.Text`),Save:M(`MenuBarSample_Save.Text`),Exit:M(`MenuBarSample_Exit.Text`),Undo:M(`MenuBarSample_Undo.Text`),Cut:M(`MenuBarSample_Cut.Text`),Copy:M(`MenuBarSample_Copy.Text`),Paste:M(`MenuBarSample_Paste.Text`),About:M(`MenuBarSample_About.Text`),PlainText:M(`MenuBarSample_PlainText.Text`),RichText:M(`MenuBarSample_RichText.Text`),OtherFormats:M(`MenuBarSample_OtherFormats.Text`),Output:M(`MenuBarSample_Output.Text`),Landscape:M(`MenuBarSample_Landscape.Text`),Portrait:M(`MenuBarSample_Portrait.Text`),SmallIcons:M(`MenuBarSample_SmallIcons.Text`),MediumIcons:M(`MenuBarSample_MediumIcons.Text`),LargeIcons:M(`MenuBarSample_LargeIcons.Text`)})),R=c(()=>M(N.value?`gallery.remove-favorite`:`gallery.add-favorite`)),z=c(()=>N.value?``:``),B=a({o:null,t:null,z:null}),V=e=>e?M(`sample.menubar.clicked-output`,{value:e.Text}):``,H=c(()=>({Simple:V(B.o),Keyboard:V(B.t),Submenus:V(B.z)})),U=e=>{let t=String(e?.Name??``).slice(0,1);Object.prototype.hasOwnProperty.call(B,t)&&(B[t]=e)},W=e=>e.split(/^--- xaml\s*\r?\n/m)[1]?.trim()??``;return t(u,{Labels:L,FavoriteLabel:R,FavoriteGlyph:z,isFavoriteState:N,pageTheme:P,toggleTheme:F,toggleFavorite:I,Outputs:H,OnElementClicked:U,SimpleXaml:W(k),KeyboardXaml:W(A),SubmenusXaml:W(j)}),(t,i)=>(f(),g(r,null,{default:n(()=>[d(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(v,{class:`gallery-item-page`},{default:n(()=>[d(v,{class:`page-heading`},{default:n(()=>[d(p,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),d(p,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),d(v,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:n(()=>[d(_,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:n(()=>[d(o,{Glyph:``,FontSize:`16`})]),_:1}),d(w,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:n(()=>[d(o,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),d(v,{class:`gallery-page-content`},{default:n(()=>[d(T,{SampleDefinition:`MenuBar\\SimpleMenubar.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(v,{class:`menubar-example-stack`},{default:n(()=>[d(p,{"x:Name":`SelectedOptionText`,class:`menubar-output`,Text:`{x:Bind Outputs.Simple, Mode=OneWay}`,TextWrapping:`Wrap`}),d(E,{"x:Name":`Example1`},{default:n(()=>[d(D,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`o1`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o2`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`o5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`o8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`o9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(T,{SampleDefinition:`MenuBar\\MenubarKeyboardAccelerators.txt`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(v,{class:`menubar-example-stack`},{default:n(()=>[d(p,{"x:Name":`SelectedOptionText1`,class:`menubar-output`,Text:`{x:Bind Outputs.Keyboard, Mode=OneWay}`,TextWrapping:`Wrap`}),d(E,{"x:Name":`Example2`},{default:n(()=>[d(D,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`t2`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`N`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t1`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`O`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`E`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`t5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`Z`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`X`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),d(e(S),{"x:Name":`t8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`V`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`t9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`},{default:n(()=>[d(e(S).KeyboardAccelerators,null,{default:n(()=>[d(e(C),{Key:`I`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),d(T,{SampleDefinition:`MenuBar\\MenubarSubmenusSeparatorsRadio.txt`,HeaderText:`{x:Bind Labels.SubmenusHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SubmenusXaml}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(v,{class:`menubar-example-stack`},{default:n(()=>[d(p,{"x:Name":`SelectedOptionText2`,class:`menubar-output`,Text:`{x:Bind Outputs.Submenus, Mode=OneWay}`,TextWrapping:`Wrap`}),d(E,{"x:Name":`Example3`},{default:n(()=>[d(D,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:n(()=>[d(e(x),{"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`z1`,"x:Uid":`MenuBarSample_PlainText`,Text:`{x:Bind Labels.PlainText, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z2`,"x:Uid":`MenuBarSample_RichText`,Text:`{x:Bind Labels.RichText, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z3`,"x:Uid":`MenuBarSample_OtherFormats`,Text:`{x:Bind Labels.OtherFormats, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),d(e(S),{"x:Name":`z4`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z5`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(y)),d(e(S),{"x:Name":`z6`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`z7`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z8`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z9`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(S),{"x:Name":`z11`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),d(D,{"x:Uid":`MenuBarSample_View`,Title:`{x:Bind Labels.View, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`z12`,"x:Uid":`MenuBarSample_Output`,Text:`{x:Bind Labels.Output, Mode=OneWay}`,Click:`OnElementClicked`}),d(e(y)),d(e(b),{"x:Name":`z13`,"x:Uid":`MenuBarSample_Landscape`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`}),d(e(b),{"x:Name":`z14`,"x:Uid":`MenuBarSample_Portrait`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`,IsChecked:`True`}),d(e(y)),d(e(b),{"x:Name":`z15`,"x:Uid":`MenuBarSample_SmallIcons`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`}),d(e(b),{"x:Name":`z16`,"x:Uid":`MenuBarSample_MediumIcons`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`,IsChecked:`True`}),d(e(b),{"x:Name":`z17`,"x:Uid":`MenuBarSample_LargeIcons`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`})]),_:1}),d(D,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:n(()=>[d(e(S),{"x:Name":`z18`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},[[`__scopeId`,`data-v-91ff16f4`]]);export{M as default};