import { XamlUICommand, type KeyboardAccelerator, type XamlUICommandOptions } from './XamlUICommand';
import { componentResources, normalizeLocale } from './i18n/index';

export const StandardUICommandKind = {
  None: 'None', Cut: 'Cut', Copy: 'Copy', Paste: 'Paste', SelectAll: 'SelectAll', Delete: 'Delete', Share: 'Share',
  Save: 'Save', Open: 'Open', Close: 'Close', Pause: 'Pause', Play: 'Play', Stop: 'Stop', Forward: 'Forward',
  Backward: 'Backward', Undo: 'Undo', Redo: 'Redo'
} as const;

export type StandardUICommandKind = typeof StandardUICommandKind[keyof typeof StandardUICommandKind];

interface StandardCommandDefaults {
  Symbol: string;
  KeyboardAccelerators: KeyboardAccelerator[];
}

const defaults: Record<Exclude<StandardUICommandKind, 'None'>, StandardCommandDefaults> = {
  Cut: { Symbol: 'Cut', KeyboardAccelerators: [{ Key: 'X', Modifiers: 'Control' }] },
  Copy: { Symbol: 'Copy', KeyboardAccelerators: [{ Key: 'C', Modifiers: 'Control' }] },
  Paste: { Symbol: 'Paste', KeyboardAccelerators: [{ Key: 'V', Modifiers: 'Control' }] },
  SelectAll: { Symbol: 'SelectAll', KeyboardAccelerators: [{ Key: 'A', Modifiers: 'Control' }] },
  Delete: { Symbol: 'Delete', KeyboardAccelerators: [{ Key: 'Delete' }] },
  Share: { Symbol: 'Share', KeyboardAccelerators: [] },
  Save: { Symbol: 'Save', KeyboardAccelerators: [{ Key: 'S', Modifiers: 'Control' }] },
  Open: { Symbol: 'OpenFile', KeyboardAccelerators: [{ Key: 'O', Modifiers: 'Control' }] },
  Close: { Symbol: 'Cancel', KeyboardAccelerators: [{ Key: 'W', Modifiers: 'Control' }] },
  Pause: { Symbol: 'Pause', KeyboardAccelerators: [] },
  Play: { Symbol: 'Play', KeyboardAccelerators: [] },
  Stop: { Symbol: 'Stop', KeyboardAccelerators: [] },
  Forward: { Symbol: 'Forward', KeyboardAccelerators: [] },
  Backward: { Symbol: 'Back', KeyboardAccelerators: [] },
  Undo: { Symbol: 'Undo', KeyboardAccelerators: [{ Key: 'Z', Modifiers: 'Control' }] },
  Redo: { Symbol: 'Redo', KeyboardAccelerators: [{ Key: 'Y', Modifiers: 'Control' }] }
};

const getLocalizedProperty = (Kind: Exclude<StandardUICommandKind, 'None'>, description = false): string => {
  const language = typeof document !== 'undefined'
    ? document.documentElement.lang
    : typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const locale = normalizeLocale(language);
  const key = `command.standard.${Kind}${description ? '.description' : ''}`;
  return componentResources[locale][key] ?? componentResources['en-US'][key] ?? '';
};

/** The web equivalent of Microsoft.UI.Xaml.Input.StandardUICommand. */
export class StandardUICommand extends XamlUICommand {
  private kind: StandardUICommandKind = 'None';
  private settingDefaults = false;
  private ownsLabel = true;
  private ownsDescription = true;
  private ownsIcon = true;
  private ownsAccelerators = true;
  private previousKey = 'None';
  private previousModifiers = 'None';

  public constructor(Kind: StandardUICommandKind = 'None', options: XamlUICommandOptions = {}) {
    super();
    this.Kind = Kind;
    for (const [property, value] of Object.entries(options)) {
      if (property === 'KeyboardAccelerators') this.KeyboardAccelerators.splice(0, this.KeyboardAccelerators.length, ...((value ?? []) as KeyboardAccelerator[]));
      else if (property in this) Reflect.set(this, property, value);
    }
  }

  public get Kind(): StandardUICommandKind { return this.kind; }
  public set Kind(value: StandardUICommandKind) {
    if (!Object.hasOwn(StandardUICommandKind, value)) throw new RangeError(`Invalid StandardUICommandKind: ${value}`);
    if (value === this.kind) return;
    const oldValue = this.kind;
    this.kind = value;
    this.PopulateForKind();
    this.NotifyPropertyChanged('Kind', oldValue, value);
  }

  protected override OnPropertySet(property: string): void {
    if (this.settingDefaults) return;
    if (property === 'Label') this.ownsLabel = false;
    if (property === 'Description') this.ownsDescription = false;
    if (property === 'IconSource') this.ownsIcon = false;
  }

  private PopulateForKind(): void {
    if (this.Kind === 'None') return;
    const commandDefaults = defaults[this.Kind];
    this.settingDefaults = true;
    try {
      if (this.ownsLabel) this.Label = getLocalizedProperty(this.Kind);
      if (this.ownsDescription) this.Description = getLocalizedProperty(this.Kind, true);
      if (this.ownsIcon) this.IconSource = { Symbol: commandDefaults.Symbol };
      if (this.ownsAccelerators) {
        const [previous] = this.KeyboardAccelerators;
        this.ownsAccelerators = this.KeyboardAccelerators.length === 0
          ? this.previousKey === 'None'
          : this.KeyboardAccelerators.length === 1
            && previous?.Key === this.previousKey
            && (previous.Modifiers ?? 'None') === this.previousModifiers;
        if (this.ownsAccelerators) {
          this.KeyboardAccelerators.splice(0, this.KeyboardAccelerators.length, ...commandDefaults.KeyboardAccelerators.map((accelerator) => ({ ...accelerator })));
          this.previousKey = commandDefaults.KeyboardAccelerators[0]?.Key ?? 'None';
          this.previousModifiers = commandDefaults.KeyboardAccelerators[0]?.Modifiers ?? 'None';
        }
      }
    } finally {
      this.settingDefaults = false;
    }
  }
}

export default StandardUICommand;
