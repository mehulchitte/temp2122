# ResortOS — Vercel-ready

A React/Vite resort management prototype with Vercel-compatible serverless API routes and optional Gemini AI.

## Deploy to Vercel

1. Upload this project to GitHub, or import the ZIP/project into Vercel.
2. Vercel should detect **Vite** automatically.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `GEMINI_API_KEY` under Vercel Environment Variables if live Gemini features are required.
6. Deploy.

The API is exposed from `api/index.ts` and keeps the existing frontend `/api/...` calls unchanged.

## Local development

```bash
npm install
npm run dev
```

For local AI, create `.env.local` with:

```env
GEMINI_API_KEY=your_key
```

Note: Vercel deployment uses the serverless API function. The old always-running Express/Vite server has intentionally been removed from the deployment package.
