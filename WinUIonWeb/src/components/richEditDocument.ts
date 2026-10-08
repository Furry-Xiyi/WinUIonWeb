import { convertAsciiMathToLatex, convertLatexToMathMl } from 'mathlive/ssr';

const mathNamespace = 'http://www.w3.org/1998/Math/MathML';

export const linearMathToElement = (source: string): Element => {
  const latex = source.includes('\\') ? source : convertAsciiMathToLatex(source);
  const markup = convertLatexToMathMl(latex);
  const parsed = new DOMParser().parseFromString(`<math xmlns="${mathNamespace}">${markup}</math>`, 'application/xml');
  if (parsed.querySelector('parsererror')) throw new TypeError('Invalid math expression');
  const result = document.importNode(parsed.documentElement, true);
  result.setAttribute('data-linear-math', source);
  return result;
};

export const parseMathML = (source: string): Element => {
  const parsed = new DOMParser().parseFromString(source, 'application/xml');
  const root = parsed.documentElement;
  if (parsed.querySelector('parsererror') || root.localName !== 'math' || root.namespaceURI !== mathNamespace) {
    throw new TypeError('Invalid MathML');
  }
  const imported = document.createElementNS(mathNamespace, 'math');
  const copy = (from: Element, to: Element) => {
    for (const attribute of Array.from(from.attributes)) {
      if (['display', 'mathvariant', 'mathsize', 'stretchy', 'fence', 'separator', 'accent', 'accentunder', 'open', 'close', 'separators', 'columnalign', 'rowalign'].includes(attribute.localName)) to.setAttribute(attribute.localName, attribute.value);
    }
    for (const node of Array.from(from.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) to.append(node.textContent ?? '');
      else if (node instanceof Element && node.namespaceURI === mathNamespace && !['annotation-xml', 'annotation', 'maction'].includes(node.localName)) {
        const next = document.createElementNS(mathNamespace, node.localName === 'mfenced' ? 'mrow' : node.localName);
        if (node.localName === 'mfenced') { const open = document.createElementNS(mathNamespace, 'mo'); open.textContent = node.getAttribute('open') ?? '('; next.append(open); }
        copy(node, next);
        if (node.localName === 'mfenced') { const close = document.createElementNS(mathNamespace, 'mo'); close.textContent = node.getAttribute('close') ?? ')'; next.append(close); }
        to.append(next);
      }
    }
  };
  copy(root, imported);
  return imported;
};

export const loadRtf = async (source: string | ArrayBuffer): Promise<HTMLElement[]> => {
  const { RTFJS } = await import('rtf.js');
  RTFJS.loggingEnabled(false);
  const bytes = typeof source === 'string'
    ? Uint8Array.from(source, character => character.charCodeAt(0)).buffer
    : source;
  return new RTFJS.Document(bytes, {}).render();
};

const escapeRtfText = (value: string): string => Array.from(value).map(character => {
  if (character === '\\' || character === '{' || character === '}') return `\\${character}`;
  if (character === '\n') return '\\line ';
  if (character === '\t') return '\\tab ';
  return Array.from({ length: character.length }, (_, index) => {
    const code = character.charCodeAt(index);
    return code > 127 ? `\\u${code > 32767 ? code - 65536 : code}?` : character[index];
  }).join('');
}).join('');

// The browser owns the editor DOM; serialize its supported character formatting
// rather than saving HTML or writing an RTF-looking plain-text document.
export const saveRtf = (editor: HTMLElement): string => {
  const colors: string[] = [];
  const colorIndex = (color: string) => {
    if (!colors.includes(color)) colors.push(color);
    return colors.indexOf(color) + 1;
  };
  const render = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeRtfText(node.textContent ?? '');
    if (!(node instanceof HTMLElement)) return escapeRtfText(node.textContent ?? '');
    if (node.tagName === 'BR') return '\\line ';
    let prefix = '';
    const style = node.style;
    if (['B', 'STRONG'].includes(node.tagName) || style.fontWeight === 'bold' || Number(style.fontWeight) >= 600) prefix += '\\b ';
    if (['I', 'EM'].includes(node.tagName) || style.fontStyle === 'italic') prefix += '\\i ';
    if (node.tagName === 'U' || style.textDecoration.includes('underline')) prefix += '\\ul ';
    if (['S', 'STRIKE'].includes(node.tagName) || style.textDecoration.includes('line-through')) prefix += '\\strike ';
    const color = style.color || node.getAttribute('color');
    if (color) prefix += `\\cf${colorIndex(color)} `;
    if (style.fontSize) prefix += `\\fs${Math.round(parseFloat(style.fontSize) * (style.fontSize.endsWith('pt') ? 2 : 1.5))} `;
    const content = Array.from(node.childNodes).map(render).join('');
    const paragraph = ['DIV', 'P', 'LI'].includes(node.tagName) && node !== editor ? '\\par\n' : '';
    return `{${prefix}${content}}${paragraph}`;
  };
  const body = Array.from(editor.childNodes).map(render).join('');
  const table = colors.map(color => {
    const probe = document.createElement('span'); probe.style.color = color; editor.append(probe);
    const normalized = getComputedStyle(probe).color; probe.remove();
    const values = normalized.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
    return `\\red${values[0]}\\green${values[1]}\\blue${values[2]};`;
  }).join('');
  return `{\\rtf1\\ansi\\deff0\\uc1{\\fonttbl{\\f0 Segoe UI;}}{\\colortbl;${table}}\\f0\\fs21 ${body}}`;
};
