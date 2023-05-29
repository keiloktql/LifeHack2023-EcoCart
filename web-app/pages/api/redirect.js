import { store } from "@/utility/auth/sgidStore";
import { sgidClient } from "@/utility/auth/sgidClient";
import { getCookie, setCookie } from "cookies-next";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@/config/constants";

export default async function handler(req, res) {
  // Retrieve the authorization code from query params
  let { code, state } = req.query;

  // Retrieve the session ID from browser cookies
  const sessionId = getCookie("sessionId", { req, res });

  // Validating that the sessionID, contents in session, and auth code is present
  if (typeof sessionId !== "string") {
    return res.status(401).send("Session ID not found in browser cookies");
  } else if (!code) {
    return res.status(400).send("Authorization code not found in query params");
  }
  code = String(code);

  const session = store.get(sessionId);

  if (!session) {
    return res.status(401).send("Session not found");
  } else if (state && state !== session.state) {
    return res.status(400).send("State does not match");
  }

  const { nonce, codeVerifier } = session;

  if (!codeVerifier || typeof codeVerifier !== "string") {
    return res.status(400).send("Code verifier not found");
  }

  // Exchange the auth code for the access token
  // At the end of this function, users are considered logged in by the sgID server
  const { accessToken, sub } = await sgidClient.callback({
    code,
    nonce,
    codeVerifier
  });

  // Store the access token and sub
  const updatedSession = {
    ...session,
    accessToken,
    sub
  };
  store.set(sessionId, updatedSession);

  // Update supabase that user is sgid verified
  const supabase = createClient(
    SUPABASE_CONFIG.url,
    process.env.SUPABASE_SERVICE_ROLE,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  let sgidVerified = false;
  if (state) {
    const { error } = await supabase
      .from("accounts")
      .update({ sgid_verified: true })
      .eq("uuid", state);
    console.log(error);
    if (!error) {
      sgidVerified = true;
    }
  }

  res.redirect(
    `/dashboard?${sgidVerified ? "sgid_verified=true" : "sgid_verified=false"}`
  );
}
