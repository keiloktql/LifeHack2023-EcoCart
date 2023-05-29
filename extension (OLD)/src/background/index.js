import { createClient } from '@supabase/supabase-js'
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
          files: ['./index.js'],
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

const SUPABASE_PUBLIC_URL = 'https://raxkpyazhqcszrhtppyi.supabase.co'
const SUPABASE_PUBLIC_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGtweWF6aHFjc3pyaHRwcHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUyNTY3OTksImV4cCI6MjAwMDgzMjc5OX0.RDomwou8YUMUufWN3CwOK0Rz_eHfQu5Tbvf-FF9ZiI4'
const supabaseClient = createClient(SUPABASE_PUBLIC_URL, SUPABASE_PUBLIC_ANON_KEY)

const handleMessage = async (msg, sender, response) => {
  if (msg.command == 'loginUser') {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    })
    const user = data?.user || null
    if (user) {
      console.log('user', user)
      response({ type: 'auth', status: 'success', message: user })
    } else {
      console.log('error', error)
      // No user is signed in.
      response({ type: 'auth', status: 'no-auth', message: false })
    }
  }
  return true
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  handleMessage(msg, sender, response)
  return true
})

export {}
