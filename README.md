# 🎯 ProspectPilot - B2B Lead Scraping & AI Website Audit Outreach Engine

ProspectPilot is an automated B2B lead generation, website auditing, and hyper-personalized cold outreach engine. It enables agencies and B2B marketers to discover local businesses across 100+ US cities, analyze target websites using Gemini 3.6 Vision, extract contact emails, and compose personalized cold emails following the **Observation → Insight → Gap** framework.

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables template
cp .env.example .env

# 3. Add your Gemini API Key to .env
# GEMINI_API_KEY="AIzaSy..."

# 4. Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` to access ProspectPilot.

---

## 🌐 Netlify Deployment

For complete instructions on deploying ProspectPilot to Netlify, see **[NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)**.

### Summary of Required Netlify Environment Variables:

| Secret / Variable | Value | Purpose |
| :--- | :--- | :--- |
| **`GEMINI_API_KEY`** | `AIzaSy...` | Required for Gemini Vision website audits and cold email generation |
| **`GEOAPIFY_API_KEY`** | `your_key` | Optional for live Geoapify lead scraping (falls back to sample mode if omitted) |
| **`SERVERLESS`** | `true` | Required for Netlify serverless Express routing |
| **`NODE_VERSION`** | `20` | Recommended Node runtime version |

---

## 🛠️ Built With

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend**: Node.js, Express, `serverless-http`
- **AI Engine**: `@google/genai` (Gemini 3.6 Vision)
- **Scraping**: Geoapify Places API, Microlink Vision API
