# HorizonVista KB — Chunking Guide for RAG

## Files Overview
| File | Description | Chunks |
|------|-------------|--------|
| `company_profile.json` | Company info, branches, contact | 1 doc |
| `packages.json` | 20 tour packages | 1 chunk per package (20 total) |
| `policies.json` | 7 policy sections | 1 chunk per section (7 total) |
| `faqs.json` | 42 FAQ entries | Group by category (~8 chunks) |
| `destinations.json` | 13 destination guides | 1 chunk per destination |
| `contact_support.json` | All contact channels | 1 doc |

## Recommended Chunking Strategy

### Packages
Each package should be one chunk. Suggested text format before embedding:
```
Package: {name} ({id})
Destination: {destination} | Duration: {duration_days} days
Type: {type} | Price: ${pricing.per_person_double} USD/person (double)
Highlights: {highlights joined}
Itinerary: {itinerary joined}
Includes: {includes}
Excludes: {excludes}
Availability: {availability}
Child Policy: {child_policy}
Group Discount: {group_discount}
```

### FAQs
Group by category into single chunks:
- Booking (5 FAQs) → 1 chunk
- Payment (5 FAQs) → 1 chunk
- Cancellation & Refunds (4 FAQs) → 1 chunk
- Travel Documents (3 FAQs) → 1 chunk
- Flights (3 FAQs) → 1 chunk
- Hotels (3 FAQs) → 1 chunk
- Children & Families (3 FAQs) → 1 chunk
- Health & Safety / Food / Languages (7 FAQs) → 1 chunk
- Destinations / Sustainability / Corporate (4 FAQs) → 1 chunk
- Support / Loyalty / Umrah (5 FAQs) → 1 chunk

### Policies
Each top-level key in policies.json = 1 chunk.

### Metadata to attach to each chunk (for filtering)
```json
{
  "source": "packages | faqs | policies | destinations | company",
  "package_id": "PKG-001",  // if applicable
  "destination": "Maldives",
  "region": "Asia",
  "type": "Honeymoon / Romantic",
  "tags": ["romantic", "beach", "luxury"],
  "faq_category": "Booking"  // if FAQ chunk
}
```

## CRISP-DM Data Preparation Notes
- **Total chunks estimate**: ~60–70 after splitting
- **Embedding model recommendation**: text-embedding-3-small (OpenAI) or text-embedding-004 (Google)
- **Vector DB**: Pinecone (as already planned) with metadata filters for region, type, tags
- **Chunk overlap**: Not needed since each chunk is a self-contained document
