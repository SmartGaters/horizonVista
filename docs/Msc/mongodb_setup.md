# MongoDB Setup — HorizonVista Tourism AI

Database: `tourism_db`

---

## Collections Overview

| Collection | Purpose | Writer |
|---|---|---|
| `packages` | Source of truth for package catalog | Manual / ingestion |
| `faqs` | FAQ content | Manual / ingestion |
| `policies` | Policy documents | Manual / ingestion |
| `destinations` | Destination guides | Manual / ingestion |
| `company` | Company profile & contact info | Manual / ingestion |
| `services` | Airport transfer & hotel reservation services | Manual / ingestion |
| `leads` | Booking requests from customers | Booking Agent |
| `tickets` | Support complaints and escalations | Booking Agent |
| `chat_sessions` | Conversation memory per user | n8n MongoDB Memory node |

---

## Collection: `leads`

### Example document
```json
{
  "_id": "ObjectId (auto)",
  "ref_id": "HV-B-4231",
  "type": "booking_lead",
  "status": "new",
  "channel": "website",
  "customer": {
    "name": "Hamza Sallam",
    "email": "hamza@gmail.com",
    "phone": "+90 555 000 0000"
  },
  "booking": {
    "package_or_service": "Magical Maldives Escape",
    "gsheet_ref": "PKG-001",
    "travel_dates": "Nov 20–27 2025",
    "adults": 2,
    "children": [],
    "special_requests": "Anniversary setup please"
  },
  "quoted_price": {
    "amount": 5600,
    "currency": "USD"
  },
  "created_at": "ISODate (auto)",
  "updated_at": "ISODate (auto)",
  "notes": ""
}
```

### Status lifecycle
```
new → contacted → confirmed → cancelled
               ↘ cancelled
```

### Indexes
```js
db.leads.createIndex({ "ref_id": 1 }, { unique: true })
db.leads.createIndex({ "status": 1 })
db.leads.createIndex({ "customer.email": 1 })
db.leads.createIndex({ "created_at": -1 })
db.leads.createIndex({ "channel": 1 })
db.leads.createIndex({ "booking.gsheet_ref": 1 })
```

---

## Collection: `tickets`

### Example document
```json
{
  "_id": "ObjectId (auto)",
  "ref_id": "HV-T-0087",
  "type": "support_ticket",
  "status": "open",
  "severity": "medium",
  "channel": "instagram",
  "customer": {
    "name": "Unknown",
    "email": "sara@hotmail.com"
  },
  "issue": {
    "description": "Egypt trip guide barely spoke English, ruined the whole experience.",
    "related_package": "PKG-010",
    "related_lead_ref": null
  },
  "created_at": "ISODate (auto)",
  "updated_at": "ISODate (auto)",
  "resolved_at": null,
  "resolution_notes": ""
}
```

### Status lifecycle
```
open → in_progress → resolved → closed
     ↘ closed (direct, if spam or duplicate)
```

### Severity values
- `high` — refund request, safety issue, no-show by guide/driver, medical, legal
- `medium` — quality complaint, billing error, itinerary deviation
- `low` — general feedback, minor inconvenience, suggestion

### Indexes
```js
db.tickets.createIndex({ "ref_id": 1 }, { unique: true })
db.tickets.createIndex({ "status": 1 })
db.tickets.createIndex({ "severity": 1 })
db.tickets.createIndex({ "customer.email": 1 })
db.tickets.createIndex({ "created_at": -1 })
db.tickets.createIndex({ "channel": 1 })
db.tickets.createIndex({ "status": 1, "severity": 1 })
```

The compound index on `status + severity` lets the team quickly pull all open high-severity tickets.

---

## Collection: `chat_sessions`

Managed automatically by the **n8n MongoDB Chat Memory** node. You do not write to this collection manually.

### What n8n stores
```json
{
  "_id": "ObjectId (auto)",
  "sessionId": "telegram_123456789",
  "messages": [
    { "role": "human", "content": "How much is the Bali trip?", "createdAt": "ISODate" },
    { "role": "ai", "content": "The Bali Adventure for 2 comes to...", "createdAt": "ISODate" }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Session ID convention
The `sessionId` must be injected by the webhook trigger node in n8n. Use a format that is unique per user per platform:

| Channel | Session ID format | Example |
|---|---|---|
| Telegram | `telegram_{{chatId}}` | `telegram_123456789` |
| Instagram | `instagram_{{senderId}}` | `instagram_abc123def` |
| Website widget | `website_{{sessionToken}}` | `website_f9a3b2c1` |

In the n8n AI Agent node → Memory → Session ID field, use the expression:
```
{{ $json.channel + "_" + $json.userId }}
```

### Index (create manually for performance)
```js
db.chat_sessions.createIndex({ "sessionId": 1 }, { unique: true })
db.chat_sessions.createIndex({ "updatedAt": -1 })
```

### TTL index (optional — auto-delete sessions older than 30 days)
```js
db.chat_sessions.createIndex(
  { "updatedAt": 1 },
  { expireAfterSeconds: 2592000 }
)
```

---

## Quick setup script (run once in mongosh)

```js
use tourism_db

// leads
db.createCollection("leads")
db.leads.createIndex({ "ref_id": 1 }, { unique: true })
db.leads.createIndex({ "status": 1 })
db.leads.createIndex({ "customer.email": 1 })
db.leads.createIndex({ "created_at": -1 })
db.leads.createIndex({ "channel": 1 })
db.leads.createIndex({ "booking.gsheet_ref": 1 })

// tickets
db.createCollection("tickets")
db.tickets.createIndex({ "ref_id": 1 }, { unique: true })
db.tickets.createIndex({ "status": 1 })
db.tickets.createIndex({ "severity": 1 })
db.tickets.createIndex({ "customer.email": 1 })
db.tickets.createIndex({ "created_at": -1 })
db.tickets.createIndex({ "channel": 1 })
db.tickets.createIndex({ "status": 1, "severity": 1 })

// chat_sessions
db.createCollection("chat_sessions")
db.chat_sessions.createIndex({ "sessionId": 1 }, { unique: true })
db.chat_sessions.createIndex({ "updatedAt": -1 })
// optional TTL — delete sessions after 30 days of inactivity
db.chat_sessions.createIndex({ "updatedAt": 1 }, { expireAfterSeconds: 2592000 })

print("Collections and indexes created.")
```
