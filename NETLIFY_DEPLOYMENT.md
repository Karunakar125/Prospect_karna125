# 🚀 Netlify Deployment Guide for ProspectPilot

This document provides step-by-step instructions for deploying **ProspectPilot** on **Netlify**, including environment variable configuration, API key setup, build settings, and serverless API routing.

---

## 📋 Overview & Architecture

ProspectPilot is a full-stack AI application built with React + Vite (frontend) and Express + Gemini AI (backend API).

On Netlify:
1. **Frontend**: Served as a static single-page application (SPA) from the `dist` build directory.
2. **Backend**: Express API routes (`/api/*`) run as a Netlify Serverless Function located at `netlify/functions/api.ts` via `serverless-http`.

---

## ⚙️ 1. Netlify Build Configuration

When connecting your repository (GitHub / GitLab / Bitbucket) to Netlify, set these build parameters:

| Configuration | Value | Purpose |
| :--- | :--- | :--- |
| **Build Command** | `npm run build` | Compiles Vite React frontend assets |
| **Publish Directory** | `dist` | Serves compiled client bundle |
| **Functions Directory** | `netlify/functions` | Handles backend Express routes (`/api/*`) |
| **Node.js Version** | `20` | Runtime Node environment |

*(Note: The included `netlify.toml` automatically configures all of these settings for you).*

---

## 🔑 2. Environment Variables & Secrets to Set in Netlify

You must add the following **Environment Variables** in Netlify to enable the AI auditing and lead scraping engines.

### 🛡️ Secrets & Variables Table

| Environment Variable | Required / Optional | Description | Where to get it |
| :--- | :---: | :--- | :--- |
| **`GEMINI_API_KEY`** | **REQUIRED** | Powers Gemini 3.6 Vision website auditing & cold email draft generation. | Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey). |
| **`GEOAPIFY_API_KEY`** | **OPTIONAL** | Enables live local business scraping by city & niche via Geoapify Places API. *(If omitted, ProspectPilot automatically defaults to built-in sample lead generation).* | Get a free API key from [Geoapify](https://www.geoapify.com/). |
| **`SERVERLESS`** | **REQUIRED** | Set value to `true`. Instructs Express not to launch a standalone HTTP port listener in serverless mode. | Set value to `true` |
| **`NODE_VERSION`** | **RECOMMENDED** | Set value to `20`. Specifies Node runtime version. | Set value to `20` |

---

## 📝 3. Step-by-Step Instructions: How to Add Secrets in Netlify

1. Log into your **[Netlify Dashboard](https://app.netlify.com)**.
2. Select your site (or click **Add new site > Import an existing project** to link your repository).
3. Navigate to **Site Configuration** (or **Site settings**) in the left menu.
4. Click on **Environment variables**.
5. Click **Add a variable** (or **Add variables > Import from a .env file**).
6. Enter each key-value pair as shown below:

   - **Key**: `GEMINI_API_KEY`  
     **Value**: `AIzaSy...` *(paste your Google Gemini API key)*
     **Scopes**: All scopes (Builds, Functions, Post-processing)

   - **Key**: `GEOAPIFY_API_KEY` *(Optional)*  
     **Value**: `your_geoapify_key_here`  
     **Scopes**: All scopes

   - **Key**: `SERVERLESS`  
     **Value**: `true`  
     **Scopes**: Functions & Builds

   - **Key**: `NODE_VERSION`  
     **Value**: `20`  
     **Scopes**: Builds

7. Click **Save** (or **Save variables**).
8. Go to the **Deploys** tab and click **Trigger deploy > Clear cache and deploy site** to ensure your site builds using the newly added environment variables.

---

## 🛠️ 4. Included Configuration Files (`netlify.toml` & Function Adapter)

### Project Root `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"
  SERVERLESS = "true"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Serverless Function Handler (`netlify/functions/api.ts`)
```ts
import serverless from 'serverless-http';
import { app } from '../../server';

export const handler = serverless(app);
```

---

## 🧪 5. Post-Deployment Verification

Once your Netlify deployment finishes:
1. Open your live site URL (e.g., `https://your-app-name.netlify.app`).
2. Test the API Health Check endpoint by visiting `https://your-app-name.netlify.app/api/health` in your browser. You should receive a JSON response:
   ```json
   {
     "status": "ok",
     "hasGeminiKey": true,
     "hasGeoapifyKey": true
   }
   ```
3. Test a Prospecting Pipeline: Select a niche (e.g., *Dentists* or *Plumbers*) and city (*Austin, TX*), then click **Start Prospecting & AI Audit Pipeline**.
4. Confirm that ProspectPilot extracts leads, analyzes website screenshots with Gemini Vision, and renders personalized cold email drafts!
