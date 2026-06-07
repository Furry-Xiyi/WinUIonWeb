// styles/accent.ts
declare const chrome: any;
const EXTENSION_ID = "pmdbpmknpllhgjcgbadidknaomabpfbb"; // chrome://extensions 里复制

function applyAccentColor(color: string) {
  const style = document.documentElement.style;
  style.setProperty('--accent-base', color);

  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) {
    style.setProperty('--accent-base', color);
    return;
  }
  const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (dark) {
    style.setProperty('--accent-base', `rgb(${r},${g},${b})`);
    style.setProperty('--accent-hover', `rgba(${r},${g},${b},0.9)`);
    style.setProperty('--accent-pressed', `rgba(${r},${g},${b},0.8)`);
    const textColor = (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? '#000000' : '#FFFFFF';
    style.setProperty('--accent-text', textColor);
  } else {
    style.setProperty('--accent-base', `rgb(${r},${g},${b})`);
    style.setProperty('--accent-hover', `rgb(${Math.max(0, r - 15)},${Math.max(0, g - 15)},${Math.max(0, b - 15)})`);
    style.setProperty('--accent-pressed', `rgb(${Math.max(0, r - 30)},${Math.max(0, g - 30)},${Math.max(0, b - 30)})`);
    const textColor = (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? '#000000' : '#FFFFFF';
    style.setProperty('--accent-text', textColor);
  }
}

function requestAccentFromExtension() {
  if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) return;

  try {
    chrome.runtime.sendMessage(
      EXTENSION_ID,
      { type: "get_accent" },
      (response) => {
        if (chrome.runtime.lastError) return;
        if (response?.status === "ok" && response.accentColor) {
          applyAccentColor(response.accentColor);
        }
      }
    );
  } catch {
    // 插件未安装或不可用
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', requestAccentFromExtension);
} else {
  requestAccentFromExtension();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', requestAccentFromExtension);
