export const NavigationTrigger_NavigatingTo: string
export const NavigationTrigger_NavigatingAway: string
export const NavigationTrigger_BackNavigatingTo: string
export const NavigationTrigger_BackNavigatingAway: string

export interface NavigationTransitionInfo {
  Type: string
  Effect?: string
}

export function createDrillInNavigationTransitionInfo(): NavigationTransitionInfo
export function getNavigationTransitionInfoClassName(
  NavigationTransitionInfo: NavigationTransitionInfo | null,
  NavigationTrigger?: string
): string
