export type SwipeMode = 'Reveal' | 'Execute';
export type SwipeBehaviorOnInvoked = 'Auto' | 'Close' | 'RemainOpen';
export type SwipeSide = 'Left' | 'Right' | 'Top' | 'Bottom';

export interface SwipeCommand {
  Label?: string;
  Description?: string;
  IconSource?: string | SwipeIconSource;
  CanExecute?: (parameter?: unknown) => boolean;
  Execute: (parameter?: unknown) => void;
}

export interface SwipeIconSource {
  Symbol?: string;
  Glyph?: string;
  UriSource?: string;
}

export interface SwipeItemInvokedEventArgs {
  SwipeControl: {
    Close: () => void;
    Content: HTMLElement | undefined;
    Element: HTMLElement | undefined;
  };
}

export interface SwipeItem {
  Text?: string;
  IconSource?: string | SwipeIconSource;
  Background?: string;
  Foreground?: string;
  BehaviorOnInvoked?: SwipeBehaviorOnInvoked;
  Command?: SwipeCommand;
  CommandParameter?: unknown;
  Invoked?: (sender: SwipeItem, args: SwipeItemInvokedEventArgs) => void;
}

export interface SwipeItems {
  Mode?: SwipeMode;
  Items: SwipeItem[];
}
