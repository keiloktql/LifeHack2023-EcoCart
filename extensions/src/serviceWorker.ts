import { initializeStorageWithDefaults } from './storage';

chrome.runtime.onInstalled.addListener(async () => {
  // Here goes everything you want to execute after extension initialization

  await initializeStorageWithDefaults({});

  console.log('Extension successfully installed!');
});

// Log storage changes, might be safely removed
chrome.storage.onChanged.addListener((changes) => {
  for (const [key, value] of Object.entries(changes)) {
    console.log(
      `"${key}" changed from "${value.oldValue}" to "${value.newValue}"`,
    );
  }
});

// Execute foreground script when shopee.sg is loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (
      changeInfo.status === 'complete' &&
      /^https:\/\/shopee.sg/.test(tab.url)
    ) {
      console.log('shopee loading completed.');
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ['./foreground.js'],
        })
        .then(() => {
          console.log('Injected Foreground JS.');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('shopee loading not completed.');
    }
  } catch (err) {
    console.log('background error', err);
  }
});
