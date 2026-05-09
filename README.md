<p align="center">
  <img src="public/favicon.jpg" alt="HorizonVista" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">HorizonVista</h1>

<p align="center">
  <strong>AI-powered travel agency website with an intelligent chat assistant</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#environment-variables">Environment Variables</a>
</p>

---

## Features

- 🤖 **AI Travel Assistant** — Interactive chatbot powered by a RAG backend (via n8n), providing instant answers about packages, pricing, policies, and destinations
- 🏝️ **Travel Package Showcase** — Curated travel packages with pricing, duration, and "Ask AI" quick actions
- 📊 **Smart Insights Dashboard** — Dynamic pricing, multilingual support, and booking intent analytics
- 📝 **Custom Booking Form** — Collect traveler preferences (dates, budget, group size) for tailored itineraries
- 💬 **Telegram Integration** — Users can also chat with the AI agent through Telegram
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🌙 **Modern Design** — Clean UI with smooth animations, gradient accents, and premium aesthetics

## Tech Stack

| Layer        | Technology                                                   |
| ------------ | ------------------------------------------------------------ |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix  |
| **Backend**  | Node.js, Express (lightweight API proxy)                     |
| **AI Agent** | n8n webhook (RAG-based travel consultant)                    |
| **Styling**  | Tailwind CSS + custom design tokens, Inter & Plus Jakarta Sans |
| **Deploy**   | Docker (multi-stage), GitHub Actions → GHCR → Portainer     |

## Getting Started

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/SmartGaters/horizonVista.git
cd horizonVista

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your n8n credentials
```

### Development

You need to run both the backend API server and the Vite dev server:

```bash
# Option 1: Run both together
npm run dev:all

# Option 2: Run separately (two terminals)
npm run dev:server   # Express API on :3001
npm run dev          # Vite frontend on :8080
```

The Vite dev server automatically proxies `/api/*` requests to the Express backend — no CORS issues during development.

Open **http://localhost:8080** in your browser.

### Available Scripts

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start Vite dev server (frontend only)          |
| `npm run dev:server` | Start Express API server                     |
| `npm run dev:all`  | Start both frontend and backend concurrently   |
| `npm run build`    | Build frontend for production                  |
| `npm start`        | Start production server (serves API + static)  |
| `npm run lint`     | Run ESLint                                     |
| `npm test`         | Run tests with Vitest                          |

## Project Structure

```
horizonVista/
├── ai/                       # AI Agent configuration
│   ├── knowledge_base/       # JSON knowledge base files for the AI
│   ├── n8n_workflows/        # n8n exported workflows
│   └── prompts/              # System prompts for AI agents
├── docs/                     # Project documentation
│   ├── HorizonVista_Presentation.html # HTML presentation
│   ├── HorizonVist_Report.pdf         # Final report
│   ├── Report.md                      # Markdown report source
│   ├── pictures/                      # Presentation assets
│   └── ...                            # Flowcharts, spreadsheets, evaluations
├── scripts/                  # Utility scripts (e.g., build scripts)
├── server/
│   └── index.js              # Express API server (chat proxy + static serving)
├── src/
│   ├── components/           # React components (ui, layouts, pages)
│   ├── pages/                # App routes
│   ├── lib/                  # Utilities and constants
│   ├── hooks/                # Custom React hooks
│   ├── App.tsx               # App root with routing
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── .env.example              # Environment variable template
├── Dockerfile                # Multi-stage production build
├── vite.config.ts            # Vite configuration with API proxy
└── package.json
```

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable          | Description                          | Default                                                                 |
| ----------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `N8N_USERNAME`    | n8n webhook Basic Auth username      | `access_token`                                                          |
| `N8N_PASSWORD`    | n8n webhook Basic Auth password      | —                                                                       |
| `N8N_WEBHOOK_URL` | Full URL to the n8n chat webhook     | `https://n8n.hamzasallam.online/webhook/horizonvista/api/send-message`  |
| `PORT`            | Express server port                  | `3001`                                                                  |

> **Note:** When the n8n access token expires, just update `N8N_PASSWORD` in `.env` and restart the server. No code changes needed.

## Deployment

### Docker

```bash
# Build the image
docker build -t horizon-vista .

# Run the container
docker run -p 3001:3001 \
  -e N8N_PASSWORD=your_token_here \
  horizon-vista
```

The production container runs a single Express process that serves both the built React frontend and the `/api/chat` endpoint.

### CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Builds the Docker image on push to `main`
2. Pushes it to GitHub Container Registry (GHCR)
3. Triggers a Portainer webhook for automatic deployment

**Required GitHub Secrets:**
- `PORTAINER_STACK_NAME` — Portainer stack identifier
- `WEBHOOK` — Portainer webhook token

## API Reference

### `POST /api/chat`

Send a message to the AI travel assistant.

**Request:**
```json
{
  "message": "Tell me about Cappadocia packages",
  "sessionId": "optional-session-uuid"
}
```

**Response:**
```json
{
  "output": "We have an amazing Cappadocia Cave & Balloon Experience package...",
  "sessionId": "uuid-v4"
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-09T12:00:00.000Z"
}
```

---

<p align="center">
  Built by <a href="https://github.com/SmartGaters">SmartGaters</a>
</p>
