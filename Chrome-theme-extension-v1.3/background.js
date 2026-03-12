var popupWindowId = null;

chrome.action.onClicked.addListener(function () {
  if (popupWindowId !== null) {
    chrome.windows.get(popupWindowId, function (win) {
      if (chrome.runtime.lastError || !win) {
        openPopupWindow();
      } else {
        chrome.windows.update(popupWindowId, { focused: true });
      }
    });
  } else {
    openPopupWindow();
  }
});

function openPopupWindow() {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 432,
    height: 780,
  }, function (win) {
    popupWindowId = win.id;
  });
}

chrome.windows.onRemoved.addListener(function (windowId) {
  if (windowId === popupWindowId) popupWindowId = null;
});
