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
  FontFamily?: string;
}

export interface SwipeControlApi {
  Close: () => void;
  LeftItems: SwipeItems | null;
  RightItems: SwipeItems | null;
  TopItems: SwipeItems | null;
  BottomItems: SwipeItems | null;
  IsEnabled: boolean;
  IsTabStop: boolean;
  Content: unknown;
  ContentTemplate: unknown;
  DataContext: unknown;
  readonly Element: HTMLElement | undefined;
}

export interface SwipeItemInvokedEventArgs {
  SwipeControl: SwipeControlApi;
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

export interface SwipeItems extends Iterable<SwipeItem> {
  Mode: SwipeMode;
  readonly Size: number;
  readonly Count: number;
  GetAt(index: number): SwipeItem;
  SetAt(index: number, value: SwipeItem): void;
  InsertAt(index: number, value: SwipeItem): void;
  RemoveAt(index: number): void;
  Append(value: SwipeItem): void;
  RemoveAtEnd(): void;
  Clear(): void;
  ReplaceAll(values: Iterable<SwipeItem>): void;
  IndexOf(value: SwipeItem): { found: boolean; index: number };
  GetView(): ReadonlyArray<SwipeItem>;
}
