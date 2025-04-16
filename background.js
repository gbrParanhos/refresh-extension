let refreshInterval = 30;
let switchInterval = 30;

function switchTabs() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    let activeTabIndex = tabs.findIndex(tab => tab.active);
    let nextTabIndex = (activeTabIndex + 1) % tabs.length;
    chrome.tabs.update(tabs[nextTabIndex].id, { active: true });
  });
}

function refreshAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => chrome.tabs.reload(tab.id));
  });
}

function startAutoSwitch() {
  chrome.alarms.create("refreshTabs", { periodInMinutes: refreshInterval });
  chrome.alarms.create("switchTabs", { periodInMinutes: switchInterval / 60 });

  chrome.windows.getCurrent(window => {
    chrome.windows.update(window.id, { state: "fullscreen" });
  });

  chrome.storage.local.set({ running: true });
}

function stopAutoSwitch() {
  chrome.alarms.clear("refreshTabs");
  chrome.alarms.clear("switchTabs");
  chrome.storage.local.set({ running: false });
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "refreshTabs") {
    refreshAllTabs();
  } else if (alarm.name === "switchTabs") {
    switchTabs();
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["running"], (data) => {
    if (data.running) startAutoSwitch();
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startAutoSwitch();
  } else if (message.action === "stop") {
    stopAutoSwitch();
  }
});
