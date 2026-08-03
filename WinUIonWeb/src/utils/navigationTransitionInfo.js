const SLIDE_NAVIGATION_TRANSITION_EFFECTS = new Set(['FromRight', 'FromLeft']);
const NAVIGATION_TRIGGERS = new Set([
  'NavigationTrigger_NavigatingTo',
  'NavigationTrigger_NavigatingAway',
  'NavigationTrigger_BackNavigatingTo',
  'NavigationTrigger_BackNavigatingAway'
]);

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

export const createSlideNavigationTransitionInfo = (Effect = 'FromRight') => ({
  Type: 'SlideNavigationTransitionInfo',
  Effect: SLIDE_NAVIGATION_TRANSITION_EFFECTS.has(Effect) ? Effect : 'FromRight'
});

export const DefaultNavigationTransitionInfo = null;

export const normalizeNavigationTransitionInfo = (NavigationTransitionInfo) => {
  if (!NavigationTransitionInfo) return DefaultNavigationTransitionInfo;

  const { Type } = NavigationTransitionInfo;
  if (Type === 'EntranceNavigationTransitionInfo') return createEntranceNavigationTransitionInfo();
  if (Type === 'DrillInNavigationTransitionInfo') return createDrillInNavigationTransitionInfo();
  if (Type === 'SuppressNavigationTransitionInfo') return createSuppressNavigationTransitionInfo();
  if (Type === 'CommonNavigationTransitionInfo') return createCommonNavigationTransitionInfo();
  if (Type === 'ContinuumNavigationTransitionInfo') return createContinuumNavigationTransitionInfo();
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

export const normalizeNavigationTrigger = (NavigationTrigger = NavigationTrigger_NavigatingTo) => {
  const value = String(NavigationTrigger ?? '').trim();
  if (NAVIGATION_TRIGGERS.has(value)) return value;
  const officialValue = `NavigationTrigger_${value}`;
  return NAVIGATION_TRIGGERS.has(officialValue) ? officialValue : NavigationTrigger_NavigatingTo;
};

export const getNavigationTransitionInfoClassName = (
  NavigationTransitionInfo,
  NavigationTrigger = NavigationTrigger_NavigatingTo
) => {
  const normalized = normalizeNavigationTransitionInfo(NavigationTransitionInfo);
  const triggerClassName = normalizeNavigationTrigger(NavigationTrigger);
  if (!normalized) return `DefaultNavigationTransitionInfo ${triggerClassName}`;
  if (normalized.Type === 'SlideNavigationTransitionInfo') {
    return `SlideNavigationTransitionInfo ${normalized.Effect} ${triggerClassName}`;
  }
  return `${normalized.Type} ${triggerClassName}`;
};
