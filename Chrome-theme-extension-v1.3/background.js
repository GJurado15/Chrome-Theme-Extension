var extensionTabId = null;

chrome.action.onClicked.addListener(function () {
  if (extensionTabId !== null) {
    chrome.tabs.get(extensionTabId, function (tab) {
      if (chrome.runtime.lastError || !tab) {
        openNewTab();
      } else {
        chrome.tabs.update(extensionTabId, { active: true });
        chrome.windows.update(tab.windowId, { focused: true });
      }
    });
  } else {
    openNewTab();
  }
});

function openNewTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") }, function (tab) {
    extensionTabId = tab.id;
  });
}

chrome.tabs.onRemoved.addListener(function (tabId) {
  if (tabId === extensionTabId) extensionTabId = null;
});
