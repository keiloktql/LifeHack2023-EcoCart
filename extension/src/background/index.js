console.info('chrome-ext template-vanilla-js background script')

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    newsSite: 'gnn',
    netFlix: true,
    mySport: 'football',
    myHobby: 'reading',
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'complete' && /^https:\/\/shopee.sg/.test(tab.url)) {
      console.log('shopee loading completed.')
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ['./index.js.js'],
        })
        .then(() => {
          console.log('Injected Foreground JS.')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('shopee loading not completed.')
    }
  } catch (err) {
    console.log('background error', err)
  }
})

export {}
