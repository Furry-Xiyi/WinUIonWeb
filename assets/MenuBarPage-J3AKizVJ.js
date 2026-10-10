import{Fi as e,I as t,Ti as n,Wi as r,Wt as i,a,ai as o,di as s,et as c,hi as l,o as u,or as d,ri as f,sr as p,t as m,wi as h}from"./ScrollViewer-PoO_ma9Z.js";import{t as g}from"./Button-DjU0urmJ.js";import{t as _}from"./StackPanel-CT7pl8zy.js";import{c as v,d as y,l as b,n as x,t as S}from"./MenuFlyoutItems-CdFb5Edx.js";import{n as C,t as w}from"./MenuBarItem-D8bLr9Ra.js";import{t as T}from"./ToggleButton-DwmhXZge.js";import{t as E}from"./ControlExample-C1ahTZEr.js";import{t as D}from"./pageState-BN3kXI7L.js";var O=`--- header
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
`,k=`--- header
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
`,A=`--- header
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
`,j={__name:`MenuBarPage`,setup(e,{expose:i}){i();let{t:o}=c(),s=l(`currentPage`),{isFavoriteState:h,pageTheme:j,toggleTheme:M,toggleFavorite:N}=D(s?.value||`menubar`),P=r({});n(d,P);let F=f(()=>({Title:o(`text.menubar`),Description:o(`text.the-menubar-simplifies-the-creation-of-basic-men`),ToggleTheme:o(`gallery.page-header.toggle-theme`),SimpleHeader:o(`text.a-simple-menubar`),KeyboardHeader:o(`sample.menubar.keyboard`),SubmenusHeader:o(`sample.menubar.submenus`),File:o(`MenuBarSample_File.Title`),Edit:o(`MenuBarSample_Edit.Title`),View:o(`MenuBarSample_View.Title`),Help:o(`MenuBarSample_Help.Title`),New:o(`MenuBarSample_New.Text`),Open:o(`MenuBarSample_Open.Text`),Save:o(`MenuBarSample_Save.Text`),Exit:o(`MenuBarSample_Exit.Text`),Undo:o(`MenuBarSample_Undo.Text`),Cut:o(`MenuBarSample_Cut.Text`),Copy:o(`MenuBarSample_Copy.Text`),Paste:o(`MenuBarSample_Paste.Text`),About:o(`MenuBarSample_About.Text`),PlainText:o(`MenuBarSample_PlainText.Text`),RichText:o(`MenuBarSample_RichText.Text`),OtherFormats:o(`MenuBarSample_OtherFormats.Text`),Output:o(`MenuBarSample_Output.Text`),Landscape:o(`MenuBarSample_Landscape.Text`),Portrait:o(`MenuBarSample_Portrait.Text`),SmallIcons:o(`MenuBarSample_SmallIcons.Text`),MediumIcons:o(`MenuBarSample_MediumIcons.Text`),LargeIcons:o(`MenuBarSample_LargeIcons.Text`)})),I=f(()=>o(h.value?`gallery.remove-favorite`:`gallery.add-favorite`)),L=f(()=>h.value?``:``),R=r({o:null,t:null,z:null}),z=e=>e?o(`sample.menubar.clicked-output`,{value:e.Text}):``,B=f(()=>({Simple:z(R.o),Keyboard:z(R.t),Submenus:z(R.z)})),V=e=>{let t=String(e?.Name??``).slice(0,1);Object.prototype.hasOwnProperty.call(R,t)&&(R[t]=e)},H=e=>e.split(/^--- xaml\s*\r?\n/m)[1]?.trim()??``,U=H(O),W=H(k),G=H(A);n(p,{Labels:F,FavoriteLabel:I,FavoriteGlyph:L,isFavoriteState:h,pageTheme:j,toggleTheme:M,toggleFavorite:N,Outputs:B,OnElementClicked:V,SimpleXaml:U,KeyboardXaml:W,SubmenusXaml:G});let K={t:o,currentPage:s,isFavoriteState:h,pageTheme:j,toggleTheme:M,toggleFavorite:N,Names:P,Labels:F,FavoriteLabel:I,FavoriteGlyph:L,SelectedItems:R,selectedOutput:z,Outputs:B,OnElementClicked:V,sampleXaml:H,SimpleXaml:U,KeyboardXaml:W,SubmenusXaml:G,computed:f,inject:l,provide:n,shallowReactive:r,Button:g,ControlExample:E,FontIcon:a,MenuBar:C,MenuBarItem:w,get KeyboardAccelerator(){return S},get MenuFlyoutItem(){return x},get MenuFlyoutSeparator(){return v},get MenuFlyoutSubItem(){return b},get RadioMenuFlyoutItem(){return y},Page:t,ScrollViewer:m,StackPanel:_,TextBlock:u,ToggleButton:T,get useI18n(){return c},get xamlNameScopeKey(){return d},get xamlScopeKey(){return p},get createPageState(){return D},get simpleSample(){return O},get keyboardSample(){return k},get submenusSample(){return A}};return Object.defineProperty(K,"__isScriptSetup",{enumerable:!1,value:!0}),K}};function M(t,n,r,i,a,c){return h(),o(i.Page,null,{default:e(()=>[s(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[s(i.StackPanel,{class:`gallery-item-page`},{default:e(()=>[s(i.StackPanel,{class:`page-heading`},{default:e(()=>[s(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),s(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),s(i.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:e(()=>[s(i.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[s(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),s(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[s(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),s(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[s(i.ControlExample,{SampleDefinition:`MenuBar\\SimpleMenubar.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{class:`menubar-example-stack`},{default:e(()=>[s(i.TextBlock,{"x:Name":`SelectedOptionText`,class:`menubar-output`,Text:`{x:Bind Outputs.Simple, Mode=OneWay}`,TextWrapping:`Wrap`}),s(i.MenuBar,{"x:Name":`Example1`},{default:e(()=>[s(i.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`o1`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o2`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`o5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`o8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`o9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample,{SampleDefinition:`MenuBar\\MenubarKeyboardAccelerators.txt`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{class:`menubar-example-stack`},{default:e(()=>[s(i.TextBlock,{"x:Name":`SelectedOptionText1`,class:`menubar-output`,Text:`{x:Bind Outputs.Keyboard, Mode=OneWay}`,TextWrapping:`Wrap`}),s(i.MenuBar,{"x:Name":`Example2`},{default:e(()=>[s(i.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`t2`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`N`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t1`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`O`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`E`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`t5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`Z`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`X`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`t8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`V`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`t9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`},{default:e(()=>[s(i.MenuFlyoutItem.KeyboardAccelerators,null,{default:e(()=>[s(i.KeyboardAccelerator,{Key:`I`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),s(i.ControlExample,{SampleDefinition:`MenuBar\\MenubarSubmenusSeparatorsRadio.txt`,HeaderText:`{x:Bind Labels.SubmenusHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SubmenusXaml}`},{default:e(()=>[s(i.ControlExample.Example,null,{default:e(()=>[s(i.StackPanel,{class:`menubar-example-stack`},{default:e(()=>[s(i.TextBlock,{"x:Name":`SelectedOptionText2`,class:`menubar-output`,Text:`{x:Bind Outputs.Submenus, Mode=OneWay}`,TextWrapping:`Wrap`}),s(i.MenuBar,{"x:Name":`Example3`},{default:e(()=>[s(i.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutSubItem,{"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`z1`,"x:Uid":`MenuBarSample_PlainText`,Text:`{x:Bind Labels.PlainText, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z2`,"x:Uid":`MenuBarSample_RichText`,Text:`{x:Bind Labels.RichText, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z3`,"x:Uid":`MenuBarSample_OtherFormats`,Text:`{x:Bind Labels.OtherFormats, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),s(i.MenuFlyoutItem,{"x:Name":`z4`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z5`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutSeparator),s(i.MenuFlyoutItem,{"x:Name":`z6`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`z7`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z8`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z9`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutItem,{"x:Name":`z11`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_View`,Title:`{x:Bind Labels.View, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`z12`,"x:Uid":`MenuBarSample_Output`,Text:`{x:Bind Labels.Output, Mode=OneWay}`,Click:`OnElementClicked`}),s(i.MenuFlyoutSeparator),s(i.RadioMenuFlyoutItem,{"x:Name":`z13`,"x:Uid":`MenuBarSample_Landscape`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`}),s(i.RadioMenuFlyoutItem,{"x:Name":`z14`,"x:Uid":`MenuBarSample_Portrait`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`,IsChecked:`True`}),s(i.MenuFlyoutSeparator),s(i.RadioMenuFlyoutItem,{"x:Name":`z15`,"x:Uid":`MenuBarSample_SmallIcons`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`}),s(i.RadioMenuFlyoutItem,{"x:Name":`z16`,"x:Uid":`MenuBarSample_MediumIcons`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`,IsChecked:`True`}),s(i.RadioMenuFlyoutItem,{"x:Name":`z17`,"x:Uid":`MenuBarSample_LargeIcons`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`})]),_:1}),s(i.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:e(()=>[s(i.MenuFlyoutItem,{"x:Name":`z18`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var N=i(j,[[`render`,M],[`__scopeId`,`data-v-91ff16f4`],[`__file`,`MenuBarPage.vue`]]);export{N as default};