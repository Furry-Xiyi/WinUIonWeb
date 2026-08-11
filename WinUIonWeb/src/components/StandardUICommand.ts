import { XamlUICommand, type KeyboardAccelerator } from './WinXamlUICommand';
import { componentResources, normalizeLocale } from './i18n/index';

export type StandardUICommandKind =
  | 'None' | 'Cut' | 'Copy' | 'Paste' | 'SelectAll' | 'Delete' | 'Share'
  | 'Save' | 'Open' | 'Close' | 'Pause' | 'Play' | 'Stop' | 'Forward'
  | 'Backward' | 'Undo' | 'Redo';

interface StandardCommandDefaults {
  Symbol: string;
  KeyboardAccelerators: KeyboardAccelerator[];
}

const defaults: Record<Exclude<StandardUICommandKind, 'None'>, StandardCommandDefaults> = {
  Cut: { Symbol: 'Cut', KeyboardAccelerators: [{ Key: 'X', Modifiers: ['Control'] }] },
  Copy: { Symbol: 'Copy', KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }] },
  Paste: { Symbol: 'Paste', KeyboardAccelerators: [{ Key: 'V', Modifiers: ['Control'] }] },
  SelectAll: { Symbol: 'SelectAll', KeyboardAccelerators: [{ Key: 'A', Modifiers: ['Control'] }] },
  Delete: { Symbol: 'Delete', KeyboardAccelerators: [{ Key: 'Delete' }] },
  Share: { Symbol: 'Share', KeyboardAccelerators: [] },
  Save: { Symbol: 'Save', KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }] },
  Open: { Symbol: 'OpenFile', KeyboardAccelerators: [{ Key: 'O', Modifiers: ['Control'] }] },
  Close: { Symbol: 'Cancel', KeyboardAccelerators: [{ Key: 'W', Modifiers: ['Control'] }] },
  Pause: { Symbol: 'Pause', KeyboardAccelerators: [] },
  Play: { Symbol: 'Play', KeyboardAccelerators: [] },
  Stop: { Symbol: 'Stop', KeyboardAccelerators: [] },
  Forward: { Symbol: 'Forward', KeyboardAccelerators: [] },
  Backward: { Symbol: 'Back', KeyboardAccelerators: [] },
  Undo: { Symbol: 'Undo', KeyboardAccelerators: [{ Key: 'Z', Modifiers: ['Control'] }] },
  Redo: { Symbol: 'Redo', KeyboardAccelerators: [{ Key: 'Y', Modifiers: ['Control'] }] }
};

const getLocalizedLabel = (Kind: Exclude<StandardUICommandKind, 'None'>): string => {
  const language = typeof document !== 'undefined'
    ? document.documentElement.lang
    : typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const locale = normalizeLocale(language);
  const key = `command.standard.${Kind}`;
  return componentResources[locale][key] ?? componentResources['en-US'][key] ?? Kind;
};

/** The web equivalent of Microsoft.UI.Xaml.Input.StandardUICommand. */
export class StandardUICommand extends XamlUICommand {
  public Kind: StandardUICommandKind;

  public constructor(Kind: StandardUICommandKind, options: Partial<StandardUICommand> = {}) {
    const commandDefaults = Kind === 'None' ? undefined : defaults[Kind];
    const localizedLabel = Kind === 'None' ? undefined : getLocalizedLabel(Kind);
    super({
      Label: localizedLabel,
      Description: localizedLabel,
      IconSource: commandDefaults ? { Symbol: commandDefaults.Symbol } : undefined,
      KeyboardAccelerators: commandDefaults?.KeyboardAccelerators,
      ...options
    });
    this.Kind = Kind;
  }
}

export default StandardUICommand;
