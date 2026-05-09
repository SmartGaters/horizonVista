# n8n Tool Descriptions — HorizonVista AI Agents

Paste each description into the "Description" field of the corresponding tool node in n8n.
All tool reasoning and parameters must be in English regardless of the user's language.

---

## ORCHESTRATOR TOOLS

### search_knowledge (Qdrant Vector Store)
```
Search HorizonVista's internal knowledge base for information about tour packages, destinations, policies, FAQs, company info, and services. Use this first for any question related to what HorizonVista offers. Input: a natural language search query in English describing what you are looking for.
```

### search_web (Tavily)
```
Search the internet for current, real-world information that is not in the internal knowledge base. Use for: visa requirements, live travel advisories, hotel or restaurant recommendations outside HorizonVista's catalog, current events at destinations, safety information, or anything requiring up-to-date external data. Input: a concise English search query.
```

### get_weather (Weather API)
```
Retrieve current weather conditions or seasonal weather patterns for any destination in the world. Use when the user asks about weather, best travel season, or packing advice. Input: destination name and optionally a month or date range, in English.
```

### price_agent (AI Agent Tool)
```
Specialist pricing agent. Use for any question involving money: package cost, airport transfer quote, hotel service fee, group or child discounts, or currency conversion. Pass the gsheet_ref from the knowledge base result along with the number of adults, children ages, and the user's preferred currency. Always call this agent for prices — never estimate yourself. Communicate in English.
```

### booking_agent (AI Agent Tool)
```
Specialist booking and support agent. Use for two cases only: (1) when a customer has confirmed they want to book and you have collected their name, email, phone, travel dates, and passenger count — pass all details to create a lead; (2) when a customer has a complaint or issue and has provided their email — pass the full complaint description to create a support ticket and send notifications. Communicate in English.
```

---

## PRICE AGENT TOOLS

### get_packages_prices (Google Sheets — Packages tab)
```
Retrieve live pricing data for a specific tour package from the HorizonVista pricing sheet. Look up by ref_id (e.g. PKG-001). Returns: per_person_double price, single_supplement, base currency, child discount percentage, group discount threshold and percentage.
```

### get_transfer_fees (Google Sheets — Airport Transfers tab)
```
Retrieve airport transfer pricing from the HorizonVista pricing sheet. Look up by origin airport code (e.g. IST, SAW, AYT), destination area, and vehicle type. Returns: price per vehicle, currency, maximum passenger capacity, and any route notes.
```

### get_hotel_fees (Google Sheets — Hotel Service Fees tab)
```
Retrieve the HorizonVista service fee for standalone hotel reservations not bundled in a package. Look up by hotel star rating, fee tier, or booking context. Returns: fee type (flat or percentage), fee amount, and currency.
```

### get_currency_rate (Frankfurter API)
```
Fetch the live exchange rate between two currencies. Use whenever the user requests a price in a currency different from the package's base currency. Always fetch a live rate — never use a hardcoded value. Input: source currency code and target currency code (e.g. USD to TRY).
```

### calculator
```
Perform arithmetic calculations. Use for all price computations: multiplying base price by passenger count, applying percentage discounts, adding supplements, and summing totals. Do not do mental arithmetic — always use this tool to ensure accuracy.
```

---

## BOOKING AGENT TOOLS

### create_lead (MongoDB — leads collection)
```
Write a new booking lead document to the MongoDB leads collection in tourism_db. Use when a customer has confirmed interest in booking a package or service and all required fields are available: ref_id (HV-B-XXXX), customer name, email, phone, package details, travel dates, passenger count, quoted price, and channel. Set status to "new" and include a timestamp.
```

### create_ticket (MongoDB — tickets collection)
```
Write a new support ticket document to the MongoDB tickets collection in tourism_db. Use when a customer has reported a complaint, issue, or escalation. Required fields: ref_id (HV-T-XXXX), customer email, issue description, severity (low/medium/high), related package if known, channel, and timestamp. Set status to "open".
```

### send_email (Gmail / SMTP)
```
Send an email via Gmail or SMTP. Use to send two emails per task: one to the customer (confirmation of their booking inquiry or support ticket) and one to the HorizonVista internal team at info@horizonvista.com (notification with full details). Always send both emails before returning the result. Write email content in a professional tone; the customer-facing email should match the customer's language if known.
```
