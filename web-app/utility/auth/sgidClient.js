import { SgidClient } from "@opengovsg/sgid-client";

const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY),
  redirectUri:
    process.env.NEXT_PUBLIC_ENVIRONMENT !== "DEV"
      ? "https://ecocart.web.app/api/redirect"
      : "http://localhost:3001/api/redirect"
});

export { sgidClient };
