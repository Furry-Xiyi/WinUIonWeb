import{Di as e,Ei as t,I as n,Ki as r,Li as i,Wt as a,_i as o,a as s,ai as c,cr as l,et as u,o as d,pi as f,si as p,sr as m,t as h}from"./ScrollViewer-BWDA_C78.js";import{t as g}from"./Button-BNDPNdYJ.js";import{t as _}from"./StackPanel-sg_Bd5oB.js";import{c as v,d as y,l as b,n as x,t as S}from"./MenuFlyoutItems-RkThyUiU.js";import{n as C,t as w}from"./MenuBarItem-0-DN4vVS.js";import{t as T}from"./ToggleButton-HP5wmrvH.js";import{t as E}from"./ControlExample-CzGyf8u0.js";import{t as D}from"./pageState-CcJibQcm.js";var O=`--- header
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
`,j={__name:`MenuBarPage`,setup(t,{expose:i}){i();let{t:a}=u(),f=o(`currentPage`),{isFavoriteState:p,pageTheme:j,toggleTheme:M,toggleFavorite:N}=D(f?.value||`menubar`),P=r({});e(m,P);let F=c(()=>({Title:a(`text.menubar`),Description:a(`text.the-menubar-simplifies-the-creation-of-basic-men`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SimpleHeader:a(`text.a-simple-menubar`),KeyboardHeader:a(`sample.menubar.keyboard`),SubmenusHeader:a(`sample.menubar.submenus`),File:a(`MenuBarSample_File.Title`),Edit:a(`MenuBarSample_Edit.Title`),View:a(`MenuBarSample_View.Title`),Help:a(`MenuBarSample_Help.Title`),New:a(`MenuBarSample_New.Text`),Open:a(`MenuBarSample_Open.Text`),Save:a(`MenuBarSample_Save.Text`),Exit:a(`MenuBarSample_Exit.Text`),Undo:a(`MenuBarSample_Undo.Text`),Cut:a(`MenuBarSample_Cut.Text`),Copy:a(`MenuBarSample_Copy.Text`),Paste:a(`MenuBarSample_Paste.Text`),About:a(`MenuBarSample_About.Text`),PlainText:a(`MenuBarSample_PlainText.Text`),RichText:a(`MenuBarSample_RichText.Text`),OtherFormats:a(`MenuBarSample_OtherFormats.Text`),Output:a(`MenuBarSample_Output.Text`),Landscape:a(`MenuBarSample_Landscape.Text`),Portrait:a(`MenuBarSample_Portrait.Text`),SmallIcons:a(`MenuBarSample_SmallIcons.Text`),MediumIcons:a(`MenuBarSample_MediumIcons.Text`),LargeIcons:a(`MenuBarSample_LargeIcons.Text`)})),I=c(()=>a(p.value?`gallery.remove-favorite`:`gallery.add-favorite`)),L=c(()=>p.value?``:``),R=r({o:null,t:null,z:null}),z=e=>e?a(`sample.menubar.clicked-output`,{value:e.Text}):``,B=c(()=>({Simple:z(R.o),Keyboard:z(R.t),Submenus:z(R.z)})),V=e=>{let t=String(e?.Name??``).slice(0,1);Object.prototype.hasOwnProperty.call(R,t)&&(R[t]=e)},H=e=>e.split(/^--- xaml\s*\r?\n/m)[1]?.trim()??``,U=H(O),W=H(k),G=H(A);e(l,{Labels:F,FavoriteLabel:I,FavoriteGlyph:L,isFavoriteState:p,pageTheme:j,toggleTheme:M,toggleFavorite:N,Outputs:B,OnElementClicked:V,SimpleXaml:U,KeyboardXaml:W,SubmenusXaml:G});let K={t:a,currentPage:f,isFavoriteState:p,pageTheme:j,toggleTheme:M,toggleFavorite:N,Names:P,Labels:F,FavoriteLabel:I,FavoriteGlyph:L,SelectedItems:R,selectedOutput:z,Outputs:B,OnElementClicked:V,sampleXaml:H,SimpleXaml:U,KeyboardXaml:W,SubmenusXaml:G,computed:c,inject:o,provide:e,shallowReactive:r,Button:g,ControlExample:E,FontIcon:s,MenuBar:C,MenuBarItem:w,get KeyboardAccelerator(){return S},get MenuFlyoutItem(){return x},get MenuFlyoutSeparator(){return v},get MenuFlyoutSubItem(){return b},get RadioMenuFlyoutItem(){return y},Page:n,ScrollViewer:h,StackPanel:_,TextBlock:d,ToggleButton:T,get useI18n(){return u},get xamlNameScopeKey(){return m},get xamlScopeKey(){return l},get createPageState(){return D},get simpleSample(){return O},get keyboardSample(){return k},get submenusSample(){return A}};return Object.defineProperty(K,"__isScriptSetup",{enumerable:!1,value:!0}),K}};function M(e,n,r,a,o,s){return t(),p(a.Page,null,{default:i(()=>[f(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[f(a.StackPanel,{class:`gallery-item-page`},{default:i(()=>[f(a.StackPanel,{class:`page-heading`},{default:i(()=>[f(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.Title, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,TextWrapping:`Wrap`}),f(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),f(a.StackPanel,{class:`page-header-actions`,Orientation:`Horizontal`,Spacing:`4`},{default:i(()=>[f(a.Button,{class:`header-action`,Click:`toggleTheme`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:i(()=>[f(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),f(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:i(()=>[f(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})]),_:1})]),_:1}),f(a.StackPanel,{class:`gallery-page-content`},{default:i(()=>[f(a.ControlExample,{SampleDefinition:`MenuBar\\SimpleMenubar.txt`,HeaderText:`{x:Bind Labels.SimpleHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SimpleXaml}`},{default:i(()=>[f(a.ControlExample.Example,null,{default:i(()=>[f(a.StackPanel,{class:`menubar-example-stack`},{default:i(()=>[f(a.TextBlock,{"x:Name":`SelectedOptionText`,class:`menubar-output`,Text:`{x:Bind Outputs.Simple, Mode=OneWay}`,TextWrapping:`Wrap`}),f(a.MenuBar,{"x:Name":`Example1`},{default:i(()=>[f(a.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`o1`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o2`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`o5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`o8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`o9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(a.ControlExample,{SampleDefinition:`MenuBar\\MenubarKeyboardAccelerators.txt`,HeaderText:`{x:Bind Labels.KeyboardHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind KeyboardXaml}`},{default:i(()=>[f(a.ControlExample.Example,null,{default:i(()=>[f(a.StackPanel,{class:`menubar-example-stack`},{default:i(()=>[f(a.TextBlock,{"x:Name":`SelectedOptionText1`,class:`menubar-output`,Text:`{x:Bind Outputs.Keyboard, Mode=OneWay}`,TextWrapping:`Wrap`}),f(a.MenuBar,{"x:Name":`Example2`},{default:i(()=>[f(a.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`t2`,"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`N`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t1`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`O`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t3`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`S`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t4`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`E`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`t5`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`Z`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t6`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`X`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t7`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`C`,Modifiers:`Control`})]),_:1})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`t8`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`V`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`t9`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`},{default:i(()=>[f(a.MenuFlyoutItem.KeyboardAccelerators,null,{default:i(()=>[f(a.KeyboardAccelerator,{Key:`I`,Modifiers:`Control`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),f(a.ControlExample,{SampleDefinition:`MenuBar\\MenubarSubmenusSeparatorsRadio.txt`,HeaderText:`{x:Bind Labels.SubmenusHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind SubmenusXaml}`},{default:i(()=>[f(a.ControlExample.Example,null,{default:i(()=>[f(a.StackPanel,{class:`menubar-example-stack`},{default:i(()=>[f(a.TextBlock,{"x:Name":`SelectedOptionText2`,class:`menubar-output`,Text:`{x:Bind Outputs.Submenus, Mode=OneWay}`,TextWrapping:`Wrap`}),f(a.MenuBar,{"x:Name":`Example3`},{default:i(()=>[f(a.MenuBarItem,{"x:Uid":`MenuBarSample_File`,Title:`{x:Bind Labels.File, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutSubItem,{"x:Uid":`MenuBarSample_New`,Text:`{x:Bind Labels.New, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`z1`,"x:Uid":`MenuBarSample_PlainText`,Text:`{x:Bind Labels.PlainText, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z2`,"x:Uid":`MenuBarSample_RichText`,Text:`{x:Bind Labels.RichText, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z3`,"x:Uid":`MenuBarSample_OtherFormats`,Text:`{x:Bind Labels.OtherFormats, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),f(a.MenuFlyoutItem,{"x:Name":`z4`,"x:Uid":`MenuBarSample_Open`,Text:`{x:Bind Labels.Open, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z5`,"x:Uid":`MenuBarSample_Save`,Text:`{x:Bind Labels.Save, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutSeparator),f(a.MenuFlyoutItem,{"x:Name":`z6`,"x:Uid":`MenuBarSample_Exit`,Text:`{x:Bind Labels.Exit, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Edit`,Title:`{x:Bind Labels.Edit, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`z7`,"x:Uid":`MenuBarSample_Undo`,Text:`{x:Bind Labels.Undo, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z8`,"x:Uid":`MenuBarSample_Cut`,Text:`{x:Bind Labels.Cut, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z9`,"x:Uid":`MenuBarSample_Copy`,Text:`{x:Bind Labels.Copy, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutItem,{"x:Name":`z11`,"x:Uid":`MenuBarSample_Paste`,Text:`{x:Bind Labels.Paste, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_View`,Title:`{x:Bind Labels.View, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`z12`,"x:Uid":`MenuBarSample_Output`,Text:`{x:Bind Labels.Output, Mode=OneWay}`,Click:`OnElementClicked`}),f(a.MenuFlyoutSeparator),f(a.RadioMenuFlyoutItem,{"x:Name":`z13`,"x:Uid":`MenuBarSample_Landscape`,Text:`{x:Bind Labels.Landscape, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`}),f(a.RadioMenuFlyoutItem,{"x:Name":`z14`,"x:Uid":`MenuBarSample_Portrait`,Text:`{x:Bind Labels.Portrait, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`OrientationGroup`,IsChecked:`True`}),f(a.MenuFlyoutSeparator),f(a.RadioMenuFlyoutItem,{"x:Name":`z15`,"x:Uid":`MenuBarSample_SmallIcons`,Text:`{x:Bind Labels.SmallIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`}),f(a.RadioMenuFlyoutItem,{"x:Name":`z16`,"x:Uid":`MenuBarSample_MediumIcons`,Text:`{x:Bind Labels.MediumIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`,IsChecked:`True`}),f(a.RadioMenuFlyoutItem,{"x:Name":`z17`,"x:Uid":`MenuBarSample_LargeIcons`,Text:`{x:Bind Labels.LargeIcons, Mode=OneWay}`,Click:`OnElementClicked`,GroupName:`SizeGroup`})]),_:1}),f(a.MenuBarItem,{"x:Uid":`MenuBarSample_Help`,Title:`{x:Bind Labels.Help, Mode=OneWay}`},{default:i(()=>[f(a.MenuFlyoutItem,{"x:Name":`z18`,"x:Uid":`MenuBarSample_About`,Text:`{x:Bind Labels.About, Mode=OneWay}`,Click:`OnElementClicked`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var N=a(j,[[`render`,M],[`__scopeId`,`data-v-91ff16f4`],[`__file`,`MenuBarPage.vue`]]);export{N as default};