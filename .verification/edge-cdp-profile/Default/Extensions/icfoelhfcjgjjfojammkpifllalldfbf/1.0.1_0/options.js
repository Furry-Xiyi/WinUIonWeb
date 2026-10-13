const NATIVE_HOST_NAME = "com.xiyi.download";

const ids = ["extName", "lblEnabled", "lblSize", "lblDesc"];
ids.forEach(id => {
  const msg = chrome.i18n.getMessage(id);
  if (msg) document.getElementById(id).textContent = msg;
});

const chk = document.getElementById("chkEnabled");
const inp = document.getElementById("minSize");

// 同样先一步读取颜色缓存
chrome.storage.local.get(["accentColor"], (r) => {
  if (r.accentColor) {
    document.documentElement.style.setProperty('--accent-base', r.accentColor);
  }
});

function init() {
  chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "get_settings" }, (response) => {
    if (response && response.status === "ok") {
      if (response.accentColor) {
        document.documentElement.style.setProperty('--accent-base', response.accentColor);
      }
      inp.value = (response.minFileSize || 0) / 1048576;
      chk.checked = response.enabled !== false;
      
      chrome.storage.local.set({ 
        enabled: response.enabled !== false, 
        minFileSize: response.minFileSize || 0,
        accentColor: response.accentColor // 缓存颜色
      });
    } else {
      chrome.storage.local.get(["minFileSize", "enabled"], (r) => {
        inp.value = (r.minFileSize || 0) / 1048576;
        chk.checked = r.enabled !== false;
      });
    }
  });
}
init();

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