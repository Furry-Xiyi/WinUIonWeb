/**
 * PersonPicture initials generation from WinUI-Reference's InitialsGenerator.cpp.
 * Windows wchar_t and JavaScript string indexing both use UTF-16 code units.
 */
export enum PersonPictureCharacterType {
  Other = 0,
  Standard = 1,
  Symbolic = 2,
  Glyph = 3,
}

export interface PersonPictureContactName {
  FirstName?: string | null;
  LastName?: string | null;
  DisplayName?: string | null;
}

const glyphRanges: readonly (readonly [number, number])[] = [
  [0x0250, 0x02af], // IPA Extensions
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfb50, 0xfdff], // Arabic Presentation Forms-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
  [0x0900, 0x097f], // Devanagari
  [0xa8e0, 0xa8ff], // Devanagari Extended
  [0x0980, 0x09ff], // Bangla
  [0x0a00, 0x0a7f], // Gurmukhi
  [0x0a80, 0x0aff], // Gujarati
  [0x0b00, 0x0b7f], // Odia
  [0x0b80, 0x0bff], // Tamil
  [0x0c00, 0x0c7f], // Telugu
  [0x0c80, 0x0cff], // Kannada
  [0x0d00, 0x0d7f], // Malayalam
  [0x0d80, 0x0dff], // Sinhala
  [0x0e00, 0x0e7f], // Thai
  [0x0e80, 0x0eff], // Lao
];

const symbolicRanges: readonly (readonly [number, number])[] = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
  // The reference lists these ranges, although a UTF-16 code unit cannot reach them.
  [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
  [0x2a700, 0x2b73f], // CJK Unified Ideographs Extension C
  [0x2b740, 0x2b81f], // CJK Unified Ideographs Extension D
  [0x2e80, 0x2eff], // CJK Radicals Supplement
  [0x3000, 0x303f], // CJK Symbols and Punctuation
  [0x31c0, 0x31ef], // CJK Strokes
  [0x3200, 0x32ff], // Enclosed CJK Letters and Months
  [0x3300, 0x33ff], // CJK Compatibility
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0xfe30, 0xfe4f], // CJK Compatibility Forms
  [0x2f800, 0x2fa1f], // CJK Compatibility Ideographs Supplement
  [0x0370, 0x03ff], // Greek and Coptic
  [0x0590, 0x05ff], // Hebrew
  [0x0530, 0x058f], // Armenian
];

const standardRanges: readonly (readonly [number, number])[] = [
  [0x0001, 0x007f], // Basic Latin
  [0x0080, 0x00ff], // Latin-1 Supplement
  [0x0100, 0x017f], // Latin Extended-A
  [0x0180, 0x024f], // Latin Extended-B
  [0x2c60, 0x2c7f], // Latin Extended-C
  [0xa720, 0xa7ff], // Latin Extended-D
  [0xab30, 0xab6f], // Latin Extended-E
  [0x1e00, 0x1eff], // Latin Extended Additional
  [0x0400, 0x04ff], // Cyrillic
  [0x0500, 0x052f], // Cyrillic Supplement
  [0x0300, 0x036f], // Combining Diacritical Marks
];

function inRanges(codeUnit: number, ranges: readonly (readonly [number, number])[]): boolean {
  return ranges.some(([first, last]) => codeUnit >= first && codeUnit <= last);
}

function characterTypeForCodeUnit(codeUnit: number): PersonPictureCharacterType {
  if (inRanges(codeUnit, glyphRanges)) return PersonPictureCharacterType.Glyph;
  if (inRanges(codeUnit, symbolicRanges)) return PersonPictureCharacterType.Symbolic;
  if (inRanges(codeUnit, standardRanges)) return PersonPictureCharacterType.Standard;
  return PersonPictureCharacterType.Other;
}

/** Classify the first three UTF-16 code units, with Glyph > Symbolic > Standard. */
export function getPersonPictureCharacterType(value: string): PersonPictureCharacterType {
  let result = PersonPictureCharacterType.Other;
  for (let index = 0; index < Math.min(3, value.length); index++) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit === 0 || codeUnit === 0xfeff) break;
    result = Math.max(result, characterTypeForCodeUnit(codeUnit));
  }
  return result;
}

function firstFullCharacter(value: string): string {
  if (!value) return '';
  let start = 0;
  while (start < value.length) {
    const codeUnit = value.charCodeAt(start);
    if ((codeUnit >= 0x0021 && codeUnit <= 0x002f)
      || (codeUnit >= 0x003a && codeUnit <= 0x0040)
      || (codeUnit >= 0x007b && codeUnit <= 0x007e)) {
      start++;
      continue;
    }
    break;
  }
  if (start >= value.length) start = 0;
  let end = start + 1;
  while (end < value.length) {
    const codeUnit = value.charCodeAt(end);
    if (codeUnit < 0x0300 || codeUnit > 0x036f) break;
    end++;
  }
  return value.slice(start, end);
}

function upperCaseCodeUnits(value: string): string {
  // towupper converts one wchar_t at a time; preserve characters whose JavaScript
  // uppercase conversion expands (for example, sharp s) rather than adding letters.
  let result = '';
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    const upper = character.toUpperCase();
    result += upper.length === 1 ? upper : character;
  }
  return result;
}

function stripTrailingBrackets(value: string): string {
  for (const [opening, closing] of [['{', '}'], ['(', ')'], ['[', ']']]) {
    if (!value.endsWith(closing)) continue;
    const start = value.lastIndexOf(opening);
    if (start >= 0) return value.slice(0, start);
  }
  return value;
}

/** Generate initials only for the character sets allowed by WinUI. */
export function initialsFromDisplayName(value: string | null | undefined): string {
  const name = value ?? '';
  if (getPersonPictureCharacterType(name) !== PersonPictureCharacterType.Standard) return '';
  // The reference constructs std::wstring from a null-terminated string pointer.
  const terminatedName = name.split('\0', 1)[0];
  // Split() uses literal spaces, counts empty tokens, and stops after 25 iterations.
  const words = stripTrailingBrackets(terminatedName).split(' ').slice(0, 25).filter(Boolean);
  if (words.length === 0) return '';
  const initials = firstFullCharacter(words[0])
    + (words.length > 1 ? firstFullCharacter(words[words.length - 1]) : '');
  return upperCaseCodeUnits(initials);
}

/** Prefer a contact's FirstName and LastName when both are present. */
export function initialsFromContactObject(contact: PersonPictureContactName | null | undefined): string {
  if (!contact) return '';
  const firstName = contact.FirstName ?? '';
  const lastName = contact.LastName ?? '';
  if (firstName && lastName) {
    if (getPersonPictureCharacterType(firstName) !== PersonPictureCharacterType.Standard) return '';
    return upperCaseCodeUnits(firstFullCharacter(firstName) + firstFullCharacter(lastName));
  }
  return initialsFromDisplayName(contact.DisplayName);
}
