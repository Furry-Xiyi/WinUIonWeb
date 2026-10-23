import{Di as e,Ei as t,Ki as n,Li as r,Wt as i,_i as a,a as o,ai as s,et as c,o as l,oi as u,pi as d,si as f,sr as p,t as m}from"./ScrollViewer-BWDA_C78.js";import{t as h}from"./Button-BNDPNdYJ.js";import{t as g}from"./StackPanel-sg_Bd5oB.js";import{t as _}from"./RadioButton-C8L7M_Qr.js";import{t as v}from"./PersonPicture-BrRaRj4M.js";import{t as y}from"./RadioButtons-KKClVCXN.js";import{t as b}from"./ToggleButton-HP5wmrvH.js";import{t as x}from"./ControlExample-CzGyf8u0.js";import{t as S}from"./pageState-CcJibQcm.js";var C=`--- header
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
`,T=`https://learn.microsoft.com/windows/uwp/contacts-and-calendar/images/shoulder-tap-static-payload.png`,E={__name:`PersonPicturePage`,setup(t,{expose:r}){r();let{t:i}=c(),u=a(`currentPage`),d=s(()=>u?.value||`personpicture`),{isFavoriteState:f,pageTheme:E,toggleTheme:D,toggleFavorite:O}=S(d.value),k=n({});e(p,k);let A=s(()=>({PageTitle:i(`text.personpicture`),Description:i(`text.personpicture-description`),ToggleTheme:i(`gallery.page-header.toggle-theme`),SelectLooks:i(`sample.personpicture.select-looks`),ProfileType:i(`sample.personpicture.profile-type`),ProfileImage:i(`sample.personpicture.profile-image`),DisplayName:i(`sample.personpicture.display-name`),Initials:i(`sample.personpicture.initials`)})),j=s(()=>i(f.value?`gallery.remove-favorite`:`gallery.add-favorite`)),M=s(()=>f.value?``:``),N=()=>{let e=k.personPicture;e&&(k.ProfileImageRadio?.IsChecked===!0?(e.ProfilePicture={UriSource:T},e.DisplayName=null,e.Initials=null):k.DisplayNameRadio?.IsChecked===!0?(e.ProfilePicture=null,e.DisplayName=i(`sample.personpicture.person-name`),e.Initials=null):k.InitialsRadio?.IsChecked===!0&&(e.ProfilePicture=null,e.DisplayName=null,e.Initials=i(`sample.personpicture.person-initials`)))},P=s(()=>{let e=k.personPicture;if(!e)return``;let t={width:e.ActualWidth,height:e.ActualHeight};return e.ProfilePicture?i(`sample.personpicture.output.image`,t):i(`sample.personpicture.output.initials`,{...t,name:e.DisplayName||e.Initials,initials:e.TemplateSettings.ActualInitials})}),F=e=>String(e).replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`),I={t:i,currentPage:u,pageKey:d,isFavoriteState:f,pageTheme:E,toggleTheme:D,toggleFavorite:O,Names:k,ProfileImageUri:T,Labels:A,FavoriteLabel:j,FavoriteGlyph:M,RadioButtons_SelectionChanged:N,PictureOutput:P,escapeAttribute:F,PersonPictureXaml:s(()=>{let e=k.personPicture,t={ProfilePicture:e?.ProfilePicture?`ProfilePicture="${T}"`:``,DisplayName:e?.DisplayName?`DisplayName="${F(e.DisplayName)}"`:``,Initials:e?.Initials?`Initials="${F(e.Initials)}"`:``};return C.split(`--- xaml`)[1].trim().replace(/\$\((\w+)\)/g,(e,n)=>t[n]||``)}),computed:s,inject:a,provide:e,shallowReactive:n,Button:h,ControlExample:x,FontIcon:o,PersonPicture:v,RadioButton:_,RadioButtons:y,ScrollViewer:m,StackPanel:g,TextBlock:l,ToggleButton:b,get useI18n(){return c},get xamlNameScopeKey(){return p},get createPageState(){return S},get sampleDefinition(){return C},get PersonPictureCSharp(){return w}};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}},D={class:`gallery-item-page`},O={class:`page-heading`},k={class:`page-header-actions`};function A(e,n,i,a,o,s){return t(),f(a.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:r(()=>[u(`div`,D,[u(`div`,O,[d(a.TextBlock,{class:`page-header`,Text:`{x:Bind Labels.PageTitle, Mode=OneWay}`,FontSize:`28`,FontWeight:`SemiBold`,LineHeight:`32`,Margin:`0,0,72,8`,TextWrapping:`Wrap`}),d(a.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`}),u(`div`,k,[d(a.Button,{class:`header-action`,Click:`toggleTheme`,"ToolTipService.ToolTip":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind Labels.ToggleTheme, Mode=OneWay}`},{default:r(()=>[d(a.FontIcon,{Glyph:``,FontSize:`16`})]),_:1}),d(a.ToggleButton,{class:`header-action`,IsChecked:`{x:Bind isFavoriteState, Mode=OneWay}`,Click:`toggleFavorite`,"ToolTipService.ToolTip":`{x:Bind FavoriteLabel, Mode=OneWay}`,"AutomationProperties.Name":`{x:Bind FavoriteLabel, Mode=OneWay}`},{default:r(()=>[d(a.FontIcon,{Glyph:`{x:Bind FavoriteGlyph, Mode=OneWay}`,FontSize:`16`})]),_:1})])]),d(a.StackPanel,{class:`gallery-page-content`},{default:r(()=>[d(a.ControlExample,{"x:Name":`Example1`,class:`person-picture-example`,SampleDefinition:`PersonPicture\\PersonPictureSelectDifferentLooksPerson.txt`,HeaderText:`{x:Bind Labels.SelectLooks, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind PersonPictureXaml, Mode=OneWay}`,CSharp:`{x:Bind PersonPictureCSharp, Mode=OneWay}`},{default:r(()=>[d(a.ControlExample.Example,null,{default:r(()=>[d(a.PersonPicture,{"x:Name":`personPicture`,Height:`300`,VerticalAlignment:`Top`})]),_:1}),d(a.ControlExample.Output,null,{default:r(()=>[d(a.TextBlock,{Text:`{x:Bind PictureOutput, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),d(a.ControlExample.Options,null,{default:r(()=>[d(a.RadioButtons,{"x:Name":`ProfileType`,SelectedIndex:`0`,Header:`{x:Bind Labels.ProfileType, Mode=OneWay}`,SelectionChanged:`RadioButtons_SelectionChanged`},{default:r(()=>[d(a.RadioButton,{"x:Name":`ProfileImageRadio`,Content:`{x:Bind Labels.ProfileImage, Mode=OneWay}`,IsChecked:`True`}),d(a.RadioButton,{"x:Name":`DisplayNameRadio`,Content:`{x:Bind Labels.DisplayName, Mode=OneWay}`}),d(a.RadioButton,{"x:Name":`InitialsRadio`,Content:`{x:Bind Labels.Initials, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})])]),_:1})}var j=i(E,[[`render`,A],[`__scopeId`,`data-v-f3da58e1`],[`__file`,`PersonPicturePage.vue`]]);export{j as default};