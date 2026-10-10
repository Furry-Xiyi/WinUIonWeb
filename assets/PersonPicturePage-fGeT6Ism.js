import{Ai as e,Bi as t,Mn as n,Yi as r,a as i,bi as a,ci as o,dr as s,gi as c,ki as l,li as u,o as d,p as f,t as p,ui as m}from"./ScrollViewer-CHNE18MA.js";import{t as h}from"./Button-DO0TiUOq.js";import{t as g}from"./StackPanel-C60XOD66.js";import{t as _}from"./ToggleButton-ZsjZg8Nu.js";import{t as v}from"./RadioButton-CQiKAPg3.js";import{t as y}from"./RadioButtons-D2M7r5B8.js";import{t as b}from"./PersonPicture-B1tfbbWi.js";import{t as x}from"./ControlExample-BKyw2NwY.js";import{t as S}from"./pageState-Djrh7EdY.js";var C=`--- header
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
`,T=`https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png`,E={__name:`PersonPicturePage`,setup(t,{expose:n}){n();let{t:c}=f(),l=a(`currentPage`),u=o(()=>l?.value||`personpicture`),{isFavoriteState:m,pageTheme:E,toggleTheme:D,toggleFavorite:O}=S(u.value),k=r({});e(s,k);let A=o(()=>({PageTitle:c(`text.personpicture`),Description:c(`text.personpicture-description`),ToggleTheme:c(`gallery.page-header.toggle-theme`),SelectLooks:c(`sample.personpicture.select-looks`),ProfileType:c(`sample.personpicture.profile-type`),ProfileImage:c(`sample.personpicture.profile-image`),DisplayName:c(`sample.personpicture.display-name`),Initials:c(`sample.personpicture.initials`)})),j=o(()=>c(m.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=o(()=>m.value?``:``),N=()=>{let e=k.personPicture;e&&(k.ProfileImageRadio?.IsChecked===!0?(e.ProfilePicture={UriSource:T},e.DisplayName=null,e.Initials=null):k.DisplayNameRadio?.IsChecked===!0?(e.ProfilePicture=null,e.DisplayName=c(`sample.personpicture.person-name`),e.Initials=null):k.InitialsRadio?.IsChecked===!0&&(e.ProfilePicture=null,e.DisplayName=null,e.Initials=c(`sample.personpicture.person-initials`)))},P=o(()=>{let e=k.personPicture;if(!e)return``;let t={width:e.ActualWidth,height:e.ActualHeight};return e.ProfilePicture?c(`sample.personpicture.output.image`,t):c(`sample.personpicture.output.initials`,{...t,name:e.DisplayName||e.Initials,initials:e.TemplateSettings.ActualInitials})}),F=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`),I={t:c,currentPage:l,pageKey:u,isFavoriteState:m,pageTheme:E,toggleTheme:D,toggleFavorite:O,Names:k,ProfileImageUri:T,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,RadioButtons_SelectionChanged:N,PictureOutput:P,escapeAttribute:F,PersonPictureXaml:o(()=>{let e=k.personPicture,t={ProfilePicture:e?.ProfilePicture?`ProfilePicture="${T}"`:``,DisplayName:e?.DisplayName?`DisplayName="${F(e.DisplayName)}"`:``,Initials:e?.Initials?`Initials="${F(e.Initials)}"`:``};return C.split(`--- xaml`)[1].trim().replace(/\$\((\w+)\)/g,(e,n)=>t[n]||``)}),computed:o,inject:a,provide:e,shallowReactive:r,Button:h,ControlExample:x,FontIcon:i,PersonPicture:b,RadioButton:v,RadioButtons:y,ScrollViewer:p,StackPanel:g,TextBlock:d,ToggleButton:_,get useI18n(){return f},get xamlNameScopeKey(){return s},get createPageState(){return S},get sampleDefinition(){return C},get PersonPictureCSharp(){return w}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(e,n,r,i,a,o){return l(),m(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(`div`,D,[u(`div`,O,[c(i.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),c(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(`div`,k,[c(i.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:t(()=>[c(i.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),c(i.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:t(()=>[c(i.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),c(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[c(i.ControlExample,{"x:Name":`Example1`,class:`person-picture-example`,SampleDefinition:`PersonPicture\\PersonPictureSelectDifferentLooksPerson.txt`,HeaderText:`{x:Bind Labels.SelectLooks, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind PersonPictureXaml, Mode=OneWay}`,CSharp:`{x:Bind PersonPictureCSharp, Mode=OneWay}`},{default:t(()=>[c(i.ControlExample.Example,null,{default:t(()=>[c(i.PersonPicture,{"x:Name":`personPicture`,Height:`300`,VerticalAlignment:`Top`})]),_:1}),c(i.ControlExample.Output,null,{default:t(()=>[c(i.TextBlock,{Text:`{x:Bind PictureOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),c(i.ControlExample.Options,null,{default:t(()=>[c(i.RadioButtons,{"x:Name":`ProfileType`,SelectedIndex:`0`,Header:`{x:Bind Labels.ProfileType, Mode=OneWay}`,SelectionChanged:`RadioButtons_SelectionChanged`},{default:t(()=>[c(i.RadioButton,{"x:Name":`ProfileImageRadio`,Content:`{x:Bind Labels.ProfileImage, Mode=OneWay}`,IsChecked:`True`}),c(i.RadioButton,{"x:Name":`DisplayNameRadio`,Content:`{x:Bind Labels.DisplayName, Mode=OneWay}`}),c(i.RadioButton,{"x:Name":`InitialsRadio`,Content:`{x:Bind Labels.Initials, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=n(E,[[`render`,A],[`__scopeId`,`data-v-f3da58e1`],[`__file`,`PersonPicturePage.vue`]]);export{j as default};