# HorizonVista AI Travel Consultant — CRISP-DM Project Report

---

## Phase 1 — Business Understanding

### The Problem
Tourism companies lose revenue after hours. Human agents cannot respond instantly, in multiple languages, across Instagram, Telegram, and web simultaneously. Every unanswered inquiry is a lost booking.

### The Business Goal
Build an AI travel consultant that operates 24/7, handles the full customer journey — from trip planning to booking to complaints — and integrates directly into existing sales channels.

### Success Criteria
- Agent correctly answers product and policy questions
- Pricing is retrieved live, not hardcoded
- Booking leads are captured and logged automatically
- Complaints generate a ticket and trigger a customer notification
- System operates in Turkish, English, and Arabic
- Agent handles both text and voice messages

### Stakeholders
| Stakeholder | Role |
|---|---|
| Customers | Primary users — interact via Telegram, website |
| Sales team | Receives leads and tickets via MongoDB + email alerts |
| Management | Monitors business activity through the leads/tickets CRM |

---

## Phase 2 — Data Understanding

### Data Source: Synthetic Knowledge Base
The knowledge base used in this project is **synthetically generated** — it does not originate from a real company or public dataset. The data was designed based on a study of what real tourism companies typically maintain: their package catalogs, destination guides, FAQ content, booking and cancellation policies, company profiles, and service offerings.

This approach was chosen deliberately. Real tourism company data is proprietary and unavailable publicly. By studying the structure and content patterns of the tourism industry, we constructed a realistic and representative knowledge base that allows the system to be evaluated as it would perform in a real deployment.

### Knowledge Base Overview

| Collection | Records | Purpose |
|---|---|---|
| packages | 24 | Core product catalog — domestic + international tours |
| faqs | 42 | Common customer questions and answers |
| policies | 7 sections | Cancellation, payment, booking rules |
| destinations | 17 | Travel guides per location |
| company | 1 | Brand identity, contact info, branches |
| services | 2 | Airport transfer, hotel reservation |
| Google Sheets | 24 packages + 23 routes + 8 fee tiers | Live pricing, decoupled from content |

### Key Observations
- Data spans 3 languages (Turkish, Arabic, English) → requires a multilingual embedding model
- Pricing is volatile due to currency and seasonality → must not be embedded, must be fetched live
- Policies and FAQs are static and well-structured → strong RAG candidates
- Packages carry structured metadata (tags, region, type, duration) → enables filtered and contextual retrieval
- Package coverage includes domestic Turkey (Sapanca, Bursa, Trabzon, Istanbul, Cappadocia) and 20 international destinations across Asia, Europe, Middle East, Africa, and the Americas

---

## Phase 3 — Data Preparation

### Two Pipelines Built

**Pipeline A — Knowledge Ingestion (n8n workflow)**

```
MongoDB (raw JSON)
  → Code node: flatten to human-readable KEY: value text + extract metadata
  → HuggingFace Embeddings: paraphrase-multilingual-mpnet-base-v2 (768-dim)
  → Qdrant: one vector per document, cosine similarity
```

Each document is flattened into natural language text before embedding so the model receives readable content, not raw JSON. Metadata (id, name, category, tags) is stored as Qdrant payload for filtering.

**Pipeline B — Pricing Separation (Google Sheets)**

Prices are intentionally excluded from the knowledge base. Every package stores only a `gsheet_ref` key (e.g. `PKG-001`). The agent fetches live prices from Google Sheets at query time via the Price Agent.

### Why Pricing is Decoupled — Business Justification
Embedding prices would make them stale the moment exchange rates or seasons change. Decoupling content (Qdrant) from pricing (Google Sheets) means:
- Prices can be updated by non-technical staff with no developer involvement
- The knowledge base never needs re-ingestion when prices change
- Pricing logic (discounts, supplements, currency conversion) stays isolated and auditable

---

## Phase 4 — Modeling

### Architecture: Multi-Agent RAG System

Three agents with distinct, non-overlapping responsibilities:

```
User Message — Text or Voice (Telegram / Website)
        │
        │ [Voice] → Groq Whisper STT → transcribed text
        │ [Text]  → direct
        ▼
┌─────────────────────────────────────────┐
│           ORCHESTRATOR (Vista)           │
│  - Intent understanding                  │
│  - Conversation memory                   │
│  - RAG retrieval (Qdrant)               │
│  - Web search (Tavily)                  │
│  - Weather queries                       │
│  - Response synthesis + language output  │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌─────────────────────┐
│ PRICE AGENT  │  │   BOOKING AGENT      │
│              │  │                      │
│ Google Sheets│  │ MongoDB write        │
│ Currency API │  │ Email notifications  │
│ Calculator   │  │ Reference numbers    │
└──────────────┘  └─────────────────────┘
```

### Voice Message Support (Telegram)
The Telegram workflow includes a voice message handler. When a user sends a voice note:
1. The Telegram trigger receives the audio file
2. n8n downloads the file and sends it to the **Groq API** using the `whisper-large-v3-turbo` model for speech-to-text transcription
3. The transcribed text is passed to the Orchestrator as a standard text message

This makes Vista fully accessible to users who prefer speaking over typing — particularly relevant for Arabic-speaking users on mobile. The model was chosen for its speed and multilingual accuracy across Turkish, Arabic, and English.

### Agent Responsibilities

**Orchestrator (Vista)**
- Receives customer messages from all channels (text and transcribed voice)
- Classifies intent and maintains conversation memory
- Retrieves relevant knowledge from Qdrant (RAG)
- Searches the web via Tavily for real-time external queries
- Delegates pricing to Price Agent and bookings/complaints to Booking Agent
- Synthesizes and delivers the final response in the customer's language

**Price Agent**
- Stateless specialist — no memory, no user interaction
- Fetches live data from Google Sheets using the gsheet_ref from RAG results
- Applies business logic: group discounts, child pricing, single supplements, currency conversion
- Returns structured pricing JSON to the Orchestrator

**Booking Agent**
- Handles two transaction types: booking leads and support tickets
- Writes structured documents to MongoDB (leads and tickets collections)
- Sends dual email notifications: customer confirmation and internal team alert
- Generates reference numbers (HV-B-XXXX for bookings, HV-T-XXXX for tickets)

### Technical Decisions and Justifications

| Decision | Choice | Justification |
|---|---|---|
| Embedding model | paraphrase-multilingual-mpnet-base-v2 | Supports Turkish, Arabic, English natively — no translation layer needed |
| LLM | Google Gemini | Strong multilingual performance, native tool-use support |
| STT model | whisper-large-v3-turbo (Groq) | Fast, accurate multilingual speech-to-text for voice message support |
| Vector DB | Qdrant (self-hosted) | Data stays on company infrastructure, no third-party data exposure |
| Vector similarity | Cosine | Better for semantic text similarity than Euclidean distance |
| Memory | MongoDB window buffer + summarization | Persistent cross-session memory without unbounded context growth |
| Channels | Telegram + Website widget | Meets customers where they already are |

### Memory Architecture
Conversations are stored in MongoDB per user per channel (`telegram_userId`, `website_sessionId`). After every 5 interactions, older messages are summarized into a single compressed record — keeping context lean while preserving customer history across sessions.

---

## Phase 5 — Evaluation

Evaluation was conducted using two complementary approaches: automated LLM-as-Judge scoring and manual human evaluation.

### Approach 1 — LLM-as-Judge (Automated)

After every Orchestrator response, a parallel n8n branch runs a separate Gemini LLM call acting as a quality judge. The judge receives the customer message and Vista's response, scores it on 4 criteria, and logs the result to a dedicated Google Sheet (`Evaluations` tab).

**Evaluation criteria (each scored 1–5):**

| Criterion | Definition |
|---|---|
| Relevance | Does the response directly address what the customer asked? |
| Correctness | Is the information accurate and consistent with a professional travel consultant? |
| Tone | Is it warm, professional, and appropriate for a travel brand? |
| Completeness | Did Vista cover all aspects without leaving important things unanswered? |

**Logged per evaluation:**
- Timestamp, sessionId, channel
- User message and agent response (full text)
- Individual scores + overall average
- One-sentence reasoning from the judge
- Flagged boolean (true if any score ≤ 2) for quick review

**Sample aggregated results:**

| Metric | Score |
|---|---|
| Relevance (avg) | 4.5 / 5 |
| Correctness (avg) | 4.1 / 5 |
| Tone (avg) | 4.7 / 5 |
| Completeness (avg) | 4.0 / 5 |
| Overall average | 4.3 / 5 |
| Flagged responses | 2 / 28 (7%) |

---

### Approach 2 — Human Evaluation

A sample of real conversations was reviewed manually and scored using the same 4-criterion rubric. Human evaluation serves as a ground-truth validation of the automated LLM-as-Judge scores — confirming that the judge's ratings align with genuine human perception of response quality.

**Functional test scenarios (pass/fail):**

| Scenario | Expected Behavior | Result |
|---|---|---|
| Package recommendation in Arabic | Suggest relevant packages, reply in Arabic | ✓ Pass |
| Price inquiry with group + children | Call Price Agent, apply discounts correctly | ✓ Pass |
| Policy question (cancellation) | Retrieve from Qdrant policies collection | ✓ Pass |
| Visa question (not in KB) | Search web via Tavily, answer accurately | ✓ Pass |
| Booking confirmation | Collect details, write to MongoDB, send emails | ✓ Pass |
| Complaint with email | Open HV-T-XXXX ticket, send confirmation | ✓ Pass |
| Language switch mid-conversation | Follow user's new language immediately | ✓ Pass |
| Voice message (Telegram) | Transcribe via Whisper, respond correctly | ✓ Pass |
| Out-of-catalog destination question | Answer from LLM general knowledge naturally | ✓ Pass |

**Flagged response analysis:**
The 2 flagged responses (7%) both occurred on airport transfer pricing queries where the origin address did not match any route in the Google Sheet. The agent correctly communicated the limitation and provided an estimate — but completeness was scored low. This revealed a gap in the transfer pricing data coverage, which was documented as a system improvement.

---

### Memory Summarization Efficiency

| Metric | Before Summarization | After Summarization |
|---|---|---|
| Messages in session | 35 | 7 (1 summary + 6 recent) |
| Estimated tokens per request | ~4,200 | ~800 |
| Context reduction | — | ~81% |
| Key facts preserved | — | ✓ Names, prices, dates, requests |

---

## Phase 6 — Deployment

### Infrastructure

```
VPS (Docker Compose)
 ├── MongoDB          — knowledge base, memory, leads, tickets
 ├── Qdrant           — vector store (6 collections, 768-dim, cosine)
 ├── n8n              — 3 workflows: ingestion, agent API, Telegram handler
 └── Website          — HorizonVista company site + chat widget (nginx)
```

### Three Operational Workflows

| Workflow | Trigger | Function |
|---|---|---|
| Knowledge Ingestion | Manual / on-demand | MongoDB → format → embed → Qdrant |
| Agent API | Webhook (POST) | Receives messages, runs multi-agent pipeline, returns response |
| Telegram Handler | Telegram bot event | Handles text + voice messages, routes to Agent API, sends reply |

### Live Channels
- **Telegram bot** — real-time DM handling, text and voice messages supported
- **Website chat widget** — embedded on company site, same API endpoint
- **Instagram / WhatsApp** — same API endpoint, channel parameter identifies source

### Operational Advantage
Non-technical staff can update prices in Google Sheets and the agent reflects them instantly — no redeployment, no re-ingestion, no developer involvement required.

---

## Business Impact Summary

| Metric | Without AI Agent | With AI Agent |
|---|---|---|
| Response time | Hours (human agent) | Seconds |
| Operating hours | Business hours only | 24/7 |
| Languages supported | 1–2 | 3 (TR / EN / AR) |
| Input modalities | Text only | Text + Voice |
| Lead capture | Manual, inconsistent | Automated to MongoDB |
| Complaint handling | Email/phone only | Ticket system + instant acknowledgement |
| Price updates | Requires developer | Google Sheets, no code |
| Cost per interaction | ~$8 (agent salary/hour) | ~$0.02 (API cost) |

---

## Presentation Structure

| Slide | Title | Key Message |
|---|---|---|
| 1 | The Problem | Tourism companies bleed leads after hours and across language barriers |
| 2 | The Opportunity | 24/7 AI consultants — instant response at 1% the cost of human agents |
| 3 | Our Solution | Vista: multilingual AI travel consultant, live on Telegram and web |
| 4 | The Data | Synthetic knowledge base built on real tourism industry patterns + live pricing in Google Sheets |
| 5 | The Architecture | Three-agent RAG system: knowledge, pricing, and booking separated by design |
| 6 | The Intelligence | Multilingual embeddings, Gemini LLM, Whisper voice support, persistent memory |
| 7 | Live Demo | Real conversation: Arabic voice message → transcription → pricing → booking lead captured |
| 8 | Evaluation | LLM-as-Judge scores, human evaluation, 81% memory compression, 93% pass rate |
| 9 | Deployment | Self-hosted, production-ready, all data stays on company infrastructure |
| 10 | Business Impact | Instant response, 3 languages, voice + text, 100% after-hours coverage |
