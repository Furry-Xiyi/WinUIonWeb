import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseParse, NodeTypes } from '@vue/compiler-dom'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const official = path.resolve(root, '../WinUI-Gallery/WinUIGallery/Samples')
const names = ['AutoSuggestBox', 'NumberBox', 'PasswordBox', 'RichEditBox', 'RichTextBlock', 'TextBlock', 'TextBox']
const resources = ['en-US', 'zh-CN'].map(locale => {
  const filename = path.join(root, `src/gallery/Strings/${locale}/Resources.ts`)
  const exports = {}
  Function('exports', ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports)
  return { filename, values: exports.default, additions: {} }
})
const translations = {
  'Basic AutoSuggestBox': '基本自动建议框', 'Type a control name': '输入控件名称',
  'Enter an expression:': '输入表达式：', 'Enter an integer:': '输入整数：',
  'Enter a dollar amount:': '输入美元金额：', 'NumberBox with spin button': '带微调按钮的数字框',
  'SpinButton placement': '微调按钮位置', 'Inline': '内嵌', 'Compact': '紧凑',
  'Simple PasswordBox': '简单密码框', 'Sample password box': '示例密码框',
  'simple TextBox': '简单文本框', 'customized TextBox': '自定义文本框', 'multi-line TextBox': '多行文本框',
  'simple text editor': '简单文本编辑器', 'editor with custom menu': '带自定义菜单的编辑器',
  'Custom editor': '自定义编辑器', 'Find:': '查找：', 'Enter search text': '输入搜索文本',
  'MathML Code': 'MathML 代码', 'Set sample formula': '设置示例公式',
  'I am a RichTextBlock.': '我是一个富文本块。',
  'RichTextBlock provides a rich text display container that supports': 'RichTextBlock 提供富文本显示容器，支持',
  'formatted text': '带格式的文本', 'hyperlinks': '超链接',
  ', inline images, and other rich content.': '、内嵌图片和其他富文本内容。',
  'RichTextBlock also supports a built-in overflow model.': 'RichTextBlock 还支持内置的溢出模型。',
  "Text in a TextBlock doesn't have to be a simple string.": 'TextBlock 中的文本不必是简单字符串。',
  'Text can be': '文本可以是', 'bold': '粗体', 'italic': '斜体', 'underlined': '下划线',
  ', or': '，或者', 'Text highlighting color': '文本高亮颜色',
  'Math mode enables users to have input automatically recognized and converted to math expressions while being received.': '数学模式会在输入时自动识别内容并将其转换为数学表达式。',
  'It uses': '它使用', 'Unicode Nearly Plain-Text Encoding of Mathematics': 'Unicode 近纯文本数学编码',
  ', which allows mathematical notation to be represented in a linear format and automatically converted into proper math equations.': '，以线性格式表示数学记号，并自动转换为数学公式。',
  'For example, "4^2" is converted to "4\u00b2", and "\\pi" is converted to "\u03c0".': '例如，"4^2" 会转换为 "4\u00b2"，"\\pi" 会转换为 "\u03c0"。',
  'Enabling math mode in a RichEditBox automatically switches the input font to Cambria Math. Additionally, toggling math mode clears any existing content and undo stack.': '在 RichEditBox 中启用数学模式会自动切换到 Cambria Math 字体。切换数学模式会清除现有内容和撤销历史。',
  'The': '', 'method takes a': '方法接收', 'string and displays the equation in the': '字符串，并在',
  '. It replaces any existing equation with the new one.': '中显示公式，新公式会替换现有公式。',
  'method retrieves the MathML string of the equation from the': '方法从',
  '. However, it only works if the equation is in a single line. If the text spans multiple lines, it returns an empty string, but the equation will still be rendered correctly.': '中获取公式的 MathML 字符串。公式必须位于单行；多行时返回空字符串，但公式仍会正确显示。',
  'Setting the math mode in the': '使用这些方法前，需要在',
  'is necessary to use these methods. it can be enabled using': '中设置数学模式，可通过',
  'and': '和', 'can be used to restore and save equations.': '可用于恢复和保存公式。',
  'Linked text containers allow text which does not fit in one element to overflow into a different element on the page. Creative use of linked text containers enables basic multicolumn support and other advanced page layouts.': '关联的文本容器允许一个元素容纳不下的文本溢出到页面上的另一个元素。合理使用关联容器可以实现多列文本和其他高级页面布局。'
}
const descriptions = {
  AutoSuggestBox: 'text.use-an-autosuggestbox-to-provide-a-list-of-sugge', NumberBox: 'text.the-numberbox-control-allows-users-to-enter-numb',
  PasswordBox: 'text.a-passwordbox-is-a-text-input-box-that-conceals', RichEditBox: 'text.the-richeditbox-control-lets-a-user-enter-format',
  RichTextBlock: 'sample.richtextblock.description', TextBlock: 'text.the-textblock-control-provides-flexible-text-dis', TextBox: 'text.use-a-textbox-to-let-a-user-enter-simple-text-in'
}
const headers = {
  AutoSuggestBox: ['text.a-basic-autosuggestbox','sample.autosuggestbox.search-experience'],
  NumberBox: ['text.a-numberbox-that-evaluates-expressions','sample.numberbox.spin-button','sample.numberbox.formatted-rounding'],
  PasswordBox: ['text.a-simple-passwordbox','sample.passwordbox.header-placeholder-character','sample.passwordbox.reveal-mode'],
  RichEditBox: ['text.a-simple-text-editor-with-richeditbox','sample.richeditbox.custom-command-flyout','sample.richeditbox.custom-formatting-editor','sample.richeditbox.math-mode','sample.richeditbox.mathml'],
  RichTextBlock: ['sample.richtextblock.simple','sample.richtextblock.selection-highlight','sample.richtextblock.overflow','sample.richtextblock.custom-highlighting'],
  TextBlock: ['text.a-simple-textblock','sample.textblock.style-applied','sample.textblock.properties','sample.textblock.inline-elements','sample.textblock.selectable'],
  TextBox: ['text.a-simple-textbox','sample.textbox.header-placeholder','sample.textbox.readonly-properties','sample.textbox.multiline-spellcheck-selection']
}
const extraScript = {
  TextBox: '', TextBlock: '',
  NumberBox: `const formatter = { FormatDouble: value => (Math.floor(value * 4 + 0.5) / 4).toFixed(2), ParseDouble: value => Number(value) };
const SetNumberBoxNumberFormatter = () => { controls.FormattedNumberBox.NumberFormatter = formatter; };
const SpinButtonPlacementGroup_SelectionChanged = sender => { if (controls.NumberBoxSpinButtonPlacementExample) controls.NumberBoxSpinButtonPlacementExample.SpinButtonPlacementMode = sender.SelectedIndex === 0 ? 'Inline' : 'Compact'; };`,
  PasswordBox: `const PasswordBox_PasswordChanged = sender => { passwordInvalid.value = sender.Password === 'Password'; };
const passwordInvalid = ref(false);
const PasswordMessage = computed(() => passwordInvalid.value ? t('sample.passwordbox.not-allowed') : '');
const PasswordOutputVisibility = computed(() => passwordInvalid.value ? 'Visible' : 'Collapsed');
const RevealModeCheckbox_Changed = sender => { controls.passworBoxWithRevealmode.PasswordRevealMode = sender.IsChecked ? 'Visible' : 'Hidden'; };`,
  AutoSuggestBox: `const cats = computed(() => t('TextControls.CatBreeds').split('|'));
const selectedControl = ref(null);
const suggestionOutput = ref('');
const controlData = computed(() => officialControlData.Groups.flatMap(group => group.Items).filter(item => item.IncludedInBuild !== false).map(item => ({ ...item, Title: item.Title, Subtitle: t('TextControls.Control.' + item.UniqueId), ImagePath: item.ImagePath ? 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/' + item.ImagePath.replace('ms-appx:///', '') : '' })));
const SearchControls = query => { const tokens = query.toLowerCase().split(' '); return controlData.value.filter(item => tokens.every(token => item.Title.toLowerCase().includes(token))).sort((a,b) => Number(b.Title.toLowerCase().startsWith(query.toLowerCase())) - Number(a.Title.toLowerCase().startsWith(query.toLowerCase())) || a.Title.localeCompare(b.Title)); };
const AutoSuggestBox_TextChanged = (sender,args) => { if (args.Reason !== 'UserInput') return; const tokens = sender.Text.toLowerCase().split(' '); const found = cats.value.filter(cat => tokens.every(token => cat.toLowerCase().includes(token))); sender.ItemsSource = found.length ? found : [t('text.no-results-found')]; };
const AutoSuggestBox_SuggestionChosen = (_sender,args) => { suggestionOutput.value = String(args.SelectedItem); };
const Control2_TextChanged = (sender,args) => { if(args.Reason !== 'UserInput') return; const found = SearchControls(sender.Text); sender.ItemsSource = found.length ? found : [t('text.no-results-found')]; };
const Control2_SuggestionChosen = (sender,args) => { if(args.SelectedItem && typeof args.SelectedItem === 'object') sender.Text = args.SelectedItem.Title; };
const Control2_QuerySubmitted = (sender,args) => { selectedControl.value = typeof args.ChosenSuggestion === 'object' && args.ChosenSuggestion ? args.ChosenSuggestion : SearchControls(sender.Text)[0] ?? null; };
const DetailsVisibility = computed(() => selectedControl.value ? 'Visible' : 'Collapsed');
const ControlTitleText = computed(() => selectedControl.value?.Title ?? '');
const ControlSubtitleText = computed(() => selectedControl.value?.Subtitle ?? '');
const ControlImageSource = computed(() => selectedControl.value?.ImagePath ?? '');`,
  RichTextBlock: `const HighlightColorCombobox_SelectionChanged = sender => { controls.TextHighlightingRichTextBlock?.TextHighlighters.Clear(); controls.TextHighlightingRichTextBlock?.TextHighlighters.Add({ Background: ['Yellow','Red','Blue'][sender.SelectedIndex] ?? 'Yellow', Ranges: [{ StartIndex: 28, Length: 11 }] }); };`,
  RichEditBox: `const OpenButton_Click = () => fileInput.value?.click();
const fileInput = ref(null);
const OpenFile = async event => { const file = event.target.files?.[0]; if(file) controls.editor.Document.SetText('None', await file.text()); event.target.value = ''; };
const SaveButton_Click = () => { const blob = new Blob([controls.editor.Document.GetText('None')], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'document.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
const BoldButton_Click = () => { controls.editor.Document.Selection.CharacterFormat.Bold = 'Toggle'; };
const ItalicButton_Click = () => { controls.editor.Document.Selection.CharacterFormat.Italic = 'Toggle'; };
const ColorButton_Click = sender => { controls.editor.Document.Selection.CharacterFormat.ForegroundColor = sender.Content?.Fill ?? sender.CommandParameter; controls.fontColorButton.Flyout.Hide(); controls.editor.Focus('Keyboard'); };
const FindBoxHighlightMatches = () => controls.editor?.Document.HighlightText(controls.findBox?.Text ?? '');
const FindBoxRemoveHighlights = () => controls.editor?.Document.HighlightText('');
const Editor_GotFocus = () => {};
const Editor_TextChanged = () => {};
const REBCustom_Loaded = sender => { sender.SelectionFlyout.AddFormattingCommand('strikethrough', t('TextControls.Strikethrough')); };
const REBCustom_Unloaded = () => {};
const MathmlCode = ref('');
const mathEditor2_TextChanged = sender => { MathmlCode.value = sender.Document.GetMathML() || t('TextControls.NoMathML'); };
const SetMathmlFormulaBtn_Click = () => { controls.mathEditor2.Document.SetMathML('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi><mo>\u2208</mo><mi>P</mi><mfenced><mi>A</mi></mfenced><mo>\u2194</mo><mi>x</mi><mo>\u2286</mo><mi>A</mi></math>'); };`
}
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')
for (const name of names) {
  let nextLabel = 0, example = 0
  const labels = { Title: `text.${name.toLowerCase()}`, Description: descriptions[name], ToggleTheme: 'gallery.page-header.toggle-theme' }
  const localize = text => {
    const clean = text.replace(/\s+/g,' ').trim()
    if (!clean) return ''
    let key = Object.keys(resources[0].values).find(key => resources[0].values[key] === clean)
    if (!key) {
      key = `TextControls.${name}.Label${++nextLabel}`
      resources[0].additions[key] = clean
      resources[1].additions[key] = translations[clean] ?? clean
    }
    const label = `Text${Object.keys(labels).length}`
    labels[label] = key
    return `{x:Bind Labels.${label}, Mode=OneWay}`
  }
  const tree = baseParse(fs.readFileSync(path.join(official,name,`${name}Page.xaml`),'utf8'), { isNativeTag: () => true })
  const page = tree.children.find(node => node.type === NodeTypes.ELEMENT)
  const sampleImports = []
  const serialize = (node, depth = 0) => {
    const indent = '  '.repeat(depth)
    if (node.type === NodeTypes.COMMENT) return ''
    if (node.type === NodeTypes.TEXT) {
      const binding = localize(node.content)
      return binding ? `${indent}<Run Text="${escape(binding)}" />` : ''
    }
    if(node.type !== NodeTypes.ELEMENT) return ''
    const tag = node.tag.replace(/^controls:/,'')
    if (tag === 'ControlExample.Resources') return ''
    let attrs = node.props.filter(prop => prop.type === NodeTypes.ATTRIBUTE).map(prop => ({ name: prop.name, value: prop.value?.content ?? '' }))
    attrs = attrs.filter(prop => !['xmlns','xmlns:x','xmlns:controls','xmlns:d','xmlns:mc','mc:Ignorable','x:Class'].includes(prop.name))
    for(const attr of attrs) {
      if (attr.name === 'Name') attr.name = 'x:Name'
      if (['Text','Header','Content','PlaceholderText','AutomationProperties.Name','ToolTipService.ToolTip'].includes(attr.name) && !attr.value.startsWith('{') && !(tag === 'Setter')) attr.value = localize(attr.value)
    }
    if (tag === 'ControlExample') {
      const index = example++
      const sample = attrs.find(prop => prop.name === 'SampleDefinition').value
      const destination = path.join(root,'src/gallery/samples',...sample.split('\\'))
      fs.mkdirSync(path.dirname(destination),{recursive:true})
      fs.copyFileSync(path.join(official,...sample.split('\\')),destination)
      sampleImports.push(`import Sample${index} from '../samples/${sample.replaceAll('\\','/')}?raw';`)
      labels[`Header${index}`] = headers[name][index]
      attrs.push({ name:'HeaderText',value:`{x:Bind Labels.Header${index}, Mode=OneWay}` },{ name:'Theme',value:'{x:Bind pageTheme, Mode=OneWay}' },{name:'Xaml',value:`{x:Bind Sources[${index}].Xaml}`},{name:'CSharp',value:`{x:Bind Sources[${index}].CSharp}`})
      const properties = node.children.filter(child => child.type === NodeTypes.ELEMENT && child.tag.startsWith('controls:ControlExample.'))
      const content = node.children.filter(child => !(child.type === NodeTypes.ELEMENT && child.tag.startsWith('controls:ControlExample.')))
      const exampleProperty = properties.find(child => child.tag === 'controls:ControlExample.Example')
      const children = exampleProperty ? exampleProperty.children : content
      const options = properties.find(child => child.tag === 'controls:ControlExample.Options')
      return `${indent}<ControlExample ${attrs.map(attr => `${attr.name}="${escape(attr.value)}"`).join(' ')}>\n${indent}  <ControlExample.Example>\n${children.map(child => serialize(child,depth+2)).filter(Boolean).join('\n')}\n${indent}  </ControlExample.Example>\n${indent}  <ControlExample.Output />\n${options ? serialize(options,depth+1) : indent+'  <ControlExample.Options />'}\n${properties.filter(child => child.tag === 'controls:ControlExample.Substitutions').map(child => serialize(child,depth+1)).join('\n')}\n${indent}</ControlExample>`
    }
    const getName = () => attrs.find(attr => attr.name === 'x:Name')?.value
    const set = (property,value) => { attrs = attrs.filter(attr => attr.name !== property); attrs.push({ name:property,value }) }
    if(name === 'PasswordBox' && getName() === 'Control1Output') { set('Text','{x:Bind PasswordMessage, Mode=OneWay}'); set('Visibility','{x:Bind PasswordOutputVisibility, Mode=OneWay}') }
    if(name === 'AutoSuggestBox') {
      if(getName() === 'SuggestionOutput') set('Text','{x:Bind suggestionOutput, Mode=OneWay}')
      if(getName() === 'ControlDetails') set('Visibility','{x:Bind DetailsVisibility, Mode=OneWay}')
      if(getName() === 'ControlTitle') set('Text','{x:Bind ControlTitleText, Mode=OneWay}')
      if(getName() === 'ControlSubtitle') set('Text','{x:Bind ControlSubtitleText, Mode=OneWay}')
      if(getName() === 'ControlImage') set('Source','{x:Bind ControlImageSource, Mode=OneWay}')
    }
    if(name === 'NumberBox' && getName() === 'FormattedNumberBox') set('Loaded','SetNumberBoxNumberFormatter')
    if(name === 'RichEditBox' && tag === 'SampleCodePresenter') { set('Code','{x:Bind MathmlCode, Mode=OneWay}'); node.children = [] }
    if(name === 'RichEditBox' && tag === 'Button' && node.children.some(child => child.type===NodeTypes.ELEMENT && child.tag==='Button.Content' && child.children.some(grandchild => grandchild.tag==='Rectangle'))) {
      const rectangle = node.children.find(child => child.tag==='Button.Content').children.find(child => child.tag==='Rectangle')
      set('CommandParameter', rectangle.props.find(prop => prop.name==='Fill').value.content)
    }
    const attributeText = attrs.map(attr => `${attr.name}="${escape(attr.value)}"`).join(' ')
    const children = node.children.map(child => serialize(child,depth+1)).filter(Boolean)
    if(!children.length) return `${indent}<${tag}${attributeText ? ' '+attributeText : ''} />`
    return `${indent}<${tag}${attributeText ? ' '+attributeText : ''}>\n${children.join('\n')}\n${indent}</${tag}>`
  }
  const content = page.children.filter(child => child.type === NodeTypes.ELEMENT && child.tag !== 'Page.Resources').map(child => serialize(child,4)).join('\n')
  const pageResources = page.children.find(child => child.tag==='Page.Resources')
  const imports = ['Button','ToggleButton','FontIcon','ControlExample','Page','ScrollViewer','StackPanel','Grid','RowDefinition','ColumnDefinition','TextBlock','TextBox','AutoSuggestBox','NumberBox','PasswordBox','RichEditBox','RichTextBlock','RelativePanel','Image','RadioButtons','RadioButton','ToggleSwitch','CheckBox','ComboBox','DropDownButton','Flyout','VariableSizedWrapGrid','Rectangle','SymbolIcon','RichTextBlockOverflow','SampleCodePresenter'].map(control => `import ${control} from '../../components/${control}.vue';`)
  const code = `<template>
  <Page>
${pageResources ? serialize(pageResources,2) : ''}
    <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
      <StackPanel class="gallery-item-page">
        <StackPanel class="page-heading">
          <TextBlock class="page-header" Text="{x:Bind Labels.Title, Mode=OneWay}" FontSize="28" FontWeight="SemiBold" />
          <TextBlock class="page-description" Text="{x:Bind Labels.Description, Mode=OneWay}" TextWrapping="WrapWholeWords" />
          <StackPanel class="page-header-actions" Orientation="Horizontal" Spacing="4">
            <Button Click="toggleTheme" ToolTipService.ToolTip="{x:Bind Labels.ToggleTheme, Mode=OneWay}" AutomationProperties.Name="{x:Bind Labels.ToggleTheme, Mode=OneWay}"><FontIcon Glyph="&#xE793;" FontSize="16" /></Button>
            <ToggleButton IsChecked="{x:Bind isFavoriteState, Mode=OneWay}" Click="toggleFavorite" ToolTipService.ToolTip="{x:Bind FavoriteLabel, Mode=OneWay}" AutomationProperties.Name="{x:Bind FavoriteLabel, Mode=OneWay}"><FontIcon Glyph="{x:Bind FavoriteGlyph, Mode=OneWay}" FontSize="16" /></ToggleButton>
          </StackPanel>
        </StackPanel>
        <StackPanel class="gallery-page-content">
${content}
        </StackPanel>
      </StackPanel>
    </ScrollViewer>
${name === 'RichEditBox' ? '    <input ref="fileInput" type="file" accept=".txt,.rtf" hidden @change="OpenFile" />' : ''}
  </Page>
</template>

<script setup>
import { computed, inject, provide, ref, shallowReactive } from 'vue';
${imports.join('\n')}
import { Run, Span, Bold, Italic, Underline, LineBreak, Hyperlink, Paragraph } from '../../components/TextInline';
import { ComboBoxItem, XamlString } from '../../components/ComboBox.vue';
import { ControlExampleSubstitution } from '../../components/ControlExampleProperties';
import { XamlStyle as Style, XamlSetter as Setter } from '../../components/CollectionProperties';
import { ResourceDictionary } from '../../components/xamlPrimitives';
import { xamlNameScopeKey, xamlScopeKey } from '../../components/xamlRuntime';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';
${name === 'AutoSuggestBox' ? "import officialControlData from '../samples/AutoSuggestBox/ControlInfoData.json';" : ''}
${sampleImports.join('\n')}
const { t } = useI18n();
const currentPage = inject('currentPage');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(currentPage?.value || '${name.toLowerCase()}');
const controls = shallowReactive({});
provide(xamlNameScopeKey, controls);
const Labels = computed(() => ({ ${Object.entries(labels).map(([key,value]) => `${key}: t('${value}')`).join(', ')} }));
const FavoriteLabel = computed(() => t(isFavoriteState.value ? 'gallery.remove-favorite' : 'gallery.add-favorite'));
const FavoriteGlyph = computed(() => isFavoriteState.value ? '\\uE735' : '\\uE734');
const Sources = [${sampleImports.map((_,i)=>`Sample${i}`).join(',')}].map(sample => ({ Xaml: sample.split(/^--- xaml\\r?\\n/m)[1]?.split(/^--- c#/m)[0]?.trim() ?? '', CSharp: sample.split(/^--- c#\\r?\\n/m)[1]?.trim() ?? '' }));
${extraScript[name]}
${name === 'RichEditBox' ? "onMounted(() => { controls.MathEditor.Document.SetMathMode('MathOnly'); controls.mathEditor2.Document.SetMathMode('MathOnly'); MathmlCode.value = t('TextControls.NoMathML'); });" : ''}
provide(xamlScopeKey, { Labels, FavoriteLabel, FavoriteGlyph, isFavoriteState, pageTheme, Sources, toggleTheme, toggleFavorite });
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { margin: 0 80px 8px 0; }
.page-description { margin: 0 0 16px; color: var(--text-secondary); }
.page-header-actions { position: absolute; top: 0; right: 0; }
.gallery-page-content { min-width: 0; }
</style>
`
  fs.writeFileSync(path.join(root,`src/gallery/pages/${name}Page.vue`), code.replace("computed, inject, provide, ref, shallowReactive", "computed, inject, onMounted, provide, ref, shallowReactive"))
}
const catSource = fs.readFileSync(path.join(official,'AutoSuggestBox/AutoSuggestBoxPage.xaml.cs'),'utf8')
const cats = [...catSource.split('private List<string> Cats')[1].split('public AutoSuggestBoxPage')[0].matchAll(/"([^"]+)"/g)].map(match => match[1])
resources[0].additions['TextControls.CatBreeds'] = cats.join('|')
resources[1].additions['TextControls.CatBreeds'] = cats.join('|')
resources[0].additions['TextControls.NoMathML'] = '<!-- No MathML content -->'
resources[1].additions['TextControls.NoMathML'] = '<!-- 暂无 MathML 内容 -->'
resources[0].additions['TextControls.Strikethrough'] = 'Strikethrough'
resources[1].additions['TextControls.Strikethrough'] = '删除线'
const data = JSON.parse(fs.readFileSync(path.resolve(official,'../SampleSupport/Data/ControlInfoData.json'),'utf8'))
fs.writeFileSync(path.join(root,'src/gallery/samples/AutoSuggestBox/ControlInfoData.json'), JSON.stringify(data,null,2)+'\n')
for(const group of data.Groups) for(const item of group.Items) {
  const key = 'TextControls.Control.' + item.UniqueId
  resources[0].additions[key] = item.Subtitle ?? ''
  const old = Object.keys(resources[0].values).find(key => resources[0].values[key] === item.Subtitle)
  resources[1].additions[key] = old ? resources[1].values[old] : item.Subtitle ?? ''
}
for(const resource of resources) {
  const source = fs.readFileSync(resource.filename,'utf8')
  fs.writeFileSync(resource.filename, source.replace('export default {','export default {\n'+Object.entries(resource.additions).map(([key,value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n')))
}
console.log('Migrated seven official text-control Gallery pages and sample sources.')
