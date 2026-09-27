// WinUI-Gallery uses ColorCode 2.0.15 (standalone.props). Scope names and
// rules here follow its Languages/Xml.cs and Languages/CSharp.cs. Text is
// emitted as Vue text nodes, never interpreted as HTML.
export interface SampleCodeToken { text: string; scope: string }

const append = (tokens: SampleCodeToken[], text: string, scope = '') => {
  if (!text) return
  const previous = tokens.at(-1)
  if (previous?.scope === scope) previous.text += text
  else tokens.push({ text, scope })
}

const xmlTokens = (source: string) => {
  const tokens: SampleCodeToken[] = []
  let index = 0
  while (index < source.length) {
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4)
      const next = end < 0 ? source.length : end + 3
      append(tokens, source.slice(index, next), 'htmlComment'); index = next; continue
    }
    if (source.startsWith('<![CDATA[', index)) {
      const end = source.indexOf(']]>', index + 9)
      append(tokens, '<![CDATA[', 'xmlDelimiter')
      append(tokens, source.slice(index + 9, end < 0 ? source.length : end), 'xmlCDataSection')
      if (end >= 0) append(tokens, ']]>', 'xmlDelimiter')
      index = end < 0 ? source.length : end + 3; continue
    }
    if (source[index] === '<' && /[A-Za-z!?/]/.test(source[index + 1] ?? '')) {
      const opener = source.slice(index).match(/^<(?:[!?/])?/)![0]
      append(tokens, opener, 'xmlDelimiter'); index += opener.length
      const name = source.slice(index).match(/^[\w:.-]+/)?.[0] ?? ''
      for (const part of name.split(/(:)/)) append(tokens, part, part === ':' ? 'xmlDelimiter' : 'xmlName')
      index += name.length
      while (index < source.length) {
        const remaining = source.slice(index)
        const close = remaining.match(/^(?:\/?|\?)>/)?.[0]
        if (close) { append(tokens, close, 'xmlDelimiter'); index += close.length; break }
        const whitespace = remaining.match(/^\s+/)?.[0]
        if (whitespace) { append(tokens, whitespace); index += whitespace.length; continue }
        if (source[index] === '=') { append(tokens, '=', 'xmlDelimiter'); index += 1; continue }
        const quote = source[index]
        if (quote === '"' || quote === "'") {
          append(tokens, quote, 'xmlAttributeQuotes')
          const end = source.indexOf(quote, index + 1)
          append(tokens, source.slice(index + 1, end < 0 ? source.length : end), 'xmlAttributeValue')
          if (end >= 0) append(tokens, quote, 'xmlAttributeQuotes')
          index = end < 0 ? source.length : end + 1; continue
        }
        const attribute = remaining.match(/^[\w:.-]+/)?.[0]
        if (attribute) { append(tokens, attribute, 'xmlAttribute'); index += attribute.length; continue }
        append(tokens, source[index]!); index += 1
      }
      continue
    }
    const entity = source[index] === '&' ? source.slice(index).match(/^&[a-z0-9]+?;/i)?.[0] : undefined
    if (entity) { append(tokens, entity, 'xmlAttribute'); index += entity.length; continue }
    append(tokens, source[index]!); index += 1
  }
  return tokens
}

const keywords = new Set('abstract as ascending base bool break by byte case catch char checked class const continue decimal default delegate descending do double dynamic else enum equals event explicit extern false finally fixed float for foreach from get goto group if implicit in int into interface internal is join let lock long namespace new null object on operator orderby out override params partial private protected public readonly ref return sbyte sealed select set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile where while yield async await warning disable'.split(' '))
const csharpTokens = (source: string) => {
  const tokens: SampleCodeToken[] = []
  const patterns = /\/\*[\s\S]*?(?:\*\/|$)|\/\/\/[^\r\n]*|\/\/[^\r\n]*|@"(?:""|[^"])*"|"(?:\\[^]|[^"\\])*"|'(?:\\[^]|[^'\\])*'|^[ \t]*#(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b|\b[A-Za-z_]\w*\b|\b[0-9]+\b/gm
  let index = 0
  for (const match of source.matchAll(patterns)) {
    append(tokens, source.slice(index, match.index))
    const text = match[0]
    if (text.startsWith('///')) {
      const tag = /<[^>]*>/g
      append(tokens, '///', 'xmlDocTag')
      let offset = 3
      for (const child of text.matchAll(tag)) {
        append(tokens, text.slice(offset, child.index), 'xmlDocComment')
        append(tokens, child[0], 'xmlDocTag'); offset = child.index! + child[0].length
      }
      append(tokens, text.slice(offset), 'xmlDocComment')
    } else if (text.startsWith('//') || text.startsWith('/*')) append(tokens, text, 'comment')
    else if (text.startsWith('@"')) append(tokens, text, 'stringCSharpVerbatim')
    else if (text.startsWith('"') || text.startsWith("'")) append(tokens, text, 'string')
    else if (text.trimStart().startsWith('#')) {
      const prefix = text.length - text.trimStart().length
      append(tokens, text.slice(0, prefix)); append(tokens, text.slice(prefix), 'preprocessorKeyword')
    } else append(tokens, text, keywords.has(text) ? 'keyword' : /^[0-9]+$/.test(text) ? 'number' : '')
    index = match.index! + text.length
  }
  append(tokens, source.slice(index))
  return tokens
}

export const tokenizeSampleCode = (source: string, type: string): SampleCodeToken[] => {
  const language = type.toLowerCase()
  if (language === 'xaml' || language === 'xml') return xmlTokens(source)
  if (language === 'csharp' || language === 'c#' || language === 'cs') return csharpTokens(source)
  return [{ text: source, scope: '' }]
}
