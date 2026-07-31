# Deployment Guide: Vercel + Cloudflare Workers

This guide explains how to deploy NEO Hazard Classifier with **Vercel** (frontend) and **Cloudflare Workers** (backend).

## Prerequisites

- GitHub account (code is already pushed to [msaad732/NEO-Hazard-Classifier-NLP-Chatbot](https://github.com/msaad732/NEO-Hazard-Classifier-NLP-Chatbot))
- Vercel account (free tier) - [vercel.com](https://vercel.com)
- Cloudflare account (free tier, **no credit card required**) - [dash.cloudflare.com](https://dash.cloudflare.com)
- Node.js + npm installed locally

---

## Part 1: Deploy Backend to Cloudflare Workers

### Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens your browser to authorize Cloudflare. Approve the login, then return to terminal.

### Step 2: Create KV Namespace (for caching)

```bash
npx wrangler kv:namespace create "CACHE"
npx wrangler kv:namespace create "CACHE" --preview
```

Note the namespace IDs returned. Update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-production-id-here"
preview_id = "your-preview-id-here"
```

### Step 3: Deploy Worker

```bash
npm run build:worker
npx wrangler deploy
```

Wrangler will:
1. Build the worker from `worker.ts`
2. Deploy to Cloudflare Workers
3. Provide your worker URL: `https://neo-hazard-classifier.<account>.workers.dev`

**Save this URL** — you'll need it for the Vercel frontend config.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Select **Import Git Repository**
4. Find and authorize [msaad732/NEO-Hazard-Classifier-NLP-Chatbot](https://github.com/msaad732/NEO-Hazard-Classifier-NLP-Chatbot)

### Step 2: Configure Environment Variables

Before deploying, set the worker URL in Vercel:

1. In Project Settings → **Environment Variables**
2. Add:
   - **Name:** `VITE_API_BASE`
   - **Value:** `https://neo-hazard-classifier.<account>.workers.dev`
   - **Environments:** Production, Preview, Development

### Step 3: Deploy

Click **Deploy**. Vercel will:
1. Clone your GitHub repo
2. Install dependencies
3. Run `npm run build` (builds frontend only, backend ignored via `.vercelignore`)
4. Deploy to Vercel CDN

Your frontend will be live at: `https://<project-name>.vercel.app`

---

## Verification

### Check Backend Health
```bash
curl https://neo-hazard-classifier.<account>.workers.dev/api/earthquakes
```

Should return a JSON array of earthquake data.

### Check Frontend
Visit your Vercel URL and verify:
- Dashboard loads
- Earthquake data displays
- "Refresh" button fetches new data
- Chat and ML Predictor tabs work

### Check API Base URL (in browser console)
```javascript
fetch(`${process.env.VITE_API_BASE}/api/earthquakes`).then(r => r.json())
```

Should return earthquakes from your Worker.

---

## Cost

- **Vercel:** Free tier covers this project
- **Cloudflare Workers:** 100,000 free requests/day (plenty for this app)
- **Total monthly cost:** $0 (no credit card required)

---

## Updating After Deployment

### Frontend Changes
Push to GitHub → Vercel auto-deploys

### Backend Changes
1. Update `worker.ts`
2. Test locally: `wrangler dev`
3. Deploy: `npm run deploy:worker`

### Both Changes
Same as above — frontend and backend deploy independently.

---

## Troubleshooting

### Worker not responding
```bash
npx wrangler tail  # View real-time logs
npx wrangler logs  # View deployment logs
```

### Frontend can't reach backend
- Check `VITE_API_BASE` environment variable in Vercel
- Verify worker URL is correct in env var
- Check CORS headers (worker already includes them)

### Build fails on Vercel
Ensure `.vercelignore` excludes backend files, only `dist/public/` is deployed.

---

## Environment Variables Summary

### Vercel (Frontend)
- `VITE_API_BASE`: Worker URL (e.g., `https://neo-hazard-classifier.workers.dev`)

### Cloudflare Worker
- No env vars required (uses KV namespace automatically)

---

## Links

- **GitHub Repo:** https://github.com/msaad732/NEO-Hazard-Classifier-NLP-Chatbot
- **Vercel Docs:** https://vercel.com/docs
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/cli-wrangler/install-update/
