# HorizonVista AI Travel Consultant - n8n Flowchart

This diagram focuses on the actual n8n processes used in the project: knowledge ingestion, Telegram inbox handling, Agent API orchestration, live pricing, booking/ticketing, memory, and response evaluation.

```mermaid
flowchart LR
  %% HorizonVista n8n system map

  subgraph A["Workflow 1: Knowledge Ingestion"]
    A1["Manual Trigger"]
    A2["Define collections<br/>packages, FAQs, policies,<br/>destinations, services"]
    A3["Split collections<br/>and process each batch"]
    A4["Read raw JSON<br/>from MongoDB"]
    A5["Code node<br/>flatten JSON into readable text<br/>extract metadata payload"]
    A6["HuggingFace embeddings<br/>intfloat/multilingual-e5-large"]
    A7["Qdrant vector store<br/>tourism_vdb<br/>cosine similarity"]

    A1 --> A2 --> A3 --> A4 --> A5 --> A7
    A6 -. embeddings .-> A7
    A7 --> A3
  end

  subgraph B["Workflow 2: Telegram Inbox"]
    B1["Telegram Trigger<br/>new message"]
    B2{"Message type?"}
    B3["Text message"]
    B4["Voice note"]
    B5["Download Telegram audio"]
    B6["Code node<br/>normalize audio file"]
    B7["Groq Whisper STT<br/>whisper-large-v3-turbo"]
    B8["Define input variable<br/>text or transcription"]
    B9["Typing status"]
    B10["Call Agent API webhook"]
    B11["Format response<br/>Telegram MarkdownV2-safe"]
    B12["Send Telegram reply"]

    B1 --> B2
    B2 --> B3 --> B8
    B2 --> B4 --> B5 --> B6 --> B7 --> B8
    B8 --> B9
    B8 --> B10 --> B11 --> B12
  end

  subgraph C["Workflow 3: Agent API"]
    C1["Webhook<br/>POST /horizonvista/api/send-message"]
    C2["Vista Orchestrator<br/>Gemini primary<br/>Groq fallback"]
    C3["search_knowledge<br/>Qdrant RAG topK=3"]
    C4["search_web<br/>Tavily"]
    C5["get_weather<br/>OpenWeatherMap"]
    C6["price_agent<br/>specialist agent"]
    C7["booking_agent<br/>specialist agent"]
    C8["MongoDB memory<br/>conversation window"]
    C9["Respond to Webhook"]

    C1 --> C2 --> C9
    C3 -. tool .-> C2
    C4 -. tool .-> C2
    C5 -. tool .-> C2
    C6 -. agent tool .-> C2
    C7 -. agent tool .-> C2
    C8 -. memory .-> C2
  end

  subgraph D["Price Agent Tools"]
    D1["Google Sheets<br/>package prices"]
    D2["Google Sheets<br/>airport transfer fees"]
    D3["Google Sheets<br/>hotel service fees"]
    D4["Frankfurter API<br/>live currency rates"]
    D5["Calculator<br/>discounts, child pricing,<br/>single supplement"]

    D1 -.-> C6
    D2 -.-> C6
    D3 -.-> C6
    D4 -.-> C6
    D5 -.-> C6
  end

  subgraph E["Booking and Support Tools"]
    E1["MongoDB lead creation<br/>HV-B reference"]
    E2["MongoDB ticket creation<br/>HV-T reference"]
    E3["Email notifications<br/>customer + internal team"]

    E1 -.-> C7
    E2 -.-> C7
    E3 -.-> C7
  end

  subgraph F["Quality and Operations"]
    F1["LLM-as-Judge<br/>relevance, correctness,<br/>tone, completeness"]
    F2["Parse JSON scores"]
    F3["Google Sheets<br/>Evaluation log"]
    F4{"More than 5<br/>interactions?"}
    F5["Memory Summarizer"]
    F6["Update MongoDB memory"]

    C2 --> F1 --> F2 --> F3
    C9 --> F4
    F4 -->|yes| F5 --> F6
    F4 -->|no| F6
  end

  B10 --> C1
  C9 --> B11
  A7 --> C3
```

## Process Summary

| Process | n8n workflow | Business purpose |
|---|---|---|
| Knowledge ingestion | `Embedding feeding.json` | Turns tourism content from MongoDB into searchable multilingual vectors in Qdrant. |
| Customer channel handling | `Telegram inbox message processing.json` | Accepts Telegram text and voice, transcribes voice notes, calls the agent API, and sends clean replies. |
| Agent orchestration | `AGENT API setup.json` | Runs Vista, the main AI consultant, and coordinates RAG, web search, weather, pricing, booking, memory, and evaluation. |
| Pricing | Agent API sub-agent | Keeps prices live in Google Sheets so staff can update them without redeploying or re-embedding data. |
| Booking and complaints | Agent API sub-agent | Captures booking leads and support tickets in MongoDB, sends email confirmations, and returns reference numbers. |
| Memory | Agent API | Preserves user context with MongoDB chat memory and summarizes after longer conversations. |
| Evaluation | Agent API branch | Scores every response with an LLM-as-Judge rubric and logs results to Google Sheets for monitoring. |

## Key Design Logic

- Static knowledge is embedded into Qdrant; volatile pricing is kept outside the vector database.
- The Orchestrator is the only customer-facing agent; specialist agents handle pricing and transactions behind the scenes.
- Telegram voice notes become normal text through Whisper STT before entering the same Agent API path.
- Every conversation can be evaluated automatically, giving the project a measurable quality loop.
- MongoDB is used across the system for knowledge, memory, leads, and support tickets.
