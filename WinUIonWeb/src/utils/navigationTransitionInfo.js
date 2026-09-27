const SLIDE_NAVIGATION_TRANSITION_EFFECTS = new Set(['FromRight', 'FromLeft', 'FromBottom']);

export const NavigationTrigger_NavigatingTo = 'NavigationTrigger_NavigatingTo';
export const NavigationTrigger_NavigatingAway = 'NavigationTrigger_NavigatingAway';
export const NavigationTrigger_BackNavigatingTo = 'NavigationTrigger_BackNavigatingTo';
export const NavigationTrigger_BackNavigatingAway = 'NavigationTrigger_BackNavigatingAway';

export const createEntranceNavigationTransitionInfo = () => ({
  Type: 'EntranceNavigationTransitionInfo'
});

export const createDrillInNavigationTransitionInfo = () => ({
  Type: 'DrillInNavigationTransitionInfo'
});

export const createSuppressNavigationTransitionInfo = () => ({
  Type: 'SuppressNavigationTransitionInfo'
});

export const createCommonNavigationTransitionInfo = () => ({
  Type: 'CommonNavigationTransitionInfo'
});

export const createContinuumNavigationTransitionInfo = () => ({
  Type: 'ContinuumNavigationTransitionInfo'
});

export const createSlideNavigationTransitionInfo = (Effect = 'FromBottom') => ({
  Type: 'SlideNavigationTransitionInfo',
  Effect: SLIDE_NAVIGATION_TRANSITION_EFFECTS.has(Effect) ? Effect : 'FromBottom'
});

export const DefaultNavigationTransitionInfo = null;

export const normalizeNavigationTransitionInfo = (NavigationTransitionInfo) => {
  if (!NavigationTransitionInfo) return DefaultNavigationTransitionInfo;

  const { Type } = NavigationTransitionInfo;
  if (Type === 'EntranceNavigationTransitionInfo') return createEntranceNavigationTransitionInfo();
  if (Type === 'DrillInNavigationTransitionInfo') return createDrillInNavigationTransitionInfo();
  if (Type === 'SuppressNavigationTransitionInfo') return createSuppressNavigationTransitionInfo();
  if (Type === 'CommonNavigationTransitionInfo') return {
    ...createCommonNavigationTransitionInfo(),
    ...(NavigationTransitionInfo.IsStaggeringEnabled !== undefined
      ? { IsStaggeringEnabled: NavigationTransitionInfo.IsStaggeringEnabled } : {})
  };
  if (Type === 'ContinuumNavigationTransitionInfo') return {
    ...createContinuumNavigationTransitionInfo(),
    ...(NavigationTransitionInfo.ExitElement !== undefined ? { ExitElement: NavigationTransitionInfo.ExitElement } : {})
  };
  if (Type === 'SlideNavigationTransitionInfo') {
    return createSlideNavigationTransitionInfo(NavigationTransitionInfo.Effect);
  }

  return DefaultNavigationTransitionInfo;
};

export const parseNavigationTransitionInfo = (value, fallback = createEntranceNavigationTransitionInfo()) => {
  if (!value) return normalizeNavigationTransitionInfo(fallback);

  try {
    return normalizeNavigationTransitionInfo(JSON.parse(value));
  } catch {
    return normalizeNavigationTransitionInfo(fallback);
  }
};

export const stringifyNavigationTransitionInfo = (NavigationTransitionInfo) => (
  JSON.stringify(normalizeNavigationTransitionInfo(NavigationTransitionInfo))
);

export const navigationTransitionInfoEquals = (left, right) => (
  stringifyNavigationTransitionInfo(left) === stringifyNavigationTransitionInfo(right)
);
