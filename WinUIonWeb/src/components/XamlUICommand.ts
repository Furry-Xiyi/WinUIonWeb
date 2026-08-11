export interface KeyboardAccelerator {
  Key: string;
  Modifiers?: string[];
}

export interface CommandIconSource {
  Symbol?: string;
  Glyph?: string;
  UriSource?: string;
}

export interface UICommand {
  CanExecute?: (parameter?: unknown) => boolean;
  Execute: (parameter?: unknown) => void;
}

export interface ExecuteRequestedEventArgs {
  Parameter?: unknown;
}

export interface CanExecuteRequestedEventArgs extends ExecuteRequestedEventArgs {
  CanExecute: boolean;
}

export type CommandHandler = (sender: XamlUICommand, args: ExecuteRequestedEventArgs) => void;
export type CanExecuteHandler = (sender: XamlUICommand, args: CanExecuteRequestedEventArgs) => void;
export type CanExecuteChangedHandler = (sender: XamlUICommand) => void;

/** The web equivalent of Microsoft.UI.Xaml.Input.XamlUICommand. */
export class XamlUICommand {
  AccessKey = '';
  Command?: UICommand;
  CommandParameter: unknown;
  Description = '';
  IconSource?: string | CommandIconSource;
  KeyboardAccelerators: KeyboardAccelerator[] = [];
  Label = '';
  ExecuteRequested?: CommandHandler;
  CanExecuteRequested?: CanExecuteHandler;
  CanExecuteChanged?: CanExecuteChangedHandler;

  public constructor(options: Partial<XamlUICommand> = {}) {
    Object.assign(this, options);
    this.KeyboardAccelerators = [...(options.KeyboardAccelerators ?? [])];
  }

  public CanExecute(parameter: unknown = this.CommandParameter): boolean {
    const args: CanExecuteRequestedEventArgs = { Parameter: parameter, CanExecute: true };
    this.CanExecuteRequested?.(this, args);
    return args.CanExecute && (this.Command?.CanExecute?.(parameter) ?? true);
  }

  public Execute(parameter: unknown = this.CommandParameter): void {
    this.ExecuteRequested?.(this, { Parameter: parameter });
    this.Command?.Execute(parameter);
  }

  public NotifyCanExecuteChanged(): void {
    this.CanExecuteChanged?.(this);
  }

  public MatchesKeyboardEvent(event: KeyboardEvent): boolean {
    return this.KeyboardAccelerators.some((accelerator) => {
      const modifiers = new Set(accelerator.Modifiers ?? []);
      const expectedControl = modifiers.has('Control') || modifiers.has('Ctrl');
      const expectedAlt = modifiers.has('Alt');
      const expectedShift = modifiers.has('Shift');
      const expectedMeta = modifiers.has('Windows') || modifiers.has('Meta');
      return event.key.toLowerCase() === accelerator.Key.toLowerCase()
        && event.ctrlKey === expectedControl
        && event.altKey === expectedAlt
        && event.shiftKey === expectedShift
        && event.metaKey === expectedMeta;
    });
  }

  public AttachKeyboardAccelerators(target: Window | HTMLElement = window): () => void {
    const listener = (event: KeyboardEvent) => {
      if (!this.MatchesKeyboardEvent(event) || !this.CanExecute()) return;
      event.preventDefault();
      this.Execute();
    };
    target.addEventListener('keydown', listener as EventListener);
    return () => target.removeEventListener('keydown', listener as EventListener);
  }
}

export default XamlUICommand;
