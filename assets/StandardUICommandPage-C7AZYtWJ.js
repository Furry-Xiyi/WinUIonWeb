import{A as e,C as t,D as n,E as r,H as i,K as a,N as o,S as s,X as c,g as l,h as u,k as d,l as f,m as p,n as m,t as h}from"./WinScrollViewer-DPrZnleG.js";import{n as g,t as _}from"./WinTextBlock-CeUskDRc.js";import{a as v,i as y,t as b}from"./i18n-DA-FIA7C.js";import{a as x,c as S,i as C,r as w}from"./index-CMPZyTwE.js";import{t as T}from"./WinControlExample-C0uhK7Jb.js";import{t as E}from"./pageState-Mr-1-Xo1.js";import{t as D}from"./WinAppBarButton-BYDM3nok.js";import{t as O}from"./WinListView-XkZgQFrK.js";import{t as k}from"./WinMenuBar-BtloTbLJ.js";import{t as A}from"./WinSwipeControl-Cp3V_LW8.js";import{t as j}from"./WinXamlUICommand-C_dzvF2y.js";var M={Cut:{Symbol:`Cut`,KeyboardAccelerators:[{Key:`X`,Modifiers:[`Control`]}]},Copy:{Symbol:`Copy`,KeyboardAccelerators:[{Key:`C`,Modifiers:[`Control`]}]},Paste:{Symbol:`Paste`,KeyboardAccelerators:[{Key:`V`,Modifiers:[`Control`]}]},SelectAll:{Symbol:`SelectAll`,KeyboardAccelerators:[{Key:`A`,Modifiers:[`Control`]}]},Delete:{Symbol:`Delete`,KeyboardAccelerators:[{Key:`Delete`}]},Share:{Symbol:`Share`,KeyboardAccelerators:[]},Save:{Symbol:`Save`,KeyboardAccelerators:[{Key:`S`,Modifiers:[`Control`]}]},Open:{Symbol:`OpenFile`,KeyboardAccelerators:[{Key:`O`,Modifiers:[`Control`]}]},Close:{Symbol:`Cancel`,KeyboardAccelerators:[{Key:`W`,Modifiers:[`Control`]}]},Pause:{Symbol:`Pause`,KeyboardAccelerators:[]},Play:{Symbol:`Play`,KeyboardAccelerators:[]},Stop:{Symbol:`Stop`,KeyboardAccelerators:[]},Forward:{Symbol:`Forward`,KeyboardAccelerators:[]},Backward:{Symbol:`Back`,KeyboardAccelerators:[]},Undo:{Symbol:`Undo`,KeyboardAccelerators:[{Key:`Z`,Modifiers:[`Control`]}]},Redo:{Symbol:`Redo`,KeyboardAccelerators:[{Key:`Y`,Modifiers:[`Control`]}]}},N=e=>{let t=y(typeof document<`u`?document.documentElement.lang:typeof navigator<`u`?navigator.language:`en-US`),n=`command.standard.${e}`;return b[t][n]??b[`en-US`][n]??e},P=class extends j{Kind;constructor(e,t={}){let n=e===`None`?void 0:M[e],r=e===`None`?void 0:N(e);super({Label:r,Description:r,IconSource:n?{Symbol:n.Symbol}:void 0,KeyboardAccelerators:n?.KeyboardAccelerators,...t}),this.Kind=e}},F={class:`gallery-item-page`},I={class:`page-heading`},L={class:`page-header-actions`},R={class:`gallery-page-content`},z=`<SwipeItem x:Name="DeleteSwipeItem" Background="Red" Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />

<AppBarButton x:Name="HoverButton" IsTabStop="False" HorizontalAlignment="Right" Visibility="Collapsed"
 Command="{x:Bind Command}" CommandParameter="{x:Bind Text}" />`,B=`private void ControlExample_Loaded(object sender, RoutedEventArgs e)
{
    var deleteCommand = new StandardUICommand(StandardUICommandKind.Delete);
    deleteCommand.ExecuteRequested += DeleteCommand_ExecuteRequested;

    DeleteFlyoutItem.Command = deleteCommand;

    for (var i = 0; i < 15; i++)
    {
        collection.Add(new ListItemData { Text = "List item " + i.ToString(), Command = deleteCommand });
    }
}

private void ListViewRight_ContainerContentChanging(ListViewBase sender, ContainerContentChangingEventArgs args)
{
    MenuFlyout flyout = new MenuFlyout();
    ListItemData data = (ListItemData)args.Item;
    MenuFlyoutItem item = new MenuFlyoutItem() { Command = data.Command };
    flyout.Items.Add(item);
    args.ItemContainer.ContextFlyout = flyout;
}`,V=m(t({__name:`StandardUICommandPage`,setup(t){let m=r(`currentPage`),{t:y}=v(),{isFavoriteState:b,pageTheme:j,toggleTheme:M,toggleFavorite:N}=E(p(()=>m?.value||`standarduicommand`).value),V=a(Array.from({length:15},(e,t)=>({Text:y(`sample.standarduicommand.list-item`,{index:t})}))),H=a([]),U=a(``),W=a(!1),G=a(),K=a(``),q,J={Height:60,Padding:0,HorizontalContentAlignment:`Stretch`,VerticalContentAlignment:`Stretch`,BorderThickness:0},Y=new P(`Delete`,{ExecuteRequested:(e,t)=>{X(t.Parameter)}}),X=e=>{let t=typeof e==`string`?e:H.value[0]?.Text;t&&(V.value=V.value.filter(e=>e.Text!==t),H.value=H.value.filter(e=>e.Text!==t),W.value=!1)},Z=e=>{V.value.some(t=>t.Text===e)&&X(e)},Q=p(()=>[{Title:y(`text.file`),Items:[{Text:y(`sample.standarduicommand.new`)},{Text:y(`sample.standarduicommand.open`)},{Text:y(`text.save`)},{Text:y(`sample.standarduicommand.exit`)}]},{Title:y(`text.edit`),Items:[{Command:Y}]},{Title:y(`text.help`),Items:[{Text:y(`text.about`)}]}]),$=p(()=>[{Command:Y,CommandParameter:K.value}]),ee=e=>({Mode:`Execute`,Items:[{Background:`Red`,Command:Y,CommandParameter:e}]}),te=(e,t)=>{let n=V.value.find(e=>e.Text===t);H.value=n?[n]:[],K.value=t,G.value=new DOMRect(e.clientX,e.clientY,1,1),W.value=!0};e(()=>{q=Y.AttachKeyboardAccelerators()}),d(()=>q?.());let ne=p(()=>`<WinStackPanel Width="100%">
  <WinTextBlock
    Text="sample.standarduicommand.description"
    Margin="0,0,0,12"
    TextWrapping="Wrap" />

  <WinMenuBar Items="menuItems" />

  <WinListView
    ItemsSource="listItems"
    ItemContainerStyle="horizontalSwipeStyle"
    IsItemClickEnabled="True"
    Height="500"
    SelectionMode="Single">
    <WinListView.ItemTemplate>
      <WinDataTemplate>
        <WinSwipeControl
          Width="100%"
          Height="60"
          RightItems="getDeleteSwipeItems(item.Text)"
          ContextRequested="OpenContextMenu"
          PointerEntered="ListItem_PointerEntered"
          PointerExited="ListItem_PointerExited">
          <WinGrid ColumnDefinitions="*,Auto" RowDefinitions="60">
            <WinTextBlock Text="item.Text" Margin="10" FontSize="18" />
            <WinAppBarButton
              Command="deleteCommand"
              CommandParameter="item.Text"
              Visibility="Collapsed"
              HorizontalAlignment="Right"
              AutomationProperties.Name="Delete"
              Click="DeleteButton_Click" />
          </WinGrid>
        </WinSwipeControl>
      </WinDataTemplate>
    </WinListView.ItemTemplate>
  </WinListView>

  <WinMenuFlyout
    Open="contextMenuOpen"
    AnchorRect="contextMenuAnchor"
    Items="contextMenuItems"
    Placement="RightEdgeAlignedTop"
    Close="ContextMenu_Closed" />
</WinStackPanel>`);return(e,t)=>(o(),l(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:i(()=>[u(`div`,F,[u(`div`,I,[s(_,{class:`page-header`,Text:e.$t(`text.standarduicommand`),role:`heading`,"aria-level":`1`},null,8,[`Text`]),s(_,{class:`page-description`,Text:e.$t(`text.standarduicommand-subtitle`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),u(`div`,L,[s(S,{class:`header-action`,onClick:c(M)},{default:i(()=>[s(_,{class:`icon`,Text:``})]),_:1},8,[`onClick`]),s(w,{class:`header-action`,IsChecked:c(b),"onUpdate:IsChecked":c(N)},{default:i(()=>[s(_,{class:`icon`,Text:c(b)?``:``},null,8,[`Text`])]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),u(`div`,R,[s(T,{class:`basic-input-example-theme`,headerText:e.$t(`sample.standarduicommand.multiple-controls`),HorizontalContentAlignment:`Stretch`,theme:c(j),vue:ne.value,xaml:z,cSharp:B},{example:i(()=>[s(C,{Width:`100%`},{default:i(()=>[s(_,{Text:e.$t(`sample.standarduicommand.description`),Margin:`0,0,0,12`,TextWrapping:`Wrap`},null,8,[`Text`]),s(k,{Items:Q.value,Theme:c(j)},null,8,[`Items`,`Theme`]),s(O,{SelectedItems:H.value,"onUpdate:SelectedItems":t[2]||=e=>H.value=e,ItemsSource:V.value,ItemContainerStyle:J,IsItemClickEnabled:!0,Height:`500`,SelectionMode:`Single`,"aria-label":e.$t(`sample.standarduicommand.items`)},{item:i(({item:e})=>[s(A,{Width:`100%`,Height:`60`,RightItems:ee(e.Text),onContextRequested:t=>te(t,e.Text),onPointerEntered:t=>U.value=e.Text,onPointerExited:t[1]||=e=>U.value=``},{default:i(()=>[s(x,{class:`standard-command-row`,ColumnDefinitions:`*,Auto`,RowDefinitions:`60`},{default:i(()=>[s(_,{class:`standard-command-text`,Text:e.Text,Margin:`10`,FontSize:`18`},null,8,[`Text`]),s(D,n({class:`standard-command-delete`,Command:c(Y),CommandParameter:e.Text,Visibility:U.value===e.Text?`Visible`:`Collapsed`,HorizontalAlignment:`Right`},{"AutomationProperties.Name":c(Y).Label},{onPointerdown:t[0]||=f(()=>{},[`stop`]),onClick:t=>Z(e.Text)}),null,16,[`Command`,`CommandParameter`,`Visibility`,`onClick`])]),_:2},1024)]),_:2},1032,[`RightItems`,`onContextRequested`,`onPointerEntered`])]),_:1},8,[`SelectedItems`,`ItemsSource`,`aria-label`]),s(g,{Open:W.value,AnchorRect:G.value,Items:$.value,Theme:c(j),Placement:`RightEdgeAlignedTop`,onClose:t[3]||=e=>W.value=!1},null,8,[`Open`,`AnchorRect`,`Items`,`Theme`])]),_:1})]),_:1},8,[`headerText`,`theme`,`vue`])])])]),_:1}))}}),[[`__scopeId`,`data-v-81ed0d77`]]);export{V as default};