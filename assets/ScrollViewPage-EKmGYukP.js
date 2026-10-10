import{Ai as e,Bi as t,En as n,Ji as r,Mn as i,Yi as a,_i as o,bi as s,ci as c,dr as l,gi as u,ki as d,o as f,p,t as m,ui as h}from"./ScrollViewer-CHNE18MA.js";import{t as g}from"./Button-DO0TiUOq.js";import{a as _,o as v,s as y}from"./ItemsView-DXNouDjp.js";import{t as b}from"./Image-BKiqvBIm.js";import{t as ee}from"./StackPanel-C60XOD66.js";import{t as te}from"./ComboBox-CjdqaKdN.js";import{t as x}from"./inlineControlProperties-k1PUSjJA.js";import{t as S}from"./ControlExample-BKyw2NwY.js";import{t as C}from"./NumberBox-CHusNLKT.js";import{t as w}from"./pageState-Djrh7EdY.js";var T=`--- header
Content inside of a ScrollView.
--- xaml
<ScrollView Height="266" Width="400" ContentOrientation="None"
    ZoomMode="$(ZoomMode)" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left"
    HorizontalScrollMode="$(HorizontalScrollMode)" HorizontalScrollBarVisibility="$(HorizontalScrollBarVisibility)"
    VerticalScrollMode="$(VerticalScrollMode)" VerticalScrollBarVisibility="$(VerticalScrollBarVisibility)">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="cliff" Stretch="None"
        HorizontalAlignment="Center" VerticalAlignment="Center"/>
</ScrollView>`,E=`--- header
Constant velocity scrolling.
--- xaml
<ScrollView Height="300" Width="400" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/grapes.jpg" Stretch="Uniform" AutomationProperties.Name="grapes"/>
    <Image Source="ms-appx:///Assets/SampleMedia/rainier.jpg" Stretch="Uniform" AutomationProperties.Name="rainier"/>
    <Image Source="ms-appx:///Assets/SampleMedia/sunset.jpg" Stretch="Uniform" AutomationProperties.Name="sunset"/>
    <Image Source="ms-appx:///Assets/SampleMedia/treetops.jpg" Stretch="Uniform" AutomationProperties.Name="treetops"/>
    <Image Source="ms-appx:///Assets/SampleMedia/valley.jpg" Stretch="Uniform" AutomationProperties.Name="valley"/>
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" Stretch="Uniform" AutomationProperties.Name="cliff"/>
</ScrollView>`,D=`--- header
Programmatic scroll with custom animation.
--- xaml
<ScrollView Height="300" Width="400" IsTabStop="True"
    ScrollAnimationStarting="ScrollView_ScrollAnimationStarting"
    VerticalAlignment="Top" HorizontalAlignment="Left">
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage1.jpg" Stretch="Uniform" AutomationProperties.Name="leaves"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage2.jpg" Stretch="Uniform" AutomationProperties.Name="carousel"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage3.jpg" Stretch="Uniform" AutomationProperties.Name="bicycles"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage4.jpg" Stretch="Uniform" AutomationProperties.Name="pond"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage5.jpg" Stretch="Uniform" AutomationProperties.Name="marina"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage6.jpg" Stretch="Uniform" AutomationProperties.Name="beach"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage7.jpg" Stretch="Uniform" AutomationProperties.Name="rampart"/>
    <Image Source="ms-appx:///Assets/SampleMedia/LandscapeImage8.jpg" Stretch="Uniform" AutomationProperties.Name="mountain"/>
</ScrollView>`,O=o({__name:`ScrollViewPage`,setup(t,{expose:i}){i();let{t:o}=p(),u=s(`currentPage`),{pageTheme:d}=w(u?.value||`scrollview`),h=a({});e(l,h);let O=c(()=>({Description:o(`text.scrollview-description`),ContentHeader:o(`sample.scrollview.content`),VelocityHeader:o(`sample.scrollview.constant-velocity`),AnimationHeader:o(`sample.scrollview.programmatic-animation`),ContentNote:o(`sample.scrollview.content-note`),VelocityNote:o(`sample.scrollview.velocity-note`),AnimationNote:o(`sample.scrollview.animation-note`),ZoomMode:o(`text.zoom-mode`),ZoomFactor:o(`text.zoom-factor`),ScrollMode:o(`text.scroll-mode`),ScrollbarVisibility:o(`text.scrollbar-visibility`),Horizontal:o(`text.horizontal`),Vertical:o(`text.vertical`),VerticalVelocity:o(`text.vertical-velocity`),Duration:o(`text.animation-duration-msec`),ScrollWithAnimation:o(`text.scroll-with-animation`),ZoomModeName:o(`text.zoom-mode-automation-name`),ZoomFactorName:o(`text.zoom-factor-automation-name`),HorizontalScrollModeName:o(`text.horizontal-scroll-mode-automation-name`),VerticalScrollModeName:o(`text.vertical-scroll-mode-automation-name`),HorizontalScrollBarName:o(`text.horizontal-scrollbar-visibility-automation-name`),VerticalScrollBarName:o(`text.vertical-scrollbar-visibility-automation-name`),VerticalVelocityName:o(`text.vertical-velocity-automation-name`),VerticalAnimationName:o(`text.vertical-animation-options-automation-name`),DurationName:o(`text.animation-duration-automation-name`),ScrollWithAnimationName:o(`text.scroll-with-animation-automation-name`),Enabled:o(`text.enabled`),Disabled:o(`text.disabled`),Auto:o(`text.auto`),Visible:o(`text.visible`),Hidden:o(`text.hidden`),Default:o(`text.default`),Accordion:o(`text.accordion`),Teleportation:o(`text.teleportation`),Cliff:o(`text.cliff`),Grapes:o(`sample.scrollview.image.grapes`),Rainier:o(`sample.scrollview.image.rainier`),Sunset:o(`sample.scrollview.image.sunset`),Treetops:o(`sample.scrollview.image.treetops`),Valley:o(`sample.scrollview.image.valley`),Leaves:o(`sample.scrollview.image.leaves`),Carousel:o(`sample.scrollview.image.carousel`),Bicycles:o(`sample.scrollview.image.bicycles`),Pond:o(`sample.scrollview.image.pond`),Marina:o(`sample.scrollview.image.marina`),Beach:o(`sample.scrollview.image.beach`),Rampart:o(`sample.scrollview.image.rampart`),Mountain:o(`sample.scrollview.image.mountain`)})),k=r(4),A=r(30),j=r(1500),M=r(0),N={format:e=>(Math.round(e*10)/10).toFixed(1).padStart(4,`0`)},P=()=>h.scrollView1?.ZoomTo(4,null,{AnimationMode:`Enabled`,SnapPointsMode:`Ignore`}),F=e=>Number(e?.SelectedIndex??0),I=e=>{h.scrollView1&&(h.scrollView1.ZoomMode=[`Enabled`,`Disabled`][F(e)])},ne=e=>{h.scrollView1&&(h.scrollView1.HorizontalScrollMode=[`Enabled`,`Disabled`,`Auto`][F(e)])},L=e=>{h.scrollView1&&(h.scrollView1.VerticalScrollMode=[`Enabled`,`Disabled`,`Auto`][F(e)])},R=e=>{h.scrollView1&&(h.scrollView1.HorizontalScrollBarVisibility=[`Auto`,`Visible`,`Hidden`][F(e)])},z=e=>{h.scrollView1&&(h.scrollView1.VerticalScrollBarVisibility=[`Auto`,`Visible`,`Hidden`][F(e)])},B=(e,t)=>{Number.isFinite(t.NewValue)&&h.scrollView1?.ZoomTo(t.NewValue,null)},V=(e,t)=>{let n=h.scrollView2;if(!n||!Number.isFinite(t.OldValue)||!Number.isFinite(t.NewValue))return;n.ScrollBy(0,0,{AnimationMode:`Disabled`,SnapPointsMode:`Ignore`});let r=t.NewValue;r<=30&&r>=-30?r=t.NewValue<t.OldValue?n.VerticalOffset===0?30:-30:n.VerticalOffset===n.ScrollableHeight?-30:30:r<30&&n.VerticalOffset===0?r=30:r>30&&n.VerticalOffset===n.ScrollableHeight&&(r=-30),A.value=r,n.AddScrollVelocity({x:0,y:r},{x:0,y:0})},H=()=>{let e=h.scrollView3;return e?e.VerticalOffset>e.ScrollableHeight/2?e.ScrollableHeight/5:4*e.ScrollableHeight/5:0},U=()=>{let e=h.scrollView3;e?.ScrollTo(e.HorizontalOffset,H(),{AnimationMode:`Enabled`,SnapPointsMode:`Ignore`})},W=(e,t)=>{let n=t.Animation;if(!n||!h.scrollView3)return;if(M.value===0){n.Duration=j.value;return}let r=h.scrollView3,i=t.EndPosition.y,a=i-t.StartPosition.y,o=n.Compositor.CreateVector3KeyFrameAnimation();if(M.value===1){let e=.1*a;for(let t=0;t<3;t++)o.InsertKeyFrame(1-.4/2**t,{x:r.HorizontalOffset,y:i+e,z:0}),e/=-2;o.InsertKeyFrame(1,{x:r.HorizontalOffset,y:i,z:0})}else{let e=n.Compositor.CreateCubicBezierEasingFunction({x:1,y:0},{x:1,y:0}),t=n.Compositor.CreateCubicBezierEasingFunction({x:0,y:1},{x:0,y:1}),s=n.Compositor.CreateStepEasingFunction(1);o.InsertKeyFrame(.499999,{x:r.HorizontalOffset,y:i-.9*a,z:0},e),o.InsertKeyFrame(.5,{x:r.HorizontalOffset,y:i-.1*a,z:0},s),o.InsertKeyFrame(1,{x:r.HorizontalOffset,y:i,z:0},t)}o.Duration=j.value,t.Animation=o},G=e=>{M.value=F(e)},K=(e,t)=>{Number.isFinite(t.NewValue)&&(j.value=t.NewValue)},q=e=>e.split(`--- xaml`)[1]?.trim()??``,J=c(()=>q(T).replace(/\$\((\w+)\)/g,(e,t)=>String(h.scrollView1?.[t]??{ZoomMode:`Enabled`,HorizontalScrollMode:`Auto`,VerticalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Auto`,VerticalScrollBarVisibility:`Auto`}[t]))),Y=q(E),X=q(D),Z=c(()=>[`﻿//Default Animation
private void ScrollView_ScrollAnimationStarting(ScrollView sender, ScrollingScrollAnimationStartingEventArgs e)
{
    // Cast the animation from the event arguments to a Vector3KeyFrameAnimation.
    Vector3KeyFrameAnimation? stockKeyFrameAnimation = e.Animation as Vector3KeyFrameAnimation;

    // Check if the animation is of the correct type.
    if (stockKeyFrameAnimation != null)
    {
        // Set the duration of the default animation to the value specified by nbAnimationDuration.
        stockKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);
    }
}

// This function is triggered when the button is clicked to scroll with animation.
private void BtnScrollWithAnimation_Click(object sender, RoutedEventArgs e)
{
    // Check if the ScrollView control is initialized.
    if (scrollView3 != null)
    {
        // Initiate a scroll to the target vertical offset with animation enabled.
        scrollView3.ScrollTo(scrollView3.HorizontalOffset, GetTargetVerticalOffset(), new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));
    }
}

// This function calculates the target vertical offset based on the current vertical offset of the ScrollView.
private double GetTargetVerticalOffset()
{
    // Determine if the current vertical offset is greater than half of the scrollable height.
    if (scrollView3.VerticalOffset > scrollView3.ScrollableHeight / 2.0)
    {
        // If yes, return a lower target vertical offset.
        return scrollView3.ScrollableHeight / 5.0;
    }
    else
    {
        // If no, return a higher target vertical offset.
        return 4.0 * scrollView3.ScrollableHeight / 5.0;
    }
}`,`﻿//Accordion Animation
private void ScrollView_ScrollAnimationStarting(ScrollView sender, ScrollingScrollAnimationStartingEventArgs e)
{
    // Cast the animation from the event arguments to a Vector3KeyFrameAnimation.
    Vector3KeyFrameAnimation stockKeyFrameAnimation = e.Animation as Vector3KeyFrameAnimation;

    // Check if the animation is of the correct type.
    if (stockKeyFrameAnimation != null)
    {
        // Calculate the target vertical offset for the scroll animation.
        double targetVerticalOffset = GetTargetVerticalOffset();
        float targetVerticalPosition = (float)targetVerticalOffset;

        // Create a new Vector3KeyFrameAnimation for custom animation.
        Vector3KeyFrameAnimation customKeyFrameAnimation = stockKeyFrameAnimation.Compositor.CreateVector3KeyFrameAnimation();

        // Calculate the initial vertical offset change for the animation.
        float deltaVerticalPosition = 0.1f * (float)(targetVerticalOffset - scrollView3.VerticalOffset);

        // Define the animation steps with keyframes for a smooth transition.
        for (int step = 0; step < 3; step++)
        {
            // Insert a keyframe at a specific time with a computed vertical position.
            customKeyFrameAnimation.InsertKeyFrame(
                1.0f - (0.4f / (float)Math.Pow(2, step)), // Time progress for the keyframe
                new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition + deltaVerticalPosition, 0.0f));
            
            // Adjust the deltaVerticalPosition for the next keyframe to create an "accordion" effect.
            deltaVerticalPosition /= -2.0f;
        }

        // Insert the final keyframe with the target vertical position.
        customKeyFrameAnimation.InsertKeyFrame(1.0f, new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition, 0.0f));
    
        // Set the duration of the custom animation.
        customKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);

        // Replace the default animation with the custom animation.
        e.Animation = customKeyFrameAnimation;
    }
}

// This function is triggered when the button is clicked to scroll with animation.
private void BtnScrollWithAnimation_Click(object sender, RoutedEventArgs e)
{
    // Check if the ScrollView control is initialized.
    if (scrollView3 != null)
    {
        // Initiate a scroll to the target vertical offset with animation enabled.
        scrollView3.ScrollTo(scrollView3.HorizontalOffset, GetTargetVerticalOffset(), new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));
    }
}

// This function calculates the target vertical offset based on the current vertical offset of the ScrollView.
private double GetTargetVerticalOffset()
{
    // Determine if the current vertical offset is greater than half of the scrollable height.
    if (scrollView3.VerticalOffset > scrollView3.ScrollableHeight / 2.0)
    {
        // If yes, return a lower target vertical offset.
        return scrollView3.ScrollableHeight / 5.0;
    }
    else
    {
        // If no, return a higher target vertical offset.
        return 4.0 * scrollView3.ScrollableHeight / 5.0;
    }
}`,`﻿//Teleportation Animation
private void ScrollView_ScrollAnimationStarting(ScrollView sender, ScrollingScrollAnimationStartingEventArgs e)
{
    // Cast the animation from the event arguments to a Vector3KeyFrameAnimation.
    Vector3KeyFrameAnimation? stockKeyFrameAnimation = e.Animation as Vector3KeyFrameAnimation;

    // Check if the animation is of the correct type.
    if (stockKeyFrameAnimation != null)
    {
        // Calculate the target vertical offset for the scroll animation.
        double targetVerticalOffset = GetTargetVerticalOffset();
        float targetVerticalPosition = (float)targetVerticalOffset;

        // Create a new Vector3KeyFrameAnimation for custom animation.
        Vector3KeyFrameAnimation customKeyFrameAnimation = stockKeyFrameAnimation.Compositor.CreateVector3KeyFrameAnimation();

        // Calculate the difference between the current and target vertical positions.
        float deltaVerticalPosition = (float)(targetVerticalOffset - scrollView3.VerticalOffset);

        // Define easing functions for smooth transitions.
        // Start easing function with cubic Bezier curve for a quick start.
        CubicBezierEasingFunction cubicBezierStart = stockKeyFrameAnimation.Compositor.CreateCubicBezierEasingFunction(
            new Vector2(1.0f, 0.0f), // Control point 1
            new Vector2(1.0f, 0.0f)); // Control point 2

        // Define step easing function for a sudden change in animation.
        StepEasingFunction step = stockKeyFrameAnimation.Compositor.CreateStepEasingFunction(1);

        // End easing function with cubic Bezier curve for a smooth end.
        CubicBezierEasingFunction cubicBezierEnd = stockKeyFrameAnimation.Compositor.CreateCubicBezierEasingFunction(
            new Vector2(0.0f, 1.0f), // Control point 1
            new Vector2(0.0f, 1.0f)); // Control point 2

        // Insert keyframes into the custom animation.
        // First keyframe near the midpoint of the animation with a quick dip.
        customKeyFrameAnimation.InsertKeyFrame(
            0.499999f, // Time progress for the keyframe (almost halfway)
            new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition - 0.9f * deltaVerticalPosition, 0.0f),
            cubicBezierStart); // Easing function for start

        // Second keyframe exactly at halfway with a sudden step change.
        customKeyFrameAnimation.InsertKeyFrame(
            0.5f, // Time progress for the keyframe (exactly halfway)
            new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition - 0.1f * deltaVerticalPosition, 0.0f),
            step); // Easing function for sudden change

        // Final keyframe at the end of the animation.
        customKeyFrameAnimation.InsertKeyFrame(
            1.0f, // Time progress for the keyframe (end)
            new Vector3((float)scrollView3.HorizontalOffset, targetVerticalPosition, 0.0f),
            cubicBezierEnd); // Easing function for end

        // Set the duration of the custom animation.
        customKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);

        // Replace the default animation with the custom animation.
        e.Animation = customKeyFrameAnimation;
    }
}

// This function is triggered when the button is clicked to scroll with animation.
private void BtnScrollWithAnimation_Click(object sender, RoutedEventArgs e)
{
    // Check if the ScrollView control is initialized.
    if (scrollView3 != null)
    {
        // Initiate a scroll to the target vertical offset with animation enabled.
        scrollView3.ScrollTo(scrollView3.HorizontalOffset, GetTargetVerticalOffset(), new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));
    }
}

// This function calculates the target vertical offset based on the current vertical offset of the ScrollView.
private double GetTargetVerticalOffset()
{
    // Determine if the current vertical offset is greater than half of the scrollable height.
    if (scrollView3.VerticalOffset > scrollView3.ScrollableHeight / 2.0)
    {
        // If yes, return a lower target vertical offset.
        return scrollView3.ScrollableHeight / 5.0;
    }
    else
    {
        // If no, return a higher target vertical offset.
        return 4.0 * scrollView3.ScrollableHeight / 5.0;
    }
}`][M.value]?.replaceAll(`nbAnimationDuration.Value`,String(j.value))??`﻿//Default Animation
private void ScrollView_ScrollAnimationStarting(ScrollView sender, ScrollingScrollAnimationStartingEventArgs e)
{
    // Cast the animation from the event arguments to a Vector3KeyFrameAnimation.
    Vector3KeyFrameAnimation? stockKeyFrameAnimation = e.Animation as Vector3KeyFrameAnimation;

    // Check if the animation is of the correct type.
    if (stockKeyFrameAnimation != null)
    {
        // Set the duration of the default animation to the value specified by nbAnimationDuration.
        stockKeyFrameAnimation.Duration = TimeSpan.FromMilliseconds(nbAnimationDuration.Value);
    }
}

// This function is triggered when the button is clicked to scroll with animation.
private void BtnScrollWithAnimation_Click(object sender, RoutedEventArgs e)
{
    // Check if the ScrollView control is initialized.
    if (scrollView3 != null)
    {
        // Initiate a scroll to the target vertical offset with animation enabled.
        scrollView3.ScrollTo(scrollView3.HorizontalOffset, GetTargetVerticalOffset(), new ScrollingScrollOptions(ScrollingAnimationMode.Enabled, ScrollingSnapPointsMode.Ignore));
    }
}

// This function calculates the target vertical offset based on the current vertical offset of the ScrollView.
private double GetTargetVerticalOffset()
{
    // Determine if the current vertical offset is greater than half of the scrollable height.
    if (scrollView3.VerticalOffset > scrollView3.ScrollableHeight / 2.0)
    {
        // If yes, return a lower target vertical offset.
        return scrollView3.ScrollableHeight / 5.0;
    }
    else
    {
        // If no, return a higher target vertical offset.
        return 4.0 * scrollView3.ScrollableHeight / 5.0;
    }
}`),Q=e=>{let t=h[e];return o(`sample.scrollview.output`,{horizontal:Number(t?.HorizontalOffset??0).toFixed(1),vertical:Number(t?.VerticalOffset??0).toFixed(1),zoom:Number(t?.ZoomFactor??1).toFixed(1),state:o(`sample.scrollview.state.${String(t?.State??`Idle`).toLowerCase()}`)})},$={t:o,currentPage:u,pageTheme:d,Names:h,Labels:O,ZoomFactorValue:k,VerticalVelocityValue:A,AnimationDurationValue:j,AnimationSelectedIndex:M,ZoomFactorFormatter:N,ScrollViewPage_Loaded:P,selectionIndex:F,CmbZoomMode_SelectionChanged:I,CmbHorizontalScrollMode_SelectionChanged:ne,CmbVerticalScrollMode_SelectionChanged:L,CmbHorizontalScrollBarVisibility_SelectionChanged:R,CmbVerticalScrollBarVisibility_SelectionChanged:z,NbZoomFactor_ValueChanged:B,NbVerticalVelocity_ValueChanged:V,GetTargetVerticalOffset:H,BtnScrollWithAnimation_Click:U,ScrollView_ScrollAnimationStarting:W,cmbVerticalAnimation_SelectionChanged:G,nbAnimationDuration_ValueChanged:K,codePart:q,ContentXaml:J,VelocityXaml:Y,AnimationXaml:X,AnimationCSharp:Z,output:Q,Output1:c(()=>Q(`scrollView1`)),Output2:c(()=>Q(`scrollView2`)),Output3:c(()=>Q(`scrollView3`)),Button:g,ComboBox:te,get ComboBoxItem(){return x},ControlExample:S,Grid:n,ColumnDefinition:y,RowDefinition:v,Image:b,NumberBox:C,ScrollView:_,ScrollViewer:m,StackPanel:ee,TextBlock:f};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}});function k(e,n,r,i,a,o){return d(),h(i.ScrollViewer,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:t(()=>[u(i.StackPanel,{class:`gallery-item-page`,Spacing:`0`},{default:t(()=>[u(i.StackPanel,{class:`page-heading`},{default:t(()=>[u(i.TextBlock,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),u(i.StackPanel,{class:`gallery-page-content`},{default:t(()=>[u(i.ControlExample,{"x:Name":`Example1`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.ContentHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ContentXaml, Mode=OneWay}`,CSharp:`{x:Bind ScrollViewCSharp, Mode=OneWay}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.StackPanel,{Spacing:`16`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Labels.ContentNote, Mode=OneWay}`,TextWrapping:`Wrap`}),u(i.ScrollView,{"x:Name":`scrollView1`,Width:`400`,Height:`266`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,ContentOrientation:`None`,IsTabStop:`True`,ZoomMode:`Enabled`,Loaded:`ScrollViewPage_Loaded`},{default:t(()=>[u(i.Image,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,"AutomationProperties.Name":`{x:Bind Labels.Cliff, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output,null,{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),u(i.ControlExample.Options,null,{default:t(()=>[u(i.Grid,{MinWidth:`200`,ColumnSpacing:`12`,RowSpacing:`16`},{default:t(()=>[u(i.Grid.ColumnDefinitions,null,{default:t(()=>[u(i.ColumnDefinition,{Width:`Auto`}),u(i.ColumnDefinition,{Width:`*`})]),_:1}),u(i.Grid.RowDefinitions,null,{default:t(()=>[u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`})]),_:1}),u(i.TextBlock,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.ZoomMode, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbZoomMode`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.ZoomModeName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbZoomMode_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`})]),_:1}),u(i.TextBlock,{"Grid.Row":`1`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.ZoomFactor, Mode=OneWay}`}),u(i.NumberBox,{"x:Name":`nbZoomFactor`,"Grid.Row":`1`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.ZoomFactorName, Mode=OneWay}`,LargeChange:`10`,Maximum:`10`,Minimum:`0.1`,SmallChange:`1`,SpinButtonPlacementMode:`Inline`,ValueChanged:`NbZoomFactor_ValueChanged`,Value:`{x:Bind ZoomFactorValue, Mode=TwoWay}`,NumberFormatter:`{x:Bind ZoomFactorFormatter}`}),u(i.TextBlock,{"Grid.Row":`2`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Center`,Text:`{x:Bind Labels.ScrollMode, Mode=OneWay}`}),u(i.TextBlock,{"Grid.Row":`3`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Horizontal, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbHorizontalScrollMode`,"Grid.Row":`3`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.HorizontalScrollModeName, Mode=OneWay}`,SelectedIndex:`2`,SelectionChanged:`CmbHorizontalScrollMode_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Auto, Mode=OneWay}`})]),_:1}),u(i.TextBlock,{"Grid.Row":`4`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Vertical, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbVerticalScrollMode`,"Grid.Row":`4`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalScrollModeName, Mode=OneWay}`,SelectedIndex:`2`,SelectionChanged:`CmbVerticalScrollMode_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Auto, Mode=OneWay}`})]),_:1}),u(i.TextBlock,{"Grid.Row":`5`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Center`,Text:`{x:Bind Labels.ScrollbarVisibility, Mode=OneWay}`}),u(i.TextBlock,{"Grid.Row":`6`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Horizontal, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbHorizontalScrollBarVisibility`,"Grid.Row":`6`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.HorizontalScrollBarName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbHorizontalScrollBarVisibility_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Auto, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Visible, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Hidden, Mode=OneWay}`})]),_:1}),u(i.TextBlock,{"Grid.Row":`7`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Vertical, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbVerticalScrollBarVisibility`,"Grid.Row":`7`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalScrollBarName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbVerticalScrollBarVisibility_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Auto, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Visible, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Hidden, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),u(i.ControlExample,{"x:Name":`Example2`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.VelocityHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind VelocityXaml, Mode=OneWay}`,CSharp:`{x:Bind ScrollViewCSharp, Mode=OneWay}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.StackPanel,{Spacing:`16`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Labels.VelocityNote, Mode=OneWay}`,TextWrapping:`Wrap`}),u(i.ScrollView,{"x:Name":`scrollView2`,Width:`400`,Height:`300`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,IsTabStop:`True`},{default:t(()=>[u(i.StackPanel,null,{default:t(()=>[u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Grapes, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/grapes.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Rainier, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Sunset, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Treetops, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/treetops.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Valley, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/valley.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Cliff, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output,null,{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),u(i.ControlExample.Options,null,{default:t(()=>[u(i.Grid,{MinWidth:`200`,ColumnSpacing:`12`,RowSpacing:`16`},{default:t(()=>[u(i.Grid.ColumnDefinitions,null,{default:t(()=>[u(i.ColumnDefinition,{Width:`Auto`}),u(i.ColumnDefinition,{Width:`*`})]),_:1}),u(i.Grid.RowDefinitions,null,{default:t(()=>[u(i.RowDefinition,{Height:`Auto`})]),_:1}),u(i.TextBlock,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.VerticalVelocity, Mode=OneWay}`}),u(i.NumberBox,{"x:Name":`nbVerticalVelocity`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.VerticalVelocityName, Mode=OneWay}`,LargeChange:`30`,Maximum:`200`,Minimum:`-200`,SmallChange:`10`,SpinButtonPlacementMode:`Inline`,ValueChanged:`NbVerticalVelocity_ValueChanged`,Value:`{x:Bind VerticalVelocityValue, Mode=TwoWay}`})]),_:1})]),_:1})]),_:1}),u(i.ControlExample,{"x:Name":`Example3`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.AnimationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AnimationXaml, Mode=OneWay}`,CSharp:`{x:Bind AnimationCSharp, Mode=OneWay}`},{default:t(()=>[u(i.ControlExample.Example,null,{default:t(()=>[u(i.StackPanel,{Spacing:`16`},{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Labels.AnimationNote, Mode=OneWay}`,TextWrapping:`Wrap`}),u(i.ScrollView,{"x:Name":`scrollView3`,Width:`400`,Height:`300`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,IsTabStop:`True`,ScrollAnimationStarting:`ScrollView_ScrollAnimationStarting`},{default:t(()=>[u(i.StackPanel,null,{default:t(()=>[u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Leaves, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage1.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Carousel, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage2.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Bicycles, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage3.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Pond, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage4.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Marina, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage5.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Beach, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage6.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Rampart, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage7.jpg`,Stretch:`Uniform`}),u(i.Image,{"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage8.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1})]),_:1}),u(i.ControlExample.Output,null,{default:t(()=>[u(i.TextBlock,{Text:`{x:Bind Output3, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),u(i.ControlExample.Options,null,{default:t(()=>[u(i.Grid,{MinWidth:`320`,ColumnSpacing:`12`,RowSpacing:`16`},{default:t(()=>[u(i.Grid.ColumnDefinitions,null,{default:t(()=>[u(i.ColumnDefinition,{Width:`Auto`}),u(i.ColumnDefinition,{Width:`*`})]),_:1}),u(i.Grid.RowDefinitions,null,{default:t(()=>[u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`}),u(i.RowDefinition,{Height:`Auto`})]),_:1}),u(i.TextBlock,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}`}),u(i.ComboBox,{"x:Name":`cmbVerticalAnimation`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalAnimationName, Mode=OneWay}`,SelectedIndex:`{x:Bind AnimationSelectedIndex, Mode=TwoWay}`,SelectionChanged:`cmbVerticalAnimation_SelectionChanged`},{default:t(()=>[u(i.ComboBoxItem,{Content:`{x:Bind Labels.Default, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Accordion, Mode=OneWay}`}),u(i.ComboBoxItem,{Content:`{x:Bind Labels.Teleportation, Mode=OneWay}`})]),_:1}),u(i.TextBlock,{"Grid.Row":`1`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Duration, Mode=OneWay}`}),u(i.NumberBox,{"x:Name":`nbAnimationDuration`,"Grid.Row":`1`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.DurationName, Mode=OneWay}`,LargeChange:`1000`,Maximum:`5000`,Minimum:`1000`,SmallChange:`500`,SpinButtonPlacementMode:`Inline`,ValueChanged:`nbAnimationDuration_ValueChanged`,Value:`{x:Bind AnimationDurationValue, Mode=TwoWay}`}),u(i.Button,{"x:Name":`btnScrollWithAnimation`,"Grid.Row":`2`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.ScrollWithAnimationName, Mode=OneWay}`,Click:`BtnScrollWithAnimation_Click`,Content:`{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}var A=i(O,[[`render`,k],[`__scopeId`,`data-v-856f2c57`],[`__file`,`ScrollViewPage.vue`]]);export{A as default};