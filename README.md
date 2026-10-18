# PolicyLens

A grounded, natural-language search and deterministic change-tracking system operating over versioned institutional policy documents. Built for the Homingo Hackathon 2026 (LLM Apps Track) by Team Catalysts.

---

## Overview

PolicyLens provides accurate semantic search and temporal change-tracking across synthetic, multi-version institutional policy documents. The system indexes versioned policies (spanning January 2025 to October 2026, in both English and Hindi) and answers user inquiries with source citations, verifiable text diffs, and explicit refusal when information is absent from the corpus.

### Key Capabilities

- **Factual Semantic Lookup**: Retrieves relevant policy chunks and produces answers grounded directly in document source text with citations.
- **Deterministic Change Tracking**: Identifies document revisions across specific dates or timeframes (e.g., "What rules changed in the hostel policy since March?") and summarizes exact text modifications.
- **Hallucination Prevention & Honest Fallback**: Explicitly returns a "not found in documents" response when queries cannot be answered by the indexed corpus.
- **Multilingual Query Support**: Processes and answers policy queries in English and Hindi.
- **Operational Observability**: Captures end-to-end latency ($p50$/$p95$), input and output token consumption, and cost estimates for every query.

---

## Architectural Philosophy: Deterministic Change Detection

Large language models frequently hallucinate or miss subtle alterations when tasked with computing text diffs across lengthy, complex documents. PolicyLens enforces a strict separation between deterministic logic and language generation:

```
User Query
    │
    ▼
[1] LLM Intent Classification & Parameter Extraction (JSON)
    └── Extracts: { intent, since, topic, language }
    │
    ▼
[2] Deterministic Date Resolution (JavaScript Engine)
    └── Converts relative temporal expressions ("since March", "last 6 months")
        into ISO calendar cutoffs using server reference time
    │
    ▼
[3] Version Query & Exact Text Diff (MongoDB & Pure Code)
    └── Queries versions effective after resolved cutoff
    └── Computes structural text diff against immediately preceding versions
    │
    ▼
[4] Grounded Summarization & Citation (LLM Generation)
    └── LLM receives ONLY the computed diff and metadata
    └── Produces concise, citation-backed summary of actual changes
```

By constraining the model to summarize programmatically computed differences, PolicyLens guarantees that no phantom revisions are invented.

---

## Technology Stack & Open-Source Libraries

All external libraries, public APIs, and models used in this repository are listed below in compliance with hackathon transparency guidelines:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Runtime | Node.js (v20+) | Execution environment using native ES Modules (`"type": "module"`) |
| Web Framework | Express.js | HTTP routing and middleware orchestration |
| Schema Validation | Zod | Runtime schema validation for API requests and LLM JSON outputs |
| Database & ODM | MongoDB with Mongoose | Persistence for versioned policies, chunks, embeddings, and telemetry |
| Embeddings & Vector Search | Dense Embeddings in MongoDB | Cosine similarity computed in JavaScript (no external vector database) |
| AI Model SDK | `@google/genai` | Official Google Gen AI SDK for Node.js |
| LLM Foundation Model | Google Gemini (via `GEMINI_MODEL`) | Intent parsing and diff-grounded summarization |
| Security & Utilities | `dotenv`, `cors`, `express-rate-limit` | Environment separation, CORS policy, and endpoint rate limiting |
| Client (Upcoming) | React with Vite | Single-page search and change comparison interface |

No heavy agentic frameworks (such as LangChain or LlamaIndex) are used. Orchestration, chunking, retrieval, and diff computation are implemented in clean, understandable native code.

---

## System Architecture & Directory Structure

Execution follows a unidirectional control flow: `Routes -> Controllers -> Services -> Models / External APIs`.

```text
Policy-Lens/
├── .agent/
│   └── rules/
│       └── project-rules.md       # AI assistant instructions and boundaries
├── .github/
│   └── copilot-instructions.md    # Copilot guidelines and constraints
├── docs/
│   └── PROJECT_CONTEXT.md         # Comprehensive project documentation
├── server/
│   ├── data/                      # Synthetic versioned policy corpus
│   ├── evals/                     # Benchmark dataset and evaluation scripts
│   ├── src/
│   │   ├── config/                # Database and GenAI SDK initialization
│   │   ├── controllers/           # HTTP request parsing and response mapping
│   │   ├── middleware/            # Rate limiting and central error handler
│   │   ├── models/                # Mongoose schemas (Document, Chunk, QueryLog)
│   │   ├── routes/                # Express router declarations
│   │   ├── services/              # Core business, retrieval, and LLM services
│   │   ├── utils/                 # Cosine similarity, date resolution, diff utilities
│   │   ├── app.js                 # Express application setup
│   │   ├── server.js              # Server entry point and database connection
│   │   └── hello.js               # Gemini API connectivity and smoke-test script
│   ├── package.json               # Server dependencies and scripts
│   └── package-lock.json
├── .env.example                   # Template for required environment variables
├── .gitignore                     # Git exclusion rules (node_modules, .env, dist)
└── README.md                      # Repository documentation
```

---

## Data Model

The data layer uses three primary schemas managed via Mongoose:

### 1. Document (`documents`)
Represents an immutable version snapshot of an institutional policy.
- `policyId` (String): Unique identifier grouping all historical versions of a policy.
- `title` (String): Formal policy title.
- `version` (String / Number): Semantic or sequential version identifier (e.g., `v1.0`, `v2.0`).
- `effectiveDate` (Date): Formal effective date of the snapshot.
- `language` (String): ISO language code (`en`, `hi`).
- `text` (String): Complete document text body.

### 2. Chunk (`chunks`)
Represents discrete segments of policy text optimized for dense semantic retrieval.
- `docId` (ObjectId): Reference to parent `Document`.
- `policyId` (String): Copied for query filtering without joins.
- `version` (String / Number): Version tag inherited from parent document.
- `effectiveDate` (Date): Date tag for temporal filtering.
- `text` (String): Segment content.
- `embedding` (Array of Numbers): High-dimensional vector representation.

### 3. QueryLog (`query_logs`)
Captures usage telemetry, performance metrics, and evaluation signals.
- `question` (String): Raw user query string.
- `intent` (String): Extracted intent (`lookup`, `change_tracking`, `out_of_scope`).
- `latencyMs` (Number): Round-trip processing time in milliseconds.
- `tokens` (Object): Breakdown of `promptTokens`, `candidateTokens`, and `totalTokens`.
- `found` (Boolean): Flag indicating whether grounded context was retrieved.

---

## API Specification (Draft)

All endpoints accept JSON payloads, validate inputs using Zod schemas, and route errors through a centralized error handler with standardized structure: `{ "error": { "code": string, "message": string } }`.

### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ask` | Direct QA endpoint returning grounded answer, token usage, and latency. |
| `POST` | `/api/search` | Semantic search endpoint returning relevant chunks, citations, and confidence. |
| `POST` | `/api/changes` | Temporal diff endpoint accepting `{ since, topic? }` and returning verified revisions. |
| `POST` | `/api/ask-policies` | Unified entry point routing automatically to lookup or change-tracking pipeline. |
| `POST` | `/api/documents` | Administrative ingestion endpoint chunking, embedding, and storing new policies. |
| `GET` | `/api/health` | Service health check returning system and database operational status. |

---

## Evaluation & Benchmarking Strategy

A dedicated evaluation suite tests system reliability against ~30 ground-truth scenarios:

- **10 Direct Lookups**: Fact retrieval across various policy domains.
- **8 Temporal Change Queries**: Accurate detection of revisions effective after specified dates.
- **3 Multi-Policy Queries**: Cross-document reasoning and synthesis.
- **5 Out-of-Scope Queries**: Negative test cases ensuring the system admits when an answer is not present without hallucinating.
- **4 Hindi Queries**: Multilingual semantic retrieval and answer generation in Hindi.

### Metrics Logged
1. **Retrieval Precision**: Accuracy of retrieved chunks against target ground-truth policy sections.
2. **Generation Faithfulness**: Adherence of generated text to retrieved context without external hallucinations.
3. **Operational Telemetry**: Query latency percentiles ($p50$ and $p95$), prompt and candidate token counts, and operational cost calculations.

---

## Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- MongoDB instance (local or MongoDB Atlas connection string)
- Google Gemini API key

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Manas-Gupta16/Policy-Lens.git
   cd Policy-Lens
   ```

2. **Configure environment variables**:
   Copy the example environment template into the `server/` directory:
   ```powershell
   Copy-Item .env.example server\.env
   ```
   Open `server/.env` and supply your actual configuration values:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/policylens
   ```

3. **Install server dependencies**:
   ```powershell
   npm --prefix server install
   ```

4. **Verify Gemini API connectivity (Smoke Test)**:
   Run the CLI smoke test to confirm your API key and model selection:
   ```powershell
   node server/src/hello.js "Explain tokens in one sentence."
   ```

5. **Start the development server**:
   ```powershell
   npm --prefix server run dev
   ```

---

## Project Status & Hackathon Details

- **Event**: Homingo Hackathon, Edition 01 (Online, India)
- **Track**: LLM Apps Track
- **Team**: Catalysts
- **Official Hackathon Portal**: [https://hackathon.homingo.co.in/hackathons/edition-01](https://hackathon.homingo.co.in/hackathons/edition-01)
- **Status**: This repository serves as a practice implementation for mastering retrieval-augmented generation, deterministic diffing, and evaluation workflows prior to the official release of problem statements.

---

## License

This project is licensed under the ISC License.
