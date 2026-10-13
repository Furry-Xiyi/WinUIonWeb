const NATIVE_HOST_NAME = "com.xiyi.download";

const ids = ["extName", "lblEnabled", "lblSize", "lblDesc"];
ids.forEach(id => {
  const msg = chrome.i18n.getMessage(id);
  if (msg) document.getElementById(id).textContent = msg;
});

const chk = document.getElementById("chkEnabled");
const inp = document.getElementById("minSize");
const loadingPanel = document.getElementById("loadingPanel");
const settingsPanel = document.getElementById("settingsPanel");
const promptPanel = document.getElementById("promptPanel");

let detectedErrorType = null;

// 在执行任何通讯之前，立刻先应用上一次缓存的主题色，保证 Loading 圈一出来就是对应的颜色
chrome.storage.local.get(["accentColor"], (r) => {
  if (r.accentColor) {
    document.documentElement.style.setProperty('--accent-base', r.accentColor);
  }
});

function init() {
  chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "get_settings" }, (response) => {
    if (chrome.runtime.lastError) {
      detectedErrorType = "not_installed";
      fallbackLoad();
    } else if (!response || response.status === "error") {
      detectedErrorType = "not_running";
      fallbackLoad();
    } else {
      detectedErrorType = null;
      if (response.accentColor) {
        document.documentElement.style.setProperty('--accent-base', response.accentColor);
      }
      inp.value = (response.minFileSize || 0) / 1048576;
      chk.checked = response.enabled !== false;
      
      chrome.storage.local.set({ 
        enabled: response.enabled !== false, 
        minFileSize: response.minFileSize || 0,
        accentColor: response.accentColor // 缓存获取到的颜色
      });
      tryShowUI();
    }
  });
}

function fallbackLoad() {
  chrome.storage.local.get(["minFileSize", "enabled"], (r) => {
    inp.value = (r.minFileSize || 0) / 1048576;
    chk.checked = r.enabled !== false;
    tryShowUI();
  });
}

function tryShowUI() {
  if (loadingPanel) loadingPanel.style.display = "none";
  
  if (detectedErrorType) {
    showErrorPanel(detectedErrorType);
  } else {
    showSettingsPanel();
  }
}

function showSettingsPanel() {
  settingsPanel.style.display = "block";
  promptPanel.style.display = "none";
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.local.remove("errorState");
}

function showErrorPanel(type) {
  settingsPanel.style.display = "none";
  promptPanel.style.display = "flex";
  
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#E81123" });
  chrome.storage.local.set({ errorState: type });

  document.getElementById("btnIgnore").textContent = chrome.i18n.getMessage("promptGotIt") || "Ignore";
  document.getElementById("btnIgnore").onclick = () => showSettingsPanel(); 

  if (type === "not_installed") {
    document.getElementById("titleMsg").textContent = chrome.i18n.getMessage("promptNotInstalledTitle");
    document.getElementById("descMsg").textContent = chrome.i18n.getMessage("promptNotInstalledDesc");
    document.getElementById("btnAction").textContent = chrome.i18n.getMessage("promptStore");
    document.getElementById("btnAction").onclick = () => {
      chrome.tabs.create({ url: 'ms-windows-store://search/?query=Xiyi%20Download' });
      showSettingsPanel();
    };
  } else if (type === "not_running") {
    document.getElementById("titleMsg").textContent = chrome.i18n.getMessage("promptNotRunningTitle");
    document.getElementById("descMsg").textContent = chrome.i18n.getMessage("promptNotRunningDesc");
    document.getElementById("btnAction").textContent = chrome.i18n.getMessage("promptLaunch");
    document.getElementById("btnAction").onclick = () => {
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "launch" });
      showSettingsPanel();
    };
  }
}

chk.addEventListener("change", () => {
  const enabled = chk.checked;
  const minFileSize = Math.round((parseFloat(inp.value) || 0) * 1048576);
  chrome.storage.local.set({ enabled });
  chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "settings", enabled, minFileSize });
});

inp.addEventListener("change", () => {
  const enabled = chk.checked;
  const minFileSize = Math.round((parseFloat(inp.value) || 0) * 1048576);
  chrome.storage.local.set({ minFileSize });
  chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "settings", enabled, minFileSize });
});

init();