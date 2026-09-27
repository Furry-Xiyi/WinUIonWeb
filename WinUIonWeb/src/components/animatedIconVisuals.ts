import { defineComponent, type Component } from 'vue';
import visualData from './animatedIconVisualData.json';

type Reference = { ref: number };
type Value = number | boolean | string | Value[] | Reference;
interface Keyframe {
  at: number;
  value?: Value;
  expression?: string;
  easing?: Reference;
}
interface CompositionRecord {
  id: number;
  type: string;
  props?: Record<string, Value>;
  animations?: Record<string, Reference>;
  children?: Reference[];
  geometry?: Reference;
  points?: number[];
  expression?: string;
  frames?: Keyframe[];
  commands?: Array<Array<string | number>>;
  fillRule?: string;
  references?: Record<string, Reference>;
}
interface VisualData {
  duration: number;
  frameCount: number;
  framerate: number;
  size: number[];
  markers: Record<string, number>;
  root: Reference;
  records: CompositionRecord[];
}

export const animatedIconVisualSourceNames = [
  'AnimatedAcceptVisualSource',
  'AnimatedBackVisualSource',
  'AnimatedChevronDownSmallVisualSource',
  'AnimatedChevronRightDownSmallVisualSource',
  'AnimatedChevronUpDownSmallVisualSource',
  'AnimatedFindVisualSource',
  'AnimatedGlobalNavigationButtonVisualSource',
  'AnimatedSettingsVisualSource',
] as const;
export type AnimatedIconVisualSourceName = typeof animatedIconVisualSourceNames[number];

export interface AnimatedIconVisualSource {
  name: AnimatedIconVisualSourceName;
  duration: number;
  size: { width: number; height: number };
  markers: Readonly<Record<string, number>>;
  Foreground?: string;
  render(progress: number, foreground?: string): string;
  FrameCount(): number;
  Framerate(): number;
  FrameToProgress(frame: number): number;
  SetColorProperty(propertyName: string, value: string): void;
}

type NumericValue = number | NumericValue[];
type ExpressionNode = number | { variable: string } | { operator: string; left: ExpressionNode; right: ExpressionNode } | { call: string; args: ExpressionNode[] };
const expressionCache = new Map<string, ExpressionNode>();
const defaultProperties: Record<string, Value> = {
  Offset: [0, 0], CenterPoint: [0, 0], Scale: [1, 1], Opacity: 1,
  RotationAngle: 0, RotationAngleInDegrees: 0, IsVisible: true,
  StrokeThickness: 1, StrokeMiterLimit: 10, TrimStart: 0, TrimEnd: 1, TrimOffset: 0,
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const numeric = (value: Value | undefined, fallback = 0) => typeof value === 'number' ? value : fallback;
const vector = (value: Value | undefined, fallback: number[]) => Array.isArray(value) ? value.map(item => numeric(item)) : fallback;
const format = (value: number) => Number(value.toFixed(7));
const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function combine(left: NumericValue, right: NumericValue, operation: (a: number, b: number) => number): NumericValue {
  if (Array.isArray(left)) return left.map((value, index) => combine(value, Array.isArray(right) ? right[index]! : right, operation));
  if (Array.isArray(right)) return right.map(value => combine(left, value, operation));
  return operation(left, right);
}

function parseExpression(expression: string): ExpressionNode {
  const cached = expressionCache.get(expression);
  if (cached !== undefined) return cached;
  const tokens = expression.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z_]\w*(?:\.\w+)*|[()+*\/,\-]/g) ?? [];
  if (tokens.join('') !== expression.replace(/\s/g, '')) throw new Error(`Unsupported official animation expression: ${expression}`);
  let position = 0;
  const primary = (): ExpressionNode => {
    const token = tokens[position++];
    if (token === undefined) throw new Error(`Incomplete official animation expression: ${expression}`);
    if (token === '-') return { operator: '-', left: 0, right: primary() };
    if (token === '(') {
      const result = sum();
      if (tokens[position++] !== ')') throw new Error(`Invalid official animation expression: ${expression}`);
      return result;
    }
    if (/^(?:\d|\.)/.test(token)) return Number(token);
    if (tokens[position] !== '(') return { variable: token };
    position++;
    const args: ExpressionNode[] = [];
    if (tokens[position] !== ')') {
      do {
        args.push(sum());
        if (tokens[position] !== ',') break;
        position++;
      } while (position < tokens.length);
    }
    if (tokens[position++] !== ')') throw new Error(`Invalid official animation function: ${expression}`);
    return { call: token, args };
  };
  const product = (): ExpressionNode => {
    let left = primary();
    while (tokens[position] === '*' || tokens[position] === '/') {
      const operator = tokens[position++]!;
      left = { operator, left, right: primary() };
    }
    return left;
  };
  const sum = (): ExpressionNode => {
    let left = product();
    while (tokens[position] === '+' || tokens[position] === '-') {
      const operator = tokens[position++]!;
      left = { operator, left, right: product() };
    }
    return left;
  };
  const parsed = sum();
  if (position !== tokens.length) throw new Error(`Unsupported official animation expression: ${expression}`);
  expressionCache.set(expression, parsed);
  return parsed;
}

function evaluateExpression(node: ExpressionNode, variable: (name: string) => NumericValue): NumericValue {
  if (typeof node === 'number') return node;
  if ('variable' in node) return variable(node.variable);
  if ('operator' in node) {
    const left = evaluateExpression(node.left, variable);
    const right = evaluateExpression(node.right, variable);
    switch (node.operator) {
      case '+': return combine(left, right, (a, b) => a + b);
      case '-': return combine(left, right, (a, b) => a - b);
      case '*': return combine(left, right, (a, b) => a * b);
      case '/': return combine(left, right, (a, b) => a / b);
    }
  }
  if ('call' in node) {
    const args = node.args.map(argument => evaluateExpression(argument, variable));
    if (/^Vector[234]$/.test(node.call)) return args as number[];
    if (node.call === 'Pow') return combine(args[0]!, args[1]!, Math.pow);
    if (node.call === 'Square') return combine(args[0]!, args[0]!, (a, b) => a * b);
    if (node.call === 'Min') return combine(args[0]!, args[1]!, Math.min);
    if (node.call === 'Max') return combine(args[0]!, args[1]!, Math.max);
    if (node.call === 'Lerp') return combine(args[0]!, combine(combine(args[1]!, args[0]!, (a, b) => a - b), args[2]!, (a, b) => a * b), (a, b) => a + b);
    throw new Error(`Unsupported official animation function: ${node.call}`);
  }
  throw new Error('Invalid official animation expression');
}

function bezier(value: number, points: number[]): number {
  const [x1, y1, x2, y2] = points as [number, number, number, number];
  const coordinate = (t: number, first: number, second: number) => 3 * (1 - t) ** 2 * t * first + 3 * (1 - t) * t ** 2 * second + t ** 3;
  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 30; iteration++) {
    const midpoint = (low + high) / 2;
    if (coordinate(midpoint, x1, x2) < value) low = midpoint;
    else high = midpoint;
  }
  return coordinate((low + high) / 2, y1, y2);
}

function createSampler(data: VisualData, progress: number) {
  const cache = new Map<string, Value>();
  const active = new Set<string>();
  const records = data.records;
  const property = (reference: Reference, name: string): Value => {
    const key = `${reference.ref}:${name}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    if (active.has(key)) throw new Error(`Circular official animation property: ${key}`);
    active.add(key);
    const record = records[reference.ref]!;
    let result: Value = name === 'Progress' && reference.ref === data.root.ref ? progress : record.props?.[name] ?? defaultProperties[name] ?? 0;
    const animation = record.animations?.[name];
    if (animation) result = sampleAnimation(animation, result);
    const scalarAxes: Record<string, number> = { X: 0, Y: 1, Z: 2, W: 3 };
    if (Array.isArray(result)) {
      result = [...result];
      for (const [axis, index] of Object.entries(scalarAxes)) {
        const axisAnimation = record.animations?.[`${name}.${axis}`];
        if (axisAnimation) result[index] = sampleAnimation(axisAnimation, result[index] ?? 0);
      }
    }
    active.delete(key);
    cache.set(key, result);
    return result;
  };
  const expression = (text: string, animation: CompositionRecord): Value => evaluateExpression(parseExpression(text), name => {
    const [parameter, propertyName, axis] = name.split('.');
    const target = animation.references?.[parameter!] ?? data.root;
    const value = property(target, propertyName!);
    if (axis) return numeric(Array.isArray(value) ? value[{ X: 0, Y: 1, Z: 2, W: 3 }[axis] ?? 0] : value);
    return value as NumericValue;
  }) as Value;
  const frameValue = (frame: Keyframe, animation: CompositionRecord): Value => frame.expression === undefined ? frame.value! : expression(frame.expression, animation);
  const sampleAnimation = (reference: Reference, initial: Value): Value => {
    const animation = records[reference.ref]!;
    const frames = animation.frames ?? [];
    if (animation.type === 'BooleanKeyFrameAnimation') {
      let result = initial;
      for (const frame of frames) if (progress >= frame.at) result = frameValue(frame, animation);
      return result;
    }
    let left: Keyframe = { at: 0, value: initial };
    for (const right of frames) {
      if (progress >= right.at) {
        left = right;
        continue;
      }
      const start = frameValue(left, animation);
      const end = frameValue(right, animation);
      let fraction = clamp((progress - left.at) / (right.at - left.at));
      if (right.easing) {
        const easing = records[right.easing.ref]!;
        if (easing.type === 'CubicBezierEasingFunction') fraction = bezier(fraction, easing.points!);
        else if (easing.type === 'StepEasingFunction') fraction = easing.props?.IsInitialStepSingleFrame ? (fraction > 0 ? 1 : 0) : (fraction >= 1 ? 1 : 0);
        else throw new Error(`Unsupported official easing: ${easing.type}`);
      }
      return combine(start as NumericValue, end as NumericValue, (a, b) => a + (b - a) * fraction) as Value;
    }
    return frameValue(left, animation);
  };
  return { property, records };
}

type Matrix = [number, number, number, number, number, number];
function multiply(left: Matrix, right: Matrix): Matrix {
  return [
    left[0] * right[0] + left[2] * right[1], left[1] * right[0] + left[3] * right[1],
    left[0] * right[2] + left[2] * right[3], left[1] * right[2] + left[3] * right[3],
    left[0] * right[4] + left[2] * right[5] + left[4], left[1] * right[4] + left[3] * right[5] + left[5],
  ];
}

function renderVisual(data: VisualData, progress: number, foreground: string): string {
  const { property, records } = createSampler(data, clamp(progress));
  const paint = escapeAttribute(foreground);
  const transform = (reference: Reference) => {
    const center = vector(property(reference, 'CenterPoint'), [0, 0]);
    const offset = vector(property(reference, 'Offset'), [0, 0]);
    const scale = vector(property(reference, 'Scale'), [1, 1]);
    const record = records[reference.ref]!;
    const degrees = record.props?.RotationAngleInDegrees !== undefined || record.animations?.RotationAngleInDegrees !== undefined;
    const angle = degrees ? numeric(property(reference, 'RotationAngleInDegrees')) * Math.PI / 180 : numeric(property(reference, 'RotationAngle'));
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const x = center[0]!;
    const y = center[1]!;
    let matrix: Matrix = [cosine * scale[0]!, sine * scale[0]!, -sine * scale[1]!, cosine * scale[1]!, 0, 0];
    matrix[4] = offset[0]! + x - matrix[0] * x - matrix[2] * y;
    matrix[5] = offset[1]! + y - matrix[1] * x - matrix[3] * y;
    const custom = record.props?.TransformMatrix;
    if (Array.isArray(custom)) {
      const values = vector(custom, []);
      const converted = values.length === 16 ? [values[0], values[1], values[4], values[5], values[12], values[13]] : values;
      matrix = multiply(matrix, converted as Matrix);
    }
    return `matrix(${matrix.map(format).join(' ')})`;
  };
  const geometryMarkup = (reference: Reference, attributes: string): string => {
    const geometry = records[reference.ref]!;
    if (geometry.type === 'PathGeometry') return geometryMarkup(geometry.geometry!, attributes);
    if (geometry.type === 'Geometry') return `<path d="${geometry.commands!.map(command => command.map(value => typeof value === 'number' ? format(value) : value).join(' ')).join(' ')}" fill-rule="${geometry.fillRule}" ${attributes}/>`;
    if (geometry.type === 'EllipseGeometry') {
      const radius = vector(property(reference, 'Radius'), [0, 0]);
      const center = vector(property(reference, 'Center'), [0, 0]);
      return `<ellipse cx="${format(center[0]!)}" cy="${format(center[1]!)}" rx="${format(radius[0]!)}" ry="${format(radius[1]!)}" ${attributes}/>`;
    }
    if (geometry.type === 'RectangleGeometry' || geometry.type === 'RoundedRectangleGeometry') {
      const offset = vector(property(reference, 'Offset'), [0, 0]);
      const size = vector(property(reference, 'Size'), [0, 0]);
      const radius = vector(property(reference, 'CornerRadius'), [0, 0]);
      return `<rect x="${format(offset[0]!)}" y="${format(offset[1]!)}" width="${format(size[0]!)}" height="${format(size[1]!)}" rx="${format(radius[0]!)}" ry="${format(radius[1]!)}" ${attributes}/>`;
    }
    throw new Error(`Unsupported official animation geometry: ${geometry.type}`);
  };
  const render = (reference: Reference): string => {
    const record = records[reference.ref]!;
    if (property(reference, 'IsVisible') === false) return '';
    const opacity = numeric(property(reference, 'Opacity'), 1);
    if (opacity <= 0) return '';
    const attributes = `transform="${transform(reference)}"${opacity === 1 ? '' : ` opacity="${format(opacity)}"`}`;
    if (record.type === 'SpriteShape') {
      const geometry = record.geometry!;
      const fill = record.props?.FillBrush ? paint : 'none';
      const stroke = record.props?.StrokeBrush ? paint : 'none';
      const thickness = numeric(property(reference, 'StrokeThickness'), 1);
      const linecap = { Round: 'round', Square: 'square', Flat: 'butt' }[String(record.props?.StrokeStartCap)] ?? 'butt';
      const linejoin = { Round: 'round', Bevel: 'bevel', Miter: 'miter' }[String(record.props?.StrokeLineJoin)] ?? 'miter';
      const miterLimit = numeric(property(reference, 'StrokeMiterLimit'), 1);
      const start = numeric(property(geometry, 'TrimStart'));
      const end = numeric(property(geometry, 'TrimEnd'), 1);
      const trimOffset = numeric(property(geometry, 'TrimOffset'));
      const trimmed = start !== 0 || end !== 1 || trimOffset !== 0;
      const length = clamp(end - start);
      if (trimmed && length === 0 && fill === 'none') return '';
      // A two-path-length period keeps a previous round-capped dash from wrapping onto the path start.
      const dash = trimmed ? ` pathLength="1" stroke-dasharray="${format(length)} ${format(2 - length)}" stroke-dashoffset="${format(-start - trimOffset)}"` : '';
      return geometryMarkup(geometry, `${attributes} fill="${fill}" stroke="${stroke}" stroke-width="${format(thickness)}" stroke-linecap="${linecap}" stroke-linejoin="${linejoin}" stroke-miterlimit="${format(miterLimit)}"${dash}`);
    }
    const children = (record.children ?? []).map(render).join('');
    if (record.props?.Clip && record.props?.Size) {
      const size = vector(property(reference, 'Size'), data.size);
      return `<g ${attributes}><svg width="${format(size[0]!)}" height="${format(size[1]!)}" viewBox="0 0 ${format(size[0]!)} ${format(size[1]!)}" overflow="hidden">${children}</svg></g>`;
    }
    return `<g ${attributes}>${children}</g>`;
  };
  return render(data.root);
}

const definitions = visualData as unknown as Record<AnimatedIconVisualSourceName, VisualData>;
export function createAnimatedIconSource(name: string): AnimatedIconVisualSource | undefined {
  if (!Object.prototype.hasOwnProperty.call(definitions, name)) return undefined;
  const sourceName = name as AnimatedIconVisualSourceName;
  const data = definitions[sourceName];
  const source: AnimatedIconVisualSource = {
    name: sourceName,
    duration: data.duration,
    size: { width: data.size[0]!, height: data.size[1]! },
    markers: Object.freeze({ ...data.markers }),
    render: (progress, foreground) => renderVisual(data, progress, foreground ?? source.Foreground ?? 'currentColor'),
    FrameCount: () => data.frameCount,
    Framerate: () => data.framerate,
    FrameToProgress: frame => frame / data.frameCount,
    SetColorProperty: (propertyName, value) => { if (propertyName === 'Foreground') source.Foreground = value; },
  };
  return source;
}
export const getAnimatedIconVisualSource = createAnimatedIconSource;
export const animatedIconVisualSourceComponents: Record<string, Component> = Object.fromEntries(
  animatedIconVisualSourceNames.map(name => [name, Object.assign(defineComponent({ name, setup: () => () => null }), { __animatedVisualSourceName: name })]),
);
