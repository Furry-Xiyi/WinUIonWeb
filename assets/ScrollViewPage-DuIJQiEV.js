import{$i as e,Ai as t,Bi as n,En as r,Ji as i,Mn as a,Yi as o,_i as s,bi as c,ci as l,dr as u,gi as d,ki as f,o as p,p as m,t as h,ui as g}from"./ScrollViewer-B43ymvAj.js";import{t as _}from"./Button-B49t7g4C.js";import{a as v,o as y,s as b}from"./ItemsView-BZtcyp6v.js";import{t as x}from"./Image-DEHWrAx2.js";import{t as S}from"./StackPanel-Dy6dKYi5.js";import{t as C}from"./ComboBox-nqHKK9K4.js";import{t as w}from"./inlineControlProperties-DBSF73Uo.js";import{t as T}from"./ControlExample-Ddvmn5_c.js";import{t as E}from"./NumberBox-BMqTXENi.js";import{t as D}from"./pageState-BQHW0me4.js";var O=`--- header
Content inside of a ScrollView.
--- xaml
<ScrollView Height="266" Width="400" ContentOrientation="None"
    ZoomMode="$(ZoomMode)" IsTabStop="True"
    VerticalAlignment="Top" HorizontalAlignment="Left"
    HorizontalScrollMode="$(HorizontalScrollMode)" HorizontalScrollBarVisibility="$(HorizontalScrollBarVisibility)"
    VerticalScrollMode="$(VerticalScrollMode)" VerticalScrollBarVisibility="$(VerticalScrollBarVisibility)">
    <Image Source="ms-appx:///Assets/SampleMedia/cliff.jpg" AutomationProperties.Name="cliff" Stretch="None"
        HorizontalAlignment="Center" VerticalAlignment="Center"/>
</ScrollView>`,k=`--- header
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
</ScrollView>`,A=`--- header
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
</ScrollView>`,j=a(s({__name:`ScrollViewPage`,setup(a){let{t:s}=m(),{pageTheme:j}=D(c(`currentPage`)?.value||`scrollview`),M=o({});t(u,M),l(()=>({Description:s(`text.scrollview-description`),ContentHeader:s(`sample.scrollview.content`),VelocityHeader:s(`sample.scrollview.constant-velocity`),AnimationHeader:s(`sample.scrollview.programmatic-animation`),ContentNote:s(`sample.scrollview.content-note`),VelocityNote:s(`sample.scrollview.velocity-note`),AnimationNote:s(`sample.scrollview.animation-note`),ZoomMode:s(`text.zoom-mode`),ZoomFactor:s(`text.zoom-factor`),ScrollMode:s(`text.scroll-mode`),ScrollbarVisibility:s(`text.scrollbar-visibility`),Horizontal:s(`text.horizontal`),Vertical:s(`text.vertical`),VerticalVelocity:s(`text.vertical-velocity`),Duration:s(`text.animation-duration-msec`),ScrollWithAnimation:s(`text.scroll-with-animation`),ZoomModeName:s(`text.zoom-mode-automation-name`),ZoomFactorName:s(`text.zoom-factor-automation-name`),HorizontalScrollModeName:s(`text.horizontal-scroll-mode-automation-name`),VerticalScrollModeName:s(`text.vertical-scroll-mode-automation-name`),HorizontalScrollBarName:s(`text.horizontal-scrollbar-visibility-automation-name`),VerticalScrollBarName:s(`text.vertical-scrollbar-visibility-automation-name`),VerticalVelocityName:s(`text.vertical-velocity-automation-name`),VerticalAnimationName:s(`text.vertical-animation-options-automation-name`),DurationName:s(`text.animation-duration-automation-name`),ScrollWithAnimationName:s(`text.scroll-with-animation-automation-name`),Enabled:s(`text.enabled`),Disabled:s(`text.disabled`),Auto:s(`text.auto`),Visible:s(`text.visible`),Hidden:s(`text.hidden`),Default:s(`text.default`),Accordion:s(`text.accordion`),Teleportation:s(`text.teleportation`),Cliff:s(`text.cliff`),Grapes:s(`sample.scrollview.image.grapes`),Rainier:s(`sample.scrollview.image.rainier`),Sunset:s(`sample.scrollview.image.sunset`),Treetops:s(`sample.scrollview.image.treetops`),Valley:s(`sample.scrollview.image.valley`),Leaves:s(`sample.scrollview.image.leaves`),Carousel:s(`sample.scrollview.image.carousel`),Bicycles:s(`sample.scrollview.image.bicycles`),Pond:s(`sample.scrollview.image.pond`),Marina:s(`sample.scrollview.image.marina`),Beach:s(`sample.scrollview.image.beach`),Rampart:s(`sample.scrollview.image.rampart`),Mountain:s(`sample.scrollview.image.mountain`)})),i(4),i(30);let N=i(1500),P=i(0),F=e=>e.split(`--- xaml`)[1]?.trim()??``;l(()=>F(O).replace(/\$\((\w+)\)/g,(e,t)=>String(M.scrollView1?.[t]??{ZoomMode:`Enabled`,HorizontalScrollMode:`Auto`,VerticalScrollMode:`Auto`,HorizontalScrollBarVisibility:`Auto`,VerticalScrollBarVisibility:`Auto`}[t]))),F(k),F(A),l(()=>[`﻿//Default Animation
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
}`][P.value]?.replaceAll(`nbAnimationDuration.Value`,String(N.value))??`﻿//Default Animation
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
}`);let I=e=>{let t=M[e];return s(`sample.scrollview.output`,{horizontal:Number(t?.HorizontalOffset??0).toFixed(1),vertical:Number(t?.VerticalOffset??0).toFixed(1),zoom:Number(t?.ZoomFactor??1).toFixed(1),state:s(`sample.scrollview.state.${String(t?.State??`Idle`).toLowerCase()}`)})};return l(()=>I(`scrollView1`)),l(()=>I(`scrollView2`)),l(()=>I(`scrollView3`)),(t,i)=>(f(),g(h,{class:`gallery-page-scroll`,VerticalScrollBarVisibility:`Auto`,VerticalScrollMode:`Auto`},{default:n(()=>[d(S,{class:`gallery-item-page`,Spacing:`0`},{default:n(()=>[d(S,{class:`page-heading`},{default:n(()=>[d(p,{class:`page-description`,Text:`{x:Bind Labels.Description, Mode=OneWay}`,TextWrapping:`WrapWholeWords`})]),_:1}),d(S,{class:`gallery-page-content`},{default:n(()=>[d(T,{"x:Name":`Example1`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.ContentHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind ContentXaml, Mode=OneWay}`,CSharp:`{x:Bind ScrollViewCSharp, Mode=OneWay}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(S,{Spacing:`16`},{default:n(()=>[d(p,{Text:`{x:Bind Labels.ContentNote, Mode=OneWay}`,TextWrapping:`Wrap`}),d(v,{"x:Name":`scrollView1`,Width:`400`,Height:`266`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,ContentOrientation:`None`,IsTabStop:`True`,ZoomMode:`Enabled`,Loaded:`ScrollViewPage_Loaded`},{default:n(()=>[d(x,{HorizontalAlignment:`Center`,VerticalAlignment:`Center`,"AutomationProperties.Name":`{x:Bind Labels.Cliff, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1}),d(T.Output,null,{default:n(()=>[d(p,{Text:`{x:Bind Output1, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),d(T.Options,null,{default:n(()=>[d(r,{MinWidth:`200`,ColumnSpacing:`12`,RowSpacing:`16`},{default:n(()=>[d(r.ColumnDefinitions,null,{default:n(()=>[d(b,{Width:`Auto`}),d(b,{Width:`*`})]),_:1}),d(r.RowDefinitions,null,{default:n(()=>[d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`})]),_:1}),d(p,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.ZoomMode, Mode=OneWay}`}),d(C,{"x:Name":`cmbZoomMode`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.ZoomModeName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbZoomMode_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`})]),_:1}),d(p,{"Grid.Row":`1`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.ZoomFactor, Mode=OneWay}`}),d(E,{"x:Name":`nbZoomFactor`,"Grid.Row":`1`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.ZoomFactorName, Mode=OneWay}`,LargeChange:`10`,Maximum:`10`,Minimum:`0.1`,SmallChange:`1`,SpinButtonPlacementMode:`Inline`,ValueChanged:`NbZoomFactor_ValueChanged`,Value:`{x:Bind ZoomFactorValue, Mode=TwoWay}`,NumberFormatter:`{x:Bind ZoomFactorFormatter}`}),d(p,{"Grid.Row":`2`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Center`,Text:`{x:Bind Labels.ScrollMode, Mode=OneWay}`}),d(p,{"Grid.Row":`3`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Horizontal, Mode=OneWay}`}),d(C,{"x:Name":`cmbHorizontalScrollMode`,"Grid.Row":`3`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.HorizontalScrollModeName, Mode=OneWay}`,SelectedIndex:`2`,SelectionChanged:`CmbHorizontalScrollMode_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Auto, Mode=OneWay}`})]),_:1}),d(p,{"Grid.Row":`4`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Vertical, Mode=OneWay}`}),d(C,{"x:Name":`cmbVerticalScrollMode`,"Grid.Row":`4`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalScrollModeName, Mode=OneWay}`,SelectedIndex:`2`,SelectionChanged:`CmbVerticalScrollMode_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Enabled, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Disabled, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Auto, Mode=OneWay}`})]),_:1}),d(p,{"Grid.Row":`5`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Center`,Text:`{x:Bind Labels.ScrollbarVisibility, Mode=OneWay}`}),d(p,{"Grid.Row":`6`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Horizontal, Mode=OneWay}`}),d(C,{"x:Name":`cmbHorizontalScrollBarVisibility`,"Grid.Row":`6`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.HorizontalScrollBarName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbHorizontalScrollBarVisibility_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Auto, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Visible, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Hidden, Mode=OneWay}`})]),_:1}),d(p,{"Grid.Row":`7`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Vertical, Mode=OneWay}`}),d(C,{"x:Name":`cmbVerticalScrollBarVisibility`,"Grid.Row":`7`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalScrollBarName, Mode=OneWay}`,SelectedIndex:`0`,SelectionChanged:`CmbVerticalScrollBarVisibility_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Auto, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Visible, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Hidden, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1}),d(T,{"x:Name":`Example2`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.VelocityHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind VelocityXaml, Mode=OneWay}`,CSharp:`{x:Bind ScrollViewCSharp, Mode=OneWay}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(S,{Spacing:`16`},{default:n(()=>[d(p,{Text:`{x:Bind Labels.VelocityNote, Mode=OneWay}`,TextWrapping:`Wrap`}),d(v,{"x:Name":`scrollView2`,Width:`400`,Height:`300`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,IsTabStop:`True`},{default:n(()=>[d(S,null,{default:n(()=>[d(x,{"AutomationProperties.Name":`{x:Bind Labels.Grapes, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/grapes.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Rainier, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/rainier.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Sunset, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/sunset.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Treetops, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/treetops.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Valley, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/valley.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Cliff, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/cliff.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1})]),_:1}),d(T.Output,null,{default:n(()=>[d(p,{Text:`{x:Bind Output2, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),d(T.Options,null,{default:n(()=>[d(r,{MinWidth:`200`,ColumnSpacing:`12`,RowSpacing:`16`},{default:n(()=>[d(r.ColumnDefinitions,null,{default:n(()=>[d(b,{Width:`Auto`}),d(b,{Width:`*`})]),_:1}),d(r.RowDefinitions,null,{default:n(()=>[d(y,{Height:`Auto`})]),_:1}),d(p,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.VerticalVelocity, Mode=OneWay}`}),d(E,{"x:Name":`nbVerticalVelocity`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.VerticalVelocityName, Mode=OneWay}`,LargeChange:`30`,Maximum:`200`,Minimum:`-200`,SmallChange:`10`,SpinButtonPlacementMode:`Inline`,ValueChanged:`NbVerticalVelocity_ValueChanged`,Value:`{x:Bind VerticalVelocityValue, Mode=TwoWay}`})]),_:1})]),_:1})]),_:1}),d(T,{"x:Name":`Example3`,class:`scrollview-example`,HeaderText:`{x:Bind Labels.AnimationHeader, Mode=OneWay}`,Theme:`{x:Bind pageTheme, Mode=OneWay}`,Xaml:`{x:Bind AnimationXaml, Mode=OneWay}`,CSharp:`{x:Bind AnimationCSharp, Mode=OneWay}`},{default:n(()=>[d(T.Example,null,{default:n(()=>[d(S,{Spacing:`16`},{default:n(()=>[d(p,{Text:`{x:Bind Labels.AnimationNote, Mode=OneWay}`,TextWrapping:`Wrap`}),d(v,{"x:Name":`scrollView3`,Width:`400`,Height:`300`,HorizontalAlignment:`Left`,VerticalAlignment:`Top`,IsTabStop:`True`,ScrollAnimationStarting:`ScrollView_ScrollAnimationStarting`},{default:n(()=>[d(S,null,{default:n(()=>[d(x,{"AutomationProperties.Name":`{x:Bind Labels.Leaves, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage1.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Carousel, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage2.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Bicycles, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage3.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Pond, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage4.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Marina, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage5.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Beach, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage6.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Rampart, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage7.jpg`,Stretch:`Uniform`}),d(x,{"AutomationProperties.Name":`{x:Bind Labels.Mountain, Mode=OneWay}`,Source:`https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/LandscapeImage8.jpg`,Stretch:`Uniform`})]),_:1})]),_:1})]),_:1})]),_:1}),d(T.Output,null,{default:n(()=>[d(p,{Text:`{x:Bind Output3, Mode=OneWay}`,TextWrapping:`Wrap`})]),_:1}),d(T.Options,null,{default:n(()=>[d(r,{MinWidth:`320`,ColumnSpacing:`12`,RowSpacing:`16`},{default:n(()=>[d(r.ColumnDefinitions,null,{default:n(()=>[d(b,{Width:`Auto`}),d(b,{Width:`*`})]),_:1}),d(r.RowDefinitions,null,{default:n(()=>[d(y,{Height:`Auto`}),d(y,{Height:`Auto`}),d(y,{Height:`Auto`})]),_:1}),d(p,{VerticalAlignment:`Center`,Text:`{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}`}),d(C,{"x:Name":`cmbVerticalAnimation`,"Grid.Column":`1`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.VerticalAnimationName, Mode=OneWay}`,SelectedIndex:`{x:Bind AnimationSelectedIndex, Mode=TwoWay}`,SelectionChanged:`cmbVerticalAnimation_SelectionChanged`},{default:n(()=>[d(e(w),{Content:`{x:Bind Labels.Default, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Accordion, Mode=OneWay}`}),d(e(w),{Content:`{x:Bind Labels.Teleportation, Mode=OneWay}`})]),_:1}),d(p,{"Grid.Row":`1`,VerticalAlignment:`Center`,Text:`{x:Bind Labels.Duration, Mode=OneWay}`}),d(E,{"x:Name":`nbAnimationDuration`,"Grid.Row":`1`,"Grid.Column":`1`,"AutomationProperties.Name":`{x:Bind Labels.DurationName, Mode=OneWay}`,LargeChange:`1000`,Maximum:`5000`,Minimum:`1000`,SmallChange:`500`,SpinButtonPlacementMode:`Inline`,ValueChanged:`nbAnimationDuration_ValueChanged`,Value:`{x:Bind AnimationDurationValue, Mode=TwoWay}`}),d(_,{"x:Name":`btnScrollWithAnimation`,"Grid.Row":`2`,"Grid.ColumnSpan":`2`,HorizontalAlignment:`Stretch`,"AutomationProperties.Name":`{x:Bind Labels.ScrollWithAnimationName, Mode=OneWay}`,Click:`BtnScrollWithAnimation_Click`,Content:`{x:Bind Labels.ScrollWithAnimation, Mode=OneWay}`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),[[`__scopeId`,`data-v-856f2c57`]]);export{j as default};