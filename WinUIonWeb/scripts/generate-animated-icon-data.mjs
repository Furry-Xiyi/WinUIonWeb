import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reference = path.resolve(project, '../WinUI-Reference/controls/dev/AnimatedIcon/AnimatedVisuals');
const output = path.join(project, 'src/components/animatedIconVisualData.json');
const files = fs.readdirSync(reference).filter(file => file.endsWith('.cpp')).sort();
const sources = {};

function splitArguments(value) {
  const result = [];
  let start = 0;
  let depth = 0;
  let quoted = false;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === '"' && value[index - 1] !== '\\') quoted = !quoted;
    if (quoted) continue;
    if ('([{'.includes(char)) depth++;
    if (')]}'.includes(char)) depth--;
    if (char === ',' && depth === 0) {
      result.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  const last = value.slice(start).trim();
  if (last) result.push(last);
  return result;
}

function parseMethods(source) {
  const methods = new Map();
  const expression = /^    (?:static )?([\w:<>]+) (\w+)\(([^;]*?)\)(?: const)?\s*\{/gm;
  for (const match of source.matchAll(expression)) {
    if (match[1] === 'IFACEMETHODIMP') continue;
    const begin = match.index + match[0].length;
    let depth = 1;
    let quoted = false;
    let end = begin;
    for (; depth && end < source.length; end++) {
      const char = source[end];
      if (char === '"' && source[end - 1] !== '\\') quoted = !quoted;
      if (!quoted && char === '{') depth++;
      if (!quoted && char === '}') depth--;
    }
    methods.set(match[2], {
      type: match[1],
      parameters: splitArguments(match[3]).map(parameter => parameter.match(/(\w+)$/)?.[1]),
      body: source.slice(begin, end - 1).replace(/\/\/[^\r\n]*/g, '').trim(),
    });
  }
  return methods;
}

for (const file of files) {
  const source = fs.readFileSync(path.join(reference, file), 'utf8');
  const name = path.basename(file, '.cpp');
  const classSource = source.slice(source.indexOf(`class ${name}_AnimatedVisual`));
  const methods = parseMethods(classSource);
  const records = [];
  const context = {};
  const duration = Number(source.match(/c_durationTicks\{\s*(\d+)L/)[1]) / 10000000;
  const id = value => value?.__id === undefined ? value : { ref: value.__id };
  const encode = value => Array.isArray(value) ? value.map(encode) : id(value);

  const create = (type, ...args) => {
    const supported = new Set(['PropertySet', 'ContainerVisual', 'ShapeVisual', 'ContainerShape', 'SpriteShape', 'PathGeometry', 'EllipseGeometry', 'RectangleGeometry', 'RoundedRectangleGeometry', 'ColorBrush', 'InsetClip', 'ExpressionAnimation', 'StepEasingFunction', 'CubicBezierEasingFunction', 'BooleanKeyFrameAnimation', 'ScalarKeyFrameAnimation', 'Vector2KeyFrameAnimation']);
    if (!supported.has(type)) throw new Error(`${name}: unsupported Composition object ${type}`);
    const record = { id: records.length, type, props: {}, animations: {}, children: [] };
    records.push(record);
    if (type === 'SpriteShape') record.geometry = id(args[0]);
    if (type === 'PathGeometry') record.geometry = id(args[0]);
    if (type === 'CubicBezierEasingFunction') record.points = args.flat();
    if (type === 'ExpressionAnimation') record.expression = args[0];
    if (type.endsWith('KeyFrameAnimation')) record.frames = [];
    const api = new Proxy({ __id: record.id }, {
      get(target, property) {
        if (property === '__id') return record.id;
        if (property === 'Properties' || property === 'Shapes' || property === 'Children') return () => api;
        if (property === 'Append' || property === 'InsertAtTop') return value => record.children.push(id(value));
        if (property === 'SetReferenceParameter') return (key, value) => {
          record.references ??= {};
          record.references[key] = id(value);
        };
        if (property === 'InsertKeyFrame' || property === 'InsertExpressionKeyFrame') return (at, value, easing) => {
          record.frames.push({ at, [property === 'InsertKeyFrame' ? 'value' : 'expression']: encode(value), ...(easing ? { easing: id(easing) } : {}) });
        };
        if (property === 'InsertScalar' || property === 'InsertVector2' || property === 'InsertVector3' || property === 'InsertVector4') return (key, value) => record.props[key] = encode(value);
        const allowed = new Set(['Duration', 'TransformMatrix', 'CenterPoint', 'Offset', 'Scale', 'RotationAngle', 'RotationAngleInDegrees', 'Opacity', 'IsVisible', 'Size', 'Clip', 'FillBrush', 'StrokeBrush', 'StrokeThickness', 'StrokeStartCap', 'StrokeEndCap', 'StrokeDashCap', 'StrokeLineJoin', 'StrokeMiterLimit', 'Radius', 'CornerRadius', 'TrimStart', 'TrimEnd', 'IsFinalStepSingleFrame', 'IsInitialStepSingleFrame', 'Expression']);
        if (allowed.has(property)) return value => record.props[property] = encode(value);
        throw new Error(`${name}: unsupported Composition API ${String(property)}`);
      },
    });
    return api;
  };

  function geometry(body) {
    const record = { id: records.length, type: 'Geometry', commands: [], fillRule: body.includes('D2D1_FILL_MODE_WINDING') ? 'nonzero' : 'evenodd' };
    records.push(record);
    if (body.includes('CreateGeometryGroup')) {
      const methods = [...body.matchAll(/(Geometry(?:_\d+)?)\(\)\.get\(\)->Geometry\(\)/g)].map(match => match[1]);
      if (!methods.length) throw new Error(`${name}: empty geometry group`);
      for (const method of methods) {
        const child = call(method);
        record.commands.push(...records[child.__id].commands);
      }
      return { __id: record.id };
    }
    for (const match of body.matchAll(/sink->(BeginFigure|AddLine|AddBezier|AddQuadraticBezier|EndFigure)\(([^;]*)\);/g)) {
      const values = [...match[2].matchAll(/(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[Ff]/g)].map(value => Number(value[1]));
      const command = { BeginFigure: 'M', AddLine: 'L', AddBezier: 'C', AddQuadraticBezier: 'Q', EndFigure: 'Z' }[match[1]];
      if (match[1] === 'EndFigure' && !match[2].includes('CLOSED')) continue;
      record.commands.push([command, ...values]);
    }
    const unknown = [...body.matchAll(/sink->(\w+)\(/g)].map(match => match[1]).filter(method => !['BeginFigure', 'AddLine', 'AddBezier', 'AddQuadraticBezier', 'EndFigure', 'SetFillMode', 'Close'].includes(method));
    if (unknown.length) throw new Error(`${name}: unsupported geometry ${unknown.join(', ')}`);
    if (!record.commands.length) throw new Error(`${name}: unsupported or empty geometry method`);
    return { __id: record.id };
  }

  function translate(body) {
    const strings = [];
    const translated = body.replace(/L?"(?:\\.|[^"\\])*"/g, literal => {
      strings.push(literal.replace(/^L/, ''));
      return `STRINGTOKEN${strings.length - 1}`;
    });
    return translated
      .replace(/\bTimeSpan\{\s*c_durationTicks\s*\}/g, String(duration))
      .replace(/\bL"/g, '"')
      .replace(/(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)F\b/g, '$1')
      .replace(/\b(?:const auto|auto)\b/g, 'const')
      .replace(/\b(?:winrt::)?(?:float2|float3|float4|float3x2|float4x4)\s*\{/g, '[')
      .replace(/\{/g, '[').replace(/\}/g, ']')
      .replace(/\b(?:CompositionPath|CanvasGeometryToIGeometrySource2D)\(/g, 'identity(')
      .replace(/\b(?:CompositionStrokeCap|CompositionStrokeLineJoin)::(\w+)/g, (_, value) => JSON.stringify(value))
      .replace(/_c\.Create(\w+)\(/g, 'create("$1",')
      .replace(/create\("(\w+)",\)/g, 'create("$1")')
      .replace(/\b(_\w+)\b/g, 'context.$1')
      .replace(/\b(\w+)\(/g, (match, method, position, whole) => {
        if (!methods.has(method) || method === 'StartProgressBoundAnimation' || method === 'BindProperty') return match;
        if (whole[position - 1] === '.') return match;
        return `call("${method}",`;
      })
      .replace(/call\("(\w+)",\)/g, 'call("$1")')
      .replace(/STRINGTOKEN(\d+)/g, (_, index) => strings[Number(index)]);
  }

  const compiled = new Map();
  function call(method, ...args) {
    const definition = methods.get(method);
    if (!definition) throw new Error(`${name}: unknown method ${method}`);
    if (definition.type.includes('CanvasGeometry')) return geometry(definition.body);
    let implementation = compiled.get(method);
    if (!implementation) {
      const body = translate(definition.body);
      try {
        implementation = new Function('context', 'create', 'call', 'identity', 'StartProgressBoundAnimation', 'BindProperty', ...definition.parameters, body);
      } catch (error) {
        throw new Error(`${name}.${method}: ${error.message}\n${body}`);
      }
      compiled.set(method, implementation);
    }
    const startAnimation = (target, property, animation, progressExpression) => {
      if (!['IsVisible', 'Opacity', 'Offset', 'Scale.X', 'Scale.Y', 'RotationAngleInDegrees', 'TrimStart', 'TrimEnd', 'StrokeThickness', 't0', 't1', 't2'].includes(property)) {
        throw new Error(`${name}: unsupported animated property ${property}`);
      }
      records[target.__id].animations[property] = id(animation);
      records[target.__id].progressBindings ??= {};
      records[target.__id].progressBindings[property] = id(progressExpression);
    };
    const bindProperty = (target, property, expression, parameter, referenced) => {
      if (property !== 'Color' || expression !== 'ColorRGB(_theme.Foreground.W,_theme.Foreground.X,_theme.Foreground.Y,_theme.Foreground.Z)' || parameter !== '_theme' || referenced !== context._themeProperties) {
        throw new Error(`${name}: unsupported expression binding ${property}: ${expression}`);
      }
      records[target.__id].bindings ??= {};
      records[target.__id].bindings[property] = { expression, parameter, reference: id(referenced) };
    };
    try {
      return implementation(context, create, call, value => value, startAnimation, bindProperty, ...args);
    } catch (error) {
      throw new Error(`${name}.${method}: ${error.message}`);
    }
  }

  context._themeProperties = create('PropertySet');
  context._themeProperties.InsertVector4('Foreground', [0, 0, 0, 255]);
  const root = call('Root');
  // The renderer supports the objects above; source generation fails before silently losing an official layer.
  for (const record of records) {
    if (record.type === 'SpriteShape' && record.props.StrokeBrush) {
      const startCap = record.props.StrokeStartCap ?? 'Flat';
      if ((record.props.StrokeEndCap ?? 'Flat') !== startCap || (record.props.StrokeDashCap ?? 'Flat') !== startCap) {
        throw new Error(`${name}: different stroke cap types require a dedicated SVG renderer`);
      }
    }
    for (const progressReference of Object.values(record.progressBindings ?? {})) {
      const expression = records[progressReference.ref];
      if (expression.type !== 'ExpressionAnimation' || expression.expression !== '_.Progress' || expression.references?._?.ref !== root.__id) {
        throw new Error(`${name}: unsupported timeline progress binding`);
      }
    }
  }
  const size = [...methods.get('Size').body.matchAll(/(-?\d+(?:\.\d+)?)F/g)].map(match => Number(match[1]));
  const markers = Object.fromEntries([...source.matchAll(/\{ L"([^"]+)", ([\d.]+) \}/g)].map(match => [match[1], Number(match[2])]));
  const frameCount = Number(source.match(/::FrameCount\(\)\s*\{\s*return ([\d.]+);/)[1]);
  const framerate = Number(source.match(/::Framerate\(\)\s*\{\s*return ([\d.]+);/)[1]);
  sources[name] = { duration, frameCount, framerate, size, markers, root: id(root), records };
  console.log(`${name}: ${records.length} records, ${Object.keys(markers).length} markers, ${duration}s`);
}

fs.writeFileSync(output, JSON.stringify(sources));
console.log(`Generated ${path.relative(project, output)} from ${files.length} official sources.`);
