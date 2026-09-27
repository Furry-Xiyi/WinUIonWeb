export interface KeyboardAccelerator {
  Key: string;
  Modifiers?: string;
  IsEnabled?: boolean;
}

export interface CommandIconSource {
  Symbol?: string;
  Glyph?: string;
  UriSource?: string;
  [property: string]: unknown;
}

export interface UICommand {
  CanExecute?: (parameter?: unknown) => boolean;
  Execute: (parameter?: unknown) => void;
}

export interface ExecuteRequestedEventArgs {
  Parameter: unknown;
}

export interface CanExecuteRequestedEventArgs extends ExecuteRequestedEventArgs {
  CanExecute: boolean;
}

export interface CommandPropertyChangedEventArgs {
  PropertyName: string;
  OldValue: unknown;
  NewValue: unknown;
}

export type CommandHandler = (sender: XamlUICommand, args: ExecuteRequestedEventArgs) => void;
export type CanExecuteHandler = (sender: XamlUICommand, args: CanExecuteRequestedEventArgs) => void;
export type CanExecuteChangedHandler = (sender: XamlUICommand, args: null) => void;
export type CommandPropertyChangedHandler = (sender: XamlUICommand, args: CommandPropertyChangedEventArgs) => void;

export interface CommandEventMap {
  ExecuteRequested: CommandHandler;
  CanExecuteRequested: CanExecuteHandler;
  CanExecuteChanged: CanExecuteChangedHandler;
  PropertyChanged: CommandPropertyChangedHandler;
}

export interface XamlUICommandOptions {
  AccessKey?: string;
  Command?: UICommand | null;
  Description?: string;
  IconSource?: CommandIconSource | null;
  KeyboardAccelerators?: KeyboardAccelerator[];
  Label?: string;
  ExecuteRequested?: CommandHandler;
  CanExecuteRequested?: CanExecuteHandler;
  CanExecuteChanged?: CanExecuteChangedHandler;
  PropertyChanged?: CommandPropertyChangedHandler;
}

type CommandEventName = keyof CommandEventMap;
type CommandEventArgs = {
  ExecuteRequested: ExecuteRequestedEventArgs;
  CanExecuteRequested: CanExecuteRequestedEventArgs;
  CanExecuteChanged: null;
  PropertyChanged: CommandPropertyChangedEventArgs;
};

const keyCodes: Record<string, string> = {
  Back: 'Backspace',
  Space: 'Space',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Menu: 'AltLeft',
  Control: 'ControlLeft',
  Shift: 'ShiftLeft',
  CapitalLock: 'CapsLock',
  NumberPad0: 'Numpad0',
  NumberPad1: 'Numpad1',
  NumberPad2: 'Numpad2',
  NumberPad3: 'Numpad3',
  NumberPad4: 'Numpad4',
  NumberPad5: 'Numpad5',
  NumberPad6: 'Numpad6',
  NumberPad7: 'Numpad7',
  NumberPad8: 'Numpad8',
  NumberPad9: 'Numpad9',
  Multiply: 'NumpadMultiply',
  Add: 'NumpadAdd',
  Subtract: 'NumpadSubtract',
  Decimal: 'NumpadDecimal',
  Divide: 'NumpadDivide'
};

const matchesKey = (key: string, event: KeyboardEvent): boolean => {
  const code = keyCodes[key]
    ?? (/^[A-Z]$/i.test(key) ? `Key${key.toUpperCase()}` : /^Number[0-9]$/.test(key) ? `Digit${key.slice(-1)}` : key);
  const logicalKey = key === 'Space' ? ' ' : keyCodes[key] ?? (/^Number[0-9]$/.test(key) ? key.slice(-1) : key);
  return event.code === code || event.key.toLowerCase() === logicalKey.toLowerCase();
};

/** Metadata and ICommand behavior for Microsoft.UI.Xaml.Input.XamlUICommand. */
export class XamlUICommand implements UICommand {
  private accessKey = '';
  private command: UICommand | null = null;
  private description = '';
  private iconSource: CommandIconSource | null = null;
  private label = '';
  private readonly accelerators: KeyboardAccelerator[];
  private readonly observedAccelerators = new WeakMap<KeyboardAccelerator, KeyboardAccelerator>();
  private readonly observedIcons = new WeakMap<CommandIconSource, CommandIconSource>();
  private readonly eventListeners: { [K in CommandEventName]: Set<CommandEventMap[K]> } = {
    ExecuteRequested: new Set(),
    CanExecuteRequested: new Set(),
    CanExecuteChanged: new Set(),
    PropertyChanged: new Set()
  };

  ExecuteRequested?: CommandHandler;
  CanExecuteRequested?: CanExecuteHandler;
  CanExecuteChanged?: CanExecuteChangedHandler;
  PropertyChanged?: CommandPropertyChangedHandler;

  public constructor(options: XamlUICommandOptions = {}) {
    this.accelerators = new Proxy<KeyboardAccelerator[]>([], {
      set: (items, property, value) => {
        const oldValue = Reflect.get(items, property);
        const nextValue = /^\d+$/.test(String(property)) ? this.ObserveAccelerator(value) : value;
        const updated = Reflect.set(items, property, nextValue);
        if (updated && !Object.is(oldValue, nextValue)) this.NotifyPropertyChanged('KeyboardAccelerators', oldValue, nextValue);
        return updated;
      },
      deleteProperty: (items, property) => {
        const oldValue = Reflect.get(items, property);
        const existed = Reflect.has(items, property);
        const updated = Reflect.deleteProperty(items, property);
        if (updated && existed) this.NotifyPropertyChanged('KeyboardAccelerators', oldValue, undefined);
        return updated;
      }
    });
    for (const [property, value] of Object.entries(options)) {
      if (property === 'KeyboardAccelerators') this.KeyboardAccelerators.push(...((value ?? []) as KeyboardAccelerator[]));
      else if (property in this) Reflect.set(this, property, value);
    }
  }

  public get AccessKey(): string { return this.accessKey; }
  public set AccessKey(value: string) { this.SetProperty('AccessKey', 'accessKey', value ?? ''); }
  public get Command(): UICommand | null { return this.command; }
  public set Command(value: UICommand | null) { this.SetProperty('Command', 'command', value ?? null); }
  public get Description(): string { return this.description; }
  public set Description(value: string) { this.SetProperty('Description', 'description', value ?? ''); }
  public get IconSource(): CommandIconSource | null { return this.iconSource; }
  public set IconSource(value: CommandIconSource | null) {
    this.SetProperty('IconSource', 'iconSource', value ? this.ObserveIcon(value) : null);
  }
  public get KeyboardAccelerators(): KeyboardAccelerator[] { return this.accelerators; }
  public get Label(): string { return this.label; }
  public set Label(value: string) { this.SetProperty('Label', 'label', value ?? ''); }

  public addEventListener<K extends CommandEventName>(name: K, handler: CommandEventMap[K]): void {
    (this.eventListeners[name] as Set<CommandEventMap[K]>).add(handler);
  }

  public removeEventListener<K extends CommandEventName>(name: K, handler: CommandEventMap[K]): void {
    (this.eventListeners[name] as Set<CommandEventMap[K]>).delete(handler);
  }

  public CanExecute(parameter?: unknown): boolean {
    const args: CanExecuteRequestedEventArgs = { Parameter: parameter, CanExecute: true };
    this.RaiseEvent('CanExecuteRequested', args);
    const canExecute = args.CanExecute;
    // WinUI queries the child after raising the event, even when this command is disabled.
    const childCanExecute = this.Command?.CanExecute?.(parameter) ?? true;
    return canExecute && childCanExecute;
  }

  public Execute(parameter?: unknown): void {
    this.RaiseEvent('ExecuteRequested', { Parameter: parameter });
    this.Command?.Execute(parameter);
  }

  public NotifyCanExecuteChanged(): void {
    this.RaiseEvent('CanExecuteChanged', null);
  }

  public MatchesKeyboardEvent(event: KeyboardEvent): boolean {
    return this.KeyboardAccelerators.some((accelerator) => {
      if (accelerator.IsEnabled === false || !accelerator.Key || accelerator.Key === 'None') return false;
      const modifiers = new Set((accelerator.Modifiers ?? 'None').split(',').map((modifier) => modifier.trim()));
      if ([...modifiers].some((modifier) => !['None', 'Control', 'Menu', 'Shift', 'Windows'].includes(modifier))) return false;
      return matchesKey(accelerator.Key, event)
        && event.ctrlKey === modifiers.has('Control')
        && event.altKey === modifiers.has('Menu')
        && event.shiftKey === modifiers.has('Shift')
        && event.metaKey === modifiers.has('Windows');
    });
  }

  public AttachKeyboardAccelerators(target: Window | HTMLElement = window, parameter?: unknown): () => void {
    const listener = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !this.MatchesKeyboardEvent(event) || !this.CanExecute(parameter)) return;
      event.preventDefault();
      this.Execute(parameter);
    };
    target.addEventListener('keydown', listener as EventListener);
    return () => target.removeEventListener('keydown', listener as EventListener);
  }

  protected OnPropertySet(_property: string): void {}

  protected NotifyPropertyChanged(PropertyName: string, OldValue: unknown, NewValue: unknown): void {
    this.RaiseEvent('PropertyChanged', { PropertyName, OldValue, NewValue });
  }

  private SetProperty(property: string, field: 'accessKey' | 'command' | 'description' | 'iconSource' | 'label', value: unknown): void {
    this.OnPropertySet(property);
    const oldValue = this[field];
    if (Object.is(oldValue, value)) return;
    Reflect.set(this, field, value);
    this.NotifyPropertyChanged(property, oldValue, value);
  }

  private RaiseEvent<K extends CommandEventName>(name: K, args: CommandEventArgs[K]): void {
    const handler = this[name] as ((sender: XamlUICommand, eventArgs: CommandEventArgs[K]) => void) | undefined;
    handler?.(this, args);
    for (const listener of [...this.eventListeners[name]]) {
      (listener as (sender: XamlUICommand, eventArgs: CommandEventArgs[K]) => void)(this, args);
    }
  }

  private ObserveAccelerator(accelerator: KeyboardAccelerator): KeyboardAccelerator {
    if (!accelerator || typeof accelerator !== 'object') return accelerator;
    const observed = this.observedAccelerators.get(accelerator);
    if (observed) return observed;
    const proxy = new Proxy(accelerator, {
      set: (target, property, value) => {
        const oldValue = Reflect.get(target, property);
        const updated = Reflect.set(target, property, value);
        if (updated && !Object.is(oldValue, value)) this.NotifyPropertyChanged('KeyboardAccelerators', oldValue, value);
        return updated;
      },
      deleteProperty: (target, property) => {
        const oldValue = Reflect.get(target, property);
        const existed = Reflect.has(target, property);
        const updated = Reflect.deleteProperty(target, property);
        if (updated && existed) this.NotifyPropertyChanged('KeyboardAccelerators', oldValue, undefined);
        return updated;
      }
    });
    this.observedAccelerators.set(accelerator, proxy);
    this.observedAccelerators.set(proxy, proxy);
    return proxy;
  }

  private ObserveIcon(icon: CommandIconSource): CommandIconSource {
    const observed = this.observedIcons.get(icon);
    if (observed) return observed;
    const proxy = new Proxy(icon, {
      set: (target, property, value) => {
        const oldValue = Reflect.get(target, property);
        const updated = Reflect.set(target, property, value);
        if (updated && !Object.is(oldValue, value)) this.NotifyPropertyChanged('IconSource', oldValue, value);
        return updated;
      }
    });
    this.observedIcons.set(icon, proxy);
    this.observedIcons.set(proxy, proxy);
    return proxy;
  }
}

export default XamlUICommand;
