import{Fi as e,Ti as t,Wi as n,Wt as r,a as i,ai as a,di as o,et as s,hi as c,ii as l,o as u,or as d,ri as f,t as p,wi as m}from"./ScrollViewer-PoO_ma9Z.js";import{t as h}from"./Button-DjU0urmJ.js";import{t as g}from"./StackPanel-CT7pl8zy.js";import{t as _}from"./RadioButton-CjvDOFgw.js";import{t as v}from"./PersonPicture-U39A_QFS.js";import{t as y}from"./RadioButtons-BVaEsh9g.js";import{t as b}from"./ToggleButton-DwmhXZge.js";import{t as x}from"./ControlExample-C1ahTZEr.js";import{t as S}from"./pageState-BN3kXI7L.js";var C=`--- header
Select different looks for the person picture.
--- xaml
<PersonPicture $(ProfilePicture)$(DisplayName)$(Initials) />`,w=`// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Imaging;
using System;

namespace WinUIGallery.ControlPages;

public sealed partial class PersonPicturePage : Page
{
    public PersonPicturePage()
    {
        this.InitializeComponent();
    }

    private void RadioButtons_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ProfileImageRadio.IsChecked == true)
        {
            personPicture.ProfilePicture = new BitmapImage(new Uri("https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png"));
            personPicture.DisplayName = null;
            personPicture.Initials = null;
        }
        else if (DisplayNameRadio.IsChecked == true)
        {
            personPicture.ProfilePicture = null;
            personPicture.DisplayName = "Jane Doe";
            personPicture.Initials = null;
        }
        else if (InitialsRadio.IsChecked == true)
        {
            personPicture.ProfilePicture = null;
            personPicture.DisplayName = null;
            personPicture.Initials = "SB";
        }
    }
}
`,T=`https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png`,E={__name:`PersonPicturePage`,setup(e,{expose:r}){r();let{t:a}=s(),o=c(`currentPage`),l=f(()=>o?.value||`personpicture`),{isFavoriteState:m,pageTheme:E,toggleTheme:D,toggleFavorite:O}=S(l.value),k=n({});t(d,k);let A=f(()=>({PageTitle:a(`text.personpicture`),Description:a(`text.personpicture-description`),ToggleTheme:a(`gallery.page-header.toggle-theme`),SelectLooks:a(`sample.personpicture.select-looks`),ProfileType:a(`sample.personpicture.profile-type`),ProfileImage:a(`sample.personpicture.profile-image`),DisplayName:a(`sample.personpicture.display-name`),Initials:a(`sample.personpicture.initials`)})),j=f(()=>a(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=f(()=>m.value?``:``),N=()=>{let e=k.personPicture;e&&(k.ProfileImageRadio?.IsChecked===!0?(e.ProfilePicture={UriSource:T},e.DisplayName=null,e.Initials=null):k.DisplayNameRadio?.IsChecked===!0?(e.ProfilePicture=null,e.DisplayName=a(`sample.personpicture.person-name`),e.Initials=null):k.InitialsRadio?.IsChecked===!0&&(e.ProfilePicture=null,e.DisplayName=null,e.Initials=a(`sample.personpicture.person-initials`)))},P=f(()=>{let e=k.personPicture;if(!e)return``;let t={width:e.ActualWidth,height:e.ActualHeight};return e.ProfilePicture?a(`sample.personpicture.output.image`,t):a(`sample.personpicture.output.initials`,{...t,name:e.DisplayName||e.Initials,initials:e.TemplateSettings.ActualInitials})}),F=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`),I={t:a,currentPage:o,pageKey:l,isFavoriteState:m,pageTheme:E,toggleTheme:D,toggleFavorite:O,Names:k,ProfileImageUri:T,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,RadioButtons_SelectionChanged:N,PictureOutput:P,escapeAttribute:F,PersonPictureXaml:f(()=>{let e=k.personPicture,t={ProfilePicture:e?.ProfilePicture?`ProfilePicture="${T}"`:``,DisplayName:e?.DisplayName?`DisplayName="${F(e.DisplayName)}"`:``,Initials:e?.Initials?`Initials="${F(e.Initials)}"`:``};return C.split(`--- xaml`)[1].trim().replace(/\$\((\w+)\)/g,(e,n)=>t[n]||``)}),computed:f,inject:c,provide:t,shallowReactive:n,Button:h,ControlExample:x,FontIcon:i,PersonPicture:v,RadioButton:_,RadioButtons:y,ScrollViewer:p,StackPanel:g,TextBlock:u,ToggleButton:b,get useI18n(){return s},get xamlNameScopeKey(){return d},get createPageState(){return S},get sampleDefinition(){return C},get PersonPictureCSharp(){return w}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(t,n,r,i,s,c){return m(),a(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:e(()=>[l(`div`,D,[l(`div`,O,[o(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),o(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),l(`div`,k,[o(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:e(()=>[o(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),o(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:e(()=>[o(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),o(i.StackPanel,{class:`gallery-page-content`},{default:e(()=>[o(i.ControlExample,{"x:Name":`Example1`,class:`person-picture-example`,SampleDefinition:`PersonPicture\\PersonPictureSelectDifferentLooksPerson.txt`,HeaderText:`{x:Bind Labels.SelectLooks, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind PersonPictureXaml, Mode=OneWay}`,CSharp:`{x:Bind PersonPictureCSharp, Mode=OneWay}`},{default:e(()=>[o(i.ControlExample.Example,null,{default:e(()=>[o(i.PersonPicture,{"x:Name":`personPicture`,Height:`300`,VerticalAlignment:`Top`})]),_:1}),o(i.ControlExample.Output,null,{default:e(()=>[o(i.TextBlock,{Text:`{x:Bind PictureOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),o(i.ControlExample.Options,null,{default:e(()=>[o(i.RadioButtons,{"x:Name":`ProfileType`,SelectedIndex:`0`,Header:`{x:Bind Labels.ProfileType, Mode=OneWay}`,SelectionChanged:`RadioButtons_SelectionChanged`},{default:e(()=>[o(i.RadioButton,{"x:Name":`ProfileImageRadio`,Content:`{x:Bind Labels.ProfileImage, Mode=OneWay}`,IsChecked:`True`}),o(i.RadioButton,{"x:Name":`DisplayNameRadio`,Content:`{x:Bind Labels.DisplayName, Mode=OneWay}`}),o(i.RadioButton,{"x:Name":`InitialsRadio`,Content:`{x:Bind Labels.Initials, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=r(E,[[`render`,A],[`__scopeId`,`data-v-f3da58e1`],[`__file`,`PersonPicturePage.vue`]]);export{j as default};