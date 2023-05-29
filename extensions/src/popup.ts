import '../styles/popup.scss';
import { createClient, User } from '@supabase/supabase-js';

getCurrentUser().then((resp) => {
  if (resp) {
    console.log('user id:', resp.user.id);
  } else {
    console.log('user is not found');
  }
});

document.getElementById('go-to-options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
document
  .querySelector('.login-btn-auth')
  .addEventListener('click', async function () {
    console.log('ran here 2');
    await signInWithGoogle();
  });

const SUPABASE_PUBLIC_URL = 'https://raxkpyazhqcszrhtppyi.supabase.co';
const SUPABASE_PUBLIC_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGtweWF6aHFjc3pyaHRwcHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUyNTY3OTksImV4cCI6MjAwMDgzMjc5OX0.RDomwou8YUMUufWN3CwOK0Rz_eHfQu5Tbvf-FF9ZiI4';
export const supabase = createClient(
  SUPABASE_PUBLIC_URL,
  SUPABASE_PUBLIC_ANON_KEY,
);

// get auth url
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  console.log(data);

  // tell background service worker to create a new tab with that url
  await chrome.runtime.sendMessage({
    action: 'signInWithGoogle',
    payload: { url: data.url }, // url is something like: https://[project_id].supabase.co/auth/v1/authorize?provider=google
  });
}
const chromeStorageKeys: any = {
  gauthAccessToken: 'gauthAccessToken',
  gauthRefreshToken: 'gauthRefreshToken',
};

export async function getCurrentUser(): Promise<null | {
  user: User;
  accessToken: string;
}> {
  chrome.storage.sync.get(null, function (items) {
    const allKeys = Object.keys(items);
    console.log(allKeys);
  });
  const gauthAccessToken = chrome.storage.sync.get(
    chromeStorageKeys.gauthAccessToken,
  )[chromeStorageKeys.gauthAccessToken];
  const gauthRefreshToken = chrome.storage.sync.get(
    chromeStorageKeys.gauthRefreshToken,
  )[chromeStorageKeys.gauthRefreshToken];

  if (gauthAccessToken && gauthRefreshToken) {
    try {
      // set user session from access_token and refresh_token
      const resp = await supabase.auth.setSession({
        access_token: gauthAccessToken,
        refresh_token: gauthRefreshToken,
      });

      const user = resp.data?.user;
      const supabaseAccessToken = resp.data.session?.access_token;

      if (user && supabaseAccessToken) {
        return { user, accessToken: supabaseAccessToken };
      }
    } catch (e: any) {
      console.error('Error: ', e);
    }
  }

  return null;
}
