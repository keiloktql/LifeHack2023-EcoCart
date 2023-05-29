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

// == Kei Lok's region ==
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'signInWithGoogle': {
      // remove any old listener if exists
      chrome.tabs.onUpdated.removeListener(setTokens);
      const url = request.payload.url;

      // create new tab with that url
      chrome.tabs.create({ url: url, active: true }, (tab) => {
        // add listener to that url and watch for access_token and refresh_token query string params
        chrome.tabs.onUpdated.addListener(setTokens);
        sendResponse(request.action + ' executed');
      });

      break;
    }

    default:
      break;
  }

  return true;
});

const chromeStorageKeys = {
  gauthAccessToken: 'gauthAccessToken',
  gauthRefreshToken: 'gauthRefreshToken',
};

const setTokens = async (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) => {
  // once the tab is loaded
  if (tab.status === 'complete') {
    if (!tab.url) return;
    const url = new URL(tab.url);

    // at this point user is logged-in to the web app
    // url should look like this: https://my.webapp.com/#access_token=zI1NiIsInR5c&expires_in=3600&provider_token=ya29.a0AVelGEwL6L&refresh_token=GEBzW2vz0q0s2pww&token_type=bearer
    // parse access_token and refresh_token from query string params
    if (url.origin === 'https://ecocart-lifehack2023.netlify.app') {
      const params = new URL(url.href).searchParams;
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');

      if (accessToken && refreshToken) {
        if (!tab.id) return;

        // we can close that tab now
        await chrome.tabs.remove(tab.id);

        // store access_token and refresh_token in storage as these will be used to authenticate user in chrome extension
        await chrome.storage.sync.set({
          [chromeStorageKeys.gauthAccessToken]: accessToken,
        });
        await chrome.storage.sync.set({
          [chromeStorageKeys.gauthRefreshToken]: refreshToken,
        });

        // remove tab listener as tokens are set
        chrome.tabs.onUpdated.removeListener(setTokens);
      }
    }
  }
};
