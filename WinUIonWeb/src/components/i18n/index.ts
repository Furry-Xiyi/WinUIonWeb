import { inject } from 'vue';
import enUS from '../Strings/en-US/Resources';
import zhCN from '../Strings/zh-CN/Resources';

export type Locale = 'en-US' | 'zh-CN';
export type I18nValues = Record<string, string | number | boolean | null | undefined>;
export type ResourceMap = Record<string, string>;
export type ResourceBundle = Record<Locale, ResourceMap>;

export interface I18n {
  locale: Locale;
  t: (key: string, values?: I18nValues) => string;
}

export const i18nKey = Symbol.for('WinUIonWeb.i18n');

export const componentResources: ResourceBundle = {
  'en-US': enUS,
  'zh-CN': zhCN
};

export const normalizeLocale = (locale?: string): Locale => {
  const normalized = (locale || 'en-US').toLowerCase();
  if (normalized.startsWith('zh')) return 'zh-CN';
  return 'en-US';
};

const format = (value: string, values?: I18nValues) => {
  if (!values) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
};

export const createI18n = (locale = navigator.language, extraResources?: Partial<ResourceBundle>): I18n => {
  const currentLocale = normalizeLocale(locale);
  const currentResources = {
    ...(componentResources[currentLocale] ?? {}),
    ...(extraResources?.[currentLocale] ?? {})
  };
  const fallbackResources = {
    ...componentResources['en-US'],
    ...(extraResources?.['en-US'] ?? {})
  };

  const t = (key: string, values?: I18nValues) => {
    const value = currentResources[key] ?? fallbackResources[key] ?? key;
    return format(value, values);
  };

  return {
    locale: currentLocale,
    t
  };
};

export const useI18n = () => inject(i18nKey, createI18n('en-US'));
