# MathVision Vercel Backend Deployment

This repo contains both the Expo mobile app and the backend. On Vercel, only the backend is deployed through the files in `api/`.

## Vercel Project Settings

- Framework Preset: Other
- Build Command: use the `vercel.json` default
- Output Directory: leave empty
- Install Command: leave default

## Environment Variables

Set these in Vercel:

```env
NODE_ENV=production
WOLFRAM_APP_ID=K2X7RW7V86
OAUTH_SERVER_URL=https://YOUR-VERCEL-PROJECT.vercel.app
EXPO_PUBLIC_API_BASE_URL=https://YOUR-VERCEL-PROJECT.vercel.app
EXPO_PUBLIC_SUPABASE_URL=https://tzegsxxcsxzlagilenpk.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_Uh910MG9bq5y_xxk8dmdSA_9otoKbor
```

## Test Endpoints

After deployment, open these in a browser:

```text
https://YOUR-VERCEL-PROJECT.vercel.app/api/health
https://YOUR-VERCEL-PROJECT.vercel.app/api/status
```

Test solving with curl/Postman:

```bash
curl -X POST https://YOUR-VERCEL-PROJECT.vercel.app/api/solve \
  -H "Content-Type: application/json" \
  -d "{\"equation\":\"x^2 - 5x + 6 = 0\"}"
```

Expected response shape:

```json
{
  "type": "Algebraic",
  "result": "x = 2; x = 3",
  "steps": []
}
```

`steps` should be an array. Its length depends on what Wolfram returns for that equation.

## Expo App After Backend Deploy

Update `.env` locally before building the mobile app:

```env
OAUTH_SERVER_URL=https://YOUR-VERCEL-PROJECT.vercel.app
EXPO_PUBLIC_API_BASE_URL=https://YOUR-VERCEL-PROJECT.vercel.app
```

Then rebuild/reload the Expo app.
