import{$ as e,E as t,H as n,K as r,N as i,S as a,V as o,X as s,g as c,h as l,m as u,n as ee,t as d}from"./WinScrollViewer-DPrZnleG.js";import{t as f}from"./WinTextBlock-CeUskDRc.js";import{a as p,c as m,r as h}from"./index-CMPZyTwE.js";import{t as g}from"./WinControlExample-C0uhK7Jb.js";import{t as te}from"./WinComboBox-D5zM9OdY.js";import{t as ne}from"./pageState-Mr-1-Xo1.js";import{t as re}from"./WinToggleSwitch-qMvlK4se.js";import{t as _}from"./WinListView-XkZgQFrK.js";var ie={class:`gallery-item-page`},v={class:`page-heading`},y={class:`page-header-actions`},b={class:`icon`},x={class:`gallery-page-content`},S={class:`sample-stack`},C={class:`listview-demo-scroll narrow`},ae={class:`sample-stack`},oe={class:`listview-demo-scroll`},se={class:`contact-template`},w={class:`contact-text`},T={class:`sample-stack`},E={class:`sample-stack`},D={class:`listview-demo-scroll`},O={class:`contact-template`},k={class:`contact-text`},A=`<WinListView ItemsSource="contacts" SelectionMode="Single">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`,j=`<WinListView ItemsSource="contacts" SelectionMode="selectionMode" SelectedItems="selectionSelected">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`,M=`<WinGrid ColumnDefinitions="*,*" ColumnSpacing="12">
  <WinListView
    ItemsSource="dragListLeft"
    Height="400"
    MinWidth="350"
    Margin="12"
    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
    BorderThickness="1"
    SelectionMode="Single"
    CanDragItems="True"
    CanReorderItems="True"
    AllowDrop="True"
    DragItemsStarting="ListView_DragItemsStarting"
    DragItemsCompleted="ListView_DragItemsCompleted"
    Drop="ListView_Drop" />

  <WinListView
    ItemsSource="dragListRight"
    Height="400"
    MinWidth="350"
    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
    BorderThickness="1"
    SelectionMode="Single"
    CanDragItems="True"
    CanReorderItems="True"
    AllowDrop="True"
    DragItemsStarting="ListView_DragItemsStarting"
    DragItemsCompleted="ListView_DragItemsCompleted"
    Drop="ListView_Drop" />
</WinGrid>`,N=`<WinListView ItemsSource="groups" IsGrouped="True" AreStickyGroupHeadersEnabled="stickyOn" SelectionMode="Single">
  <WinListView.GroupHeaderTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="group.Key" />
    </WinDataTemplate>
  </WinListView.GroupHeaderTemplate>
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`,P=ee({__name:`ListViewPage`,setup(ee){let P=t(`currentPage`),{isFavoriteState:F,pageTheme:I,toggleTheme:L,toggleFavorite:R}=ne(u(()=>P?.value||`listview`).value),z=[`None`,`Single`,`Multiple`,`Extended`],B=r(1),V=u(()=>z[B.value]),H=r(!1),U=[{FirstName:`Adam`,LastName:`Smith`,Company:`Microsoft`,Name:`Adam Smith`},{FirstName:`Bill`,LastName:`Gates`,Company:`TerraPower`,Name:`Bill Gates`},{FirstName:`Clara`,LastName:`Oswald`,Company:`UNIT`,Name:`Clara Oswald`},{FirstName:`David`,LastName:`Chen`,Company:`Apple`,Name:`David Chen`},{FirstName:`Eve`,LastName:`Torres`,Company:`Google`,Name:`Eve Torres`},{FirstName:`Frank`,LastName:`Wright`,Company:`Adobe`,Name:`Frank Wright`},{FirstName:`Grace`,LastName:`Hopper`,Company:`Navy`,Name:`Grace Hopper`},{FirstName:`Henry`,LastName:`Ford`,Company:`Ford`,Name:`Henry Ford`}],W=[{Key:`A`,Items:U.filter(e=>e.LastName.startsWith(`S`))},{Key:`B`,Items:U.filter(e=>e.LastName.startsWith(`G`))},{Key:`C`,Items:U.filter(e=>e.LastName.startsWith(`O`)||e.LastName.startsWith(`C`))},{Key:`D`,Items:U.filter(e=>e.LastName.startsWith(`T`)||e.LastName.startsWith(`W`))},{Key:`F`,Items:U.filter(e=>e.LastName.startsWith(`F`)||e.LastName.startsWith(`H`))}].filter(e=>e.Items.length>0),G=r(U.slice(0,4)),K=r(U.slice(4)),q=r([]),J=r([]),Y=r([]),X=r([]),Z=r(null),Q=(e,t)=>{Z.value={Source:t,Items:e.Items}},$=(e,t)=>{let n=Z.value;if(!n||n.Source===t)return;let r=n.Source===`Left`?G:K,i=t===`Left`?G:K,a=Math.max(0,Math.min(e.InsertIndex,i.value.length)),o=n.Items.filter(e=>r.value.includes(e));r.value=r.value.filter(e=>!o.includes(e)),i.value=[...i.value.slice(0,a),...o,...i.value.slice(a)],Y.value=Y.value.filter(e=>!o.includes(e)),X.value=X.value.filter(e=>!o.includes(e)),Z.value=null};return o(V,()=>{q.value=[]}),(t,r)=>(i(),c(d,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[l(`div`,ie,[l(`div`,v,[a(f,{class:`page-header`,Text:t.$t(`text.listview`)},null,8,[`Text`]),a(f,{class:`page-description`,Text:t.$t(`text.a-listview-displays-data-in-a-vertical-list-with`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,y,[a(m,{class:`header-action`,onClick:s(L)},{default:n(()=>[...r[14]||=[l(`span`,{class:`icon`},``,-1)]]),_:1},8,[`onClick`]),a(h,{IsChecked:s(F),class:`header-action`,"onUpdate:IsChecked":s(R)},{default:n(()=>[l(`span`,b,e(s(F)?``:``),1)]),_:1},8,[`IsChecked`,`onUpdate:IsChecked`])])]),l(`div`,x,[a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.listview.basic-simple-datatemplate`),theme:s(I),vue:A},{example:n(()=>[l(`div`,S,[a(f,{Text:t.$t(`sample.listview.basic-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,C,[a(_,{ItemsSource:U,SelectionMode:`Single`},{item:n(({item:e})=>[a(f,{Text:e.Name,Margin:`0,5`},null,8,[`Text`])]),_:1})])])]),_:1},8,[`headerText`,`theme`]),a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.listview.selection-support`),theme:s(I),vue:j},{example:n(()=>[l(`div`,ae,[a(f,{Text:t.$t(`sample.listview.selection-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,oe,[a(_,{ItemsSource:U,SelectionMode:V.value,SelectedItems:q.value,"onUpdate:SelectedItems":r[0]||=e=>q.value=e},{item:n(({item:e})=>[l(`div`,se,[r[15]||=l(`div`,{class:`contact-avatar`},null,-1),l(`div`,w,[a(f,{class:`contact-name`,Text:e.Name},null,8,[`Text`]),a(f,{class:`caption-text`,Text:e.Company},null,8,[`Text`])])])]),_:1},8,[`SelectionMode`,`SelectedItems`])])])]),options:n(()=>[a(te,{Header:`SelectionMode`,ItemsSource:z,SelectedIndex:B.value,"onUpdate:SelectedIndex":r[1]||=e=>B.value=e},null,8,[`SelectedIndex`])]),_:1},8,[`headerText`,`theme`]),a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.listview.drag-drop-reordering`),theme:s(I),vue:M},{example:n(()=>[l(`div`,T,[a(f,{Text:t.$t(`sample.listview.drag-drop-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),a(p,{class:`drag-list-grid`,ColumnDefinitions:`*,*`,ColumnSpacing:`12`},{default:n(()=>[a(_,{ItemsSource:G.value,"onUpdate:ItemsSource":r[2]||=e=>G.value=e,SelectedItems:Y.value,"onUpdate:SelectedItems":r[3]||=e=>Y.value=e,Height:`400`,MinWidth:`350`,Margin:`12`,BorderBrush:`var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke))`,BorderThickness:`1`,SelectionMode:`Single`,CanDragItems:``,CanReorderItems:``,AllowDrop:``,onDragItemsStarting:r[4]||=e=>Q(e,`Left`),onDragItemsCompleted:r[5]||=e=>Z.value=null,onDrop:r[6]||=e=>$(e,`Left`)},{item:n(({item:e})=>[a(f,{Text:e.Name},null,8,[`Text`])]),_:1},8,[`ItemsSource`,`SelectedItems`]),a(_,{ItemsSource:K.value,"onUpdate:ItemsSource":r[7]||=e=>K.value=e,SelectedItems:X.value,"onUpdate:SelectedItems":r[8]||=e=>X.value=e,Height:`400`,MinWidth:`350`,BorderBrush:`var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke))`,BorderThickness:`1`,SelectionMode:`Single`,CanDragItems:``,CanReorderItems:``,AllowDrop:``,onDragItemsStarting:r[9]||=e=>Q(e,`Right`),onDragItemsCompleted:r[10]||=e=>Z.value=null,onDrop:r[11]||=e=>$(e,`Right`)},{item:n(({item:e})=>[a(f,{Text:e.Name},null,8,[`Text`])]),_:1},8,[`ItemsSource`,`SelectedItems`])]),_:1})])]),_:1},8,[`headerText`,`theme`]),a(g,{class:`basic-input-example-theme`,headerText:t.$t(`sample.listview.grouped-headers`),theme:s(I),vue:N},{example:n(()=>[l(`div`,E,[a(f,{Text:t.$t(`sample.listview.grouped-note`),TextWrapping:`WrapWholeWords`},null,8,[`Text`]),l(`div`,D,[a(_,{ItemsSource:s(W),IsGrouped:``,AreStickyGroupHeadersEnabled:H.value,SelectionMode:`Single`,SelectedItems:J.value,"onUpdate:SelectedItems":r[12]||=e=>J.value=e},{header:n(({group:e})=>[a(f,{class:`group-header`,Text:e.Key},null,8,[`Text`])]),item:n(({item:e})=>[l(`div`,O,[r[16]||=l(`div`,{class:`contact-avatar`},null,-1),l(`div`,k,[a(f,{class:`contact-name`,Text:e.Name},null,8,[`Text`]),a(f,{class:`caption-text`,Text:e.Company},null,8,[`Text`])])])]),_:1},8,[`ItemsSource`,`AreStickyGroupHeadersEnabled`,`SelectedItems`])])])]),options:n(()=>[a(re,{Header:t.$t(`sample.sticky-headers`),IsOn:H.value,"onUpdate:IsOn":r[13]||=e=>H.value=e},null,8,[`Header`,`IsOn`])]),_:1},8,[`headerText`,`theme`])])])]),_:1}))}},[[`__scopeId`,`data-v-0dee64ef`]]);export{P as default};