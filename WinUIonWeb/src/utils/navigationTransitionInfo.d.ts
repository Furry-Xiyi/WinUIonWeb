export const NavigationTrigger_NavigatingTo: string
export const NavigationTrigger_NavigatingAway: string
export const NavigationTrigger_BackNavigatingTo: string
export const NavigationTrigger_BackNavigatingAway: string

export interface NavigationTransitionInfo {
  Type: string
  Effect?: string
  IsStaggeringEnabled?: boolean
  ExitElement?: unknown
}

export const DefaultNavigationTransitionInfo: null
export function createEntranceNavigationTransitionInfo(): NavigationTransitionInfo
export function createDrillInNavigationTransitionInfo(): NavigationTransitionInfo
export function createSuppressNavigationTransitionInfo(): NavigationTransitionInfo
export function createSlideNavigationTransitionInfo(Effect?: string): NavigationTransitionInfo
export function createCommonNavigationTransitionInfo(): NavigationTransitionInfo
export function createContinuumNavigationTransitionInfo(): NavigationTransitionInfo
export function normalizeNavigationTransitionInfo(info: unknown): NavigationTransitionInfo | null
export function parseNavigationTransitionInfo(value: string | null, fallback?: NavigationTransitionInfo | null): NavigationTransitionInfo | null
export function stringifyNavigationTransitionInfo(info: NavigationTransitionInfo | null): string
export function navigationTransitionInfoEquals(left: NavigationTransitionInfo | null, right: NavigationTransitionInfo | null): boolean
