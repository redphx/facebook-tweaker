chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  switch (request.cmd) {
    case 'manageConfigs':
      chrome.tabs.create({
        url: chrome.runtime.getURL('configs.html'),
      }, tab => {
        setTimeout(() => {
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
  if (tab.url && tab.url.indexOf('https://www.facebook.com') === 0) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(tab.id, {
    code: 'sendFbConfigs()',
  });
});
