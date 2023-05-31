# EcoCart Dashboard Built with NextJS

## Getting Started

### SGID

Before you can run the development server, you will have to register your client on the sgID [developer portal](https://developer.id.gov.sg/).

- For this example, you will need to include the following scopes `[openid, myinfo.name]` and register the following redirect URL `http://localhost:3000/api/redirect`

> For more information about sgID, please visit the [developer documentation](https://docs.id.gov.sg/).

### Supabase

- You will also have to register a project on Supabase.

In summary,
Copy the `.env.example` file, rename it to `.env.local`, and fill in your credentials obtained during registration.

Then, run the development server by running:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Cheers!
