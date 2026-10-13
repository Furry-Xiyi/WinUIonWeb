const NATIVE_HOST_NAME = "com.xiyi.download";
let minFileSize = 0;
let enabled = true;

// 优先从缓存读取，保证第一时间响应下载请求
chrome.storage.local.get(["minFileSize", "enabled"], (result) => {
  if (result.minFileSize !== undefined) minFileSize = result.minFileSize;
  if (result.enabled !== undefined) enabled = result.enabled;
});

// 【关键新增】每次 Service Worker 休眠醒来时，静默去底层应用拉取最新配置，防止数据脱节
chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "get_settings" }, (response) => {
  if (response && response.status === "ok") {
    chrome.storage.local.set({ 
      enabled: response.enabled !== false, 
      minFileSize: response.minFileSize || 0 
    });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.minFileSize) minFileSize = changes.minFileSize.newValue;
    if (changes.enabled) enabled = changes.enabled.newValue;
  }
});

chrome.downloads.onCreated.addListener((item) => {
  if (!enabled || item.state !== "in_progress") return;

  if (minFileSize > 0 && item.fileSize > 0 && item.fileSize < minFileSize) {
    return;
  }

  // 立刻拦截暂停
  chrome.downloads.pause(item.id, () => {
    const message = {
      type: "download",
      url: item.finalUrl || item.url,
      filename: item.filename || "",
      fileSize: item.totalBytes || item.fileSize || 0,
      referrer: item.referrer || ""
    };

    chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, message, (response) => {
      if (chrome.runtime.lastError) {
        handleError("not_installed", item.id);
      } else if (!response || response.status === "error") {
        handleError("not_running", item.id);
      } else {
        // 成功，无痕删除文件
        chrome.downloads.cancel(item.id, () => {
          chrome.downloads.removeFile(item.id, () => {
            chrome.downloads.erase({ id: item.id }); 
          });
        });
      }
    });
  });
});

function handleError(type, downloadId) {
  // 恢复浏览器的原生下载
  chrome.downloads.resume(downloadId);
  
  // 保存错误状态给 popup
  chrome.storage.local.set({ errorState: type });
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#E81123" });

  // 弹出带有两个可操作按钮的系统通知
  chrome.notifications.create(type + "_" + downloadId, {
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: chrome.i18n.getMessage("extName"),
    message: chrome.i18n.getMessage(type === "not_installed" ? "promptNotInstalledDesc" : "promptNotRunningDesc"),
    requireInteraction: true, // 重要：在 Windows 上保持通知展开，确保按钮显示出来
    buttons: [
      { title: chrome.i18n.getMessage("btnIgnore") }, // 按钮 0: 忽略
      { title: chrome.i18n.getMessage(type === "not_installed" ? "promptStore" : "promptLaunch") } // 按钮 1: 安装/启动
    ]
  });
}

// 监听通知上的按钮点击事件
chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  // 如果点击的是索引为 1 的按钮（即“安装”或“启动应用程序”）
  if (btnIdx === 1) {
    if (notifId.startsWith("not_installed")) {
      chrome.tabs.create({ url: 'ms-windows-store://search/?query=Xiyi%20Download' });
    } else if (notifId.startsWith("not_running")) {
      // 触发启动主程序的原生消息
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { type: "launch" });
    }
  }
  
  // 如果点击的是 0 (忽略)，或者执行完上述操作后，都清理掉这个通知
  chrome.notifications.clear(notifId);
});