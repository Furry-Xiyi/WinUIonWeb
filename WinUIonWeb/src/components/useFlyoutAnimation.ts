// 公共的 flyout 裁剪展开动画：通过 Web Animations API 把 clip-path 从起始
// 矩形展开到完整弹层矩形，可用于任何自带弹出层的控件。
// 对应官方 WinUI Flyout/AutoSuggestBox/ComboBox 等弹层的裁剪展开动画行为；
// 属于 Web 公共动画工具，官方没有同名文件。
import { onBeforeUnmount, ref, type Ref } from 'vue';

export type FlyoutAnimationOrigin = 'element' | 'edge' | 'rect' | 'center';
export type FlyoutAnimationDirection = 'top' | 'bottom' | 'left' | 'right';
export type FlyoutAnimationRect = { left: number; right: number; top: number; bottom: number };
export type FlyoutAnimationOriginElement = HTMLElement | string | Ref<HTMLElement | null> | null;
export type Resolvable<T> = T | (() => T);

export interface FlyoutAnimationOptions {
  Origin?: Resolvable<FlyoutAnimationOrigin>;
  Direction?: Resolvable<FlyoutAnimationDirection>;
  OriginElement?: Resolvable<FlyoutAnimationOriginElement>;
  StartRect?: Resolvable<FlyoutAnimationRect | null> | ((targetRect: DOMRect) => FlyoutAnimationRect | null);
  Duration?: Resolvable<number>;
  Easing?: Resolvable<string>;
  Margin?: Resolvable<number>;
  StripSize?: Resolvable<number>;
  RespectReducedMotion?: Resolvable<boolean>;
}

export interface FlyoutAnimationHandle {
  play: () => void;
  playReverse: () => void;
  cancel: () => void;
  isPlaying: Ref<boolean>;
}

export const FlyoutAnimationDefaults = {
  Origin: 'edge',
  Direction: 'top',
  Duration: 800,
  Easing: 'cubic-bezier(0.092,1.003,0.028,0.997)',
  Margin: 15,
  StripSize: 36,
  RespectReducedMotion: true
} as const;

const resolveValue = <T>(value: Resolvable<T> | undefined): T | undefined => (
  typeof value === 'function' ? (value as () => T)() : value
);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getClipPolygon = (rect: FlyoutAnimationRect) => (
  `polygon(${rect.left}px ${rect.top}px, ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px, ${rect.left}px ${rect.bottom}px)`
);

const resolveOriginElement = (
  target: HTMLElement | null,
  originElement: FlyoutAnimationOptions['OriginElement']
): HTMLElement | null => {
  const resolved = resolveValue(originElement);
  if (!resolved) return null;
  if (typeof resolved === 'string') return target?.querySelector(resolved) ?? null;
  if (resolved instanceof HTMLElement) return resolved;
  if (resolved.value instanceof HTMLElement) return resolved.value;
  return null;
};

// 边缘条带起始矩形：Direction 表示展开增长的边，条带贴着该边。
const getEdgeStartRect = (
  targetRect: DOMRect,
  direction: FlyoutAnimationDirection,
  stripSize: Resolvable<number> | undefined
): FlyoutAnimationRect => {
  const strip = Math.max(1, Math.min(
    resolveValue(stripSize) ?? FlyoutAnimationDefaults.StripSize,
    direction === 'left' || direction === 'right' ? targetRect.width : targetRect.height
  ));
  switch (direction) {
    case 'bottom':
      return { left: 0, right: targetRect.width, top: targetRect.height - strip, bottom: targetRect.height };
    case 'left':
      return { left: 0, right: strip, top: 0, bottom: targetRect.height };
    case 'right':
      return { left: targetRect.width - strip, right: targetRect.width, top: 0, bottom: targetRect.height };
    default:
      return { left: 0, right: targetRect.width, top: 0, bottom: strip };
  }
};

// 正中间起始矩形：从弹层垂直中心的一条横带沿 Y 轴展开，宽度不参与动画。
const getCenterStartRect = (targetRect: DOMRect): FlyoutAnimationRect => {
  const stripHeight = 2;
  return {
    left: 0,
    right: targetRect.width,
    top: targetRect.height / 2 - stripHeight / 2,
    bottom: targetRect.height / 2 + stripHeight / 2
  };
};

// 元素对齐起始矩形：取目标内部某元素相对目标的矩形并 clamp 到目标边界。
const getElementStartRect = (
  target: HTMLElement | null,
  targetRect: DOMRect,
  originElement: FlyoutAnimationOptions['OriginElement']
): FlyoutAnimationRect | null => {
  const element = resolveOriginElement(target, originElement);
  if (!element) return null;
  const elementRect = element.getBoundingClientRect();
  const left = clamp(elementRect.left - targetRect.left, 0, targetRect.width);
  const right = clamp(elementRect.right - targetRect.left, left, targetRect.width);
  const top = clamp(elementRect.top - targetRect.top, 0, targetRect.height);
  const bottom = clamp(elementRect.bottom - targetRect.top, top, targetRect.height);
  return bottom - top > 0 && right - left > 0 ? { left, right, top, bottom } : null;
};

// 显式起始矩形：支持静态矩形或 (targetRect) => rect 函数。
const getRectStartRect = (
  targetRect: DOMRect,
  startRect: FlyoutAnimationOptions['StartRect']
): FlyoutAnimationRect | null => {
  const rect = typeof startRect === 'function'
    ? (startRect as (rect: DOMRect) => FlyoutAnimationRect | null)(targetRect)
    : startRect;
  if (!rect) return null;
  const left = clamp(rect.left ?? 0, 0, targetRect.width);
  const right = clamp(rect.right ?? targetRect.width, left, targetRect.width);
  const top = clamp(rect.top ?? 0, 0, targetRect.height);
  const bottom = clamp(rect.bottom ?? targetRect.height, top, targetRect.height);
  return bottom - top > 0 && right - left > 0 ? { left, right, top, bottom } : null;
};

const resolveStartRect = (
  target: HTMLElement | null,
  targetRect: DOMRect,
  options: FlyoutAnimationOptions
): FlyoutAnimationRect => {
  const origin = resolveValue(options.Origin) ?? FlyoutAnimationDefaults.Origin;
  const startRect = origin === 'element'
    ? getElementStartRect(target, targetRect, options.OriginElement)
    : origin === 'rect'
      ? getRectStartRect(targetRect, options.StartRect)
      : origin === 'center'
        ? getCenterStartRect(targetRect)
      : null;
  return startRect ?? getEdgeStartRect(
    targetRect,
    resolveValue(options.Direction) ?? FlyoutAnimationDefaults.Direction,
    options.StripSize
  );
};

export const useFlyoutAnimation = (
  targetRef: HTMLElement | Ref<HTMLElement | null> | (() => HTMLElement | null),
  options: FlyoutAnimationOptions = {}
): FlyoutAnimationHandle => {
  const isPlaying = ref(false);
  let animation: Animation | null = null;

  const getTarget = (): HTMLElement | null => {
    if (targetRef instanceof HTMLElement) return targetRef;
    const target = typeof targetRef === 'function' ? targetRef() : targetRef.value;
    return target instanceof HTMLElement ? target : null;
  };

  const cancel = () => {
    if (animation) {
      animation.cancel();
      animation = null;
    }
    const target = getTarget();
    if (target) target.style.clipPath = '';
    isPlaying.value = false;
  };

  const run = (reverse: boolean) => {
    cancel();

    const target = getTarget();
    if (!target) return;

    const respectsReducedMotion = resolveValue(options.RespectReducedMotion);
    const prefersReducedMotion = respectsReducedMotion !== false
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targetRect = target.getBoundingClientRect();
    if (targetRect.width === 0 || targetRect.height === 0) return;

    const startRect = resolveStartRect(target, targetRect, options);
    const margin = resolveValue(options.Margin) ?? FlyoutAnimationDefaults.Margin;
    const endRect = {
      left: -margin,
      right: targetRect.width + margin,
      top: -margin,
      bottom: targetRect.height + margin
    };
    const duration = resolveValue(options.Duration) ?? FlyoutAnimationDefaults.Duration;
    const easing = resolveValue(options.Easing) ?? FlyoutAnimationDefaults.Easing;

    const current = target.animate(
      reverse
        ? [
            { clipPath: getClipPolygon(endRect) },
            { clipPath: getClipPolygon(startRect) }
          ]
        : [
            { clipPath: getClipPolygon(startRect) },
            { clipPath: getClipPolygon(endRect) }
          ],
      // 不用 forwards 填充：结束帧本来就覆盖整个弹层（含 margin），动画
      // 结束后让效果自然失效即可，避免残留 clip-path 裁掉阴影外圈。
      { duration, easing, fill: 'none' }
    );
    animation = current;
    isPlaying.value = true;

    current.onfinish = () => {
      if (animation !== current) return;
      animation = null;
      // clip-path clips the box-shadow as well; remove it once the reveal
      // finishes so the popup shadow is rendered fully.
      target.style.clipPath = '';
      isPlaying.value = false;
    };
    current.oncancel = () => {
      if (animation === current) {
        animation = null;
        isPlaying.value = false;
      }
    };
  };

  const play = () => run(false);
  const playReverse = () => run(true);

  onBeforeUnmount(cancel);

  return { play, playReverse, cancel, isPlaying };
};
