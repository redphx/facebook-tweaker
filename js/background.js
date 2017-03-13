chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  switch (request.cmd) {
    case 'manageConfigs':
      chrome.tabs.create({
        url: chrome.runtime.getURL('configs.html'),
      }, function(tab) {
        setTimeout(function() {
          chrome.tabs.sendMessage(tab.id, {
            cmd: 'configs',
            fbConfigs: request.fbConfigs,
          });
        }, 1000);

      });
      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && /https?:\/\/(www|web)\.facebook\.com.*/.test(tab.url)) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.id, {
    code: 'sendFbConfigs()',
  });
});
