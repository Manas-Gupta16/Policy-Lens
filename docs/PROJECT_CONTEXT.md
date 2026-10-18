# PolicyLens — Project Context & Hackathon Master Guide

## 1. Project Overview & Hackathon Metadata

* **Project Name**: PolicyLens
* **Repository & Root Directory**: `Policy-Lens`
* **Team**: Catalysts (Captain & sole member)
* **Developer Profile**: Student, beginner-to-intermediate developer on Windows (PowerShell), familiar with Node.js, Express, REST APIs, basic MongoDB/Mongoose, basic React, JavaScript, and C++. New to AI engineering.
* **Working Model**: Mentor-mentee pair programming. Every line of code must be understood and explainable to hackathon judges.

### Hackathon Facts (Homingo Hackathon, Edition 01, Online, India)
* **Track**: LLM apps
* **Kick-off**: 21 Nov 2026, 10:00 AM IST (official problem statements released)
* **Build Phase**: 21 Nov to 6 Dec 2026
* **Submission Window**: 4 Dec to 6 Dec 2026, closes at 11:59 PM IST
* **Finals & Demo Day**: 19 Dec 2026
* **Practice Nature**: This repository (`Policy-Lens`) is a practice and preparation project. It will **not** be submitted directly; a fresh repository will be initialized on 21 Nov for the real build phase.
* **Official Hackathon URL**: [https://hackathon.homingo.co.in/hackathons/edition-01](https://hackathon.homingo.co.in/hackathons/edition-01)

### Hackathon Rules & Submission Requirements
* **Allowed**: Open-source libraries, public APIs, and pre-trained models (all must be documented in README). AI coding assistants are allowed, provided the developer fully understands the code.
* **Data**: Only synthetic or open data is permitted. Real personal data is strictly forbidden.
* **Plagiarism**: Plagiarism will result in immediate disqualification.
* **Submission Deliverables**: Public GitHub repository with README and setup instructions, along with a short demo video. (Live link and pitch deck optional).
* **Judging Criteria**:
  1. **Problem Fit & Impact**: Practical value and usability.
  2. **Technical Depth**: Orchestration, tool use, data management, and clean architecture.
  3. **Reliability & Evaluation**: Grounded/accurate responses, automated evals, guardrails, and graceful failure handling.
  4. **Product & Experience**: User experience, latency awareness, and cost consciousness.
  5. **Demo & Communication**: Clear explanation of architectural choices and trade-offs.

---

## 2. Practice Domain: PolicyLens

PolicyLens is an intelligent, natural-language search and policy tracking application operating over a corpus of synthetic, versioned policy documents for a fictional college.

### Corpus Characteristics
* ~30 distinct college policies (hostel, academics, fee refunds, leaves, code of conduct, grading, etc.).
* 2 to 3 versioned snapshots per policy, with effective dates spanning January 2025 to October 2026.
* Multilingual support: English and Hindi policy documents and query support.

### Core Capabilities
1. **Lookup Questions**: Fact retrieval with citation snippets (e.g., *"What is the fee refund rule for hostel students?"*).
2. **Change-Tracking Questions**: Identifying and explaining revisions across effective dates (e.g., *"Which policies changed since March?"*).
3. **Honest Grounding & Refusals**: Explicit *"not found in the documents"* fallback when questions cannot be answered by the corpus.

### Deterministic & Guarded Design (4-Step Pipeline)
Rather than asking an LLM to guess or compute document differences on its own, PolicyLens follows a deterministic pipeline:
1. **Structured Intent Extraction**: An LLM extracts structured query metadata as JSON: `{ intent, since, topic, language }`.
2. **Relative Date Resolution**: Application code resolves relative dates (e.g., "since March", "in the last 6 months") deterministically against the current date.
3. **Deterministic Version Retrieval & Text Diff**: Application code queries MongoDB for versions effective after the resolved date and runs a text diff against the prior version.
4. **Grounded Summarization**: The LLM is provided only the computed text diff and metadata, summarizing the changes with explicit citations.

---

## 3. Technology Stack

* **Language**: JavaScript only (ES Modules, `"type": "module"`, no TypeScript, no Python).
* **Runtime & Framework**: Node.js, Express.
* **Input Validation**: Zod for all request schemas and structured JSON extraction validation.
* **Database & Persistence**: MongoDB with Mongoose.
* **Vector Embeddings & Retrieval**: Stored directly in MongoDB documents; cosine similarity computed in pure JavaScript (no external vector database).
* **LLM SDK**: Official `@google/genai` SDK using `process.env.GEMINI_MODEL` and `process.env.GEMINI_API_KEY`.
* **Framework Restrictions**: No LangChain or other heavy orchestration frameworks; everything is cleanly built and understood in native code.
* **Frontend**: React with Vite (to be introduced in client milestone).
* **Security & Auth**: No authentication or dashboards required for this practice phase.

---

## 4. Architecture & Directory Flow

Code execution flows strictly unidirectionally:
```
Request -> Routes -> Controllers -> Services -> Models / External APIs
```

### Directory Tree
```text
Policy-Lens/
├── .agent/rules/           # Agent operating instructions
├── .github/                # GitHub Copilot & CI instructions
├── docs/                   # Specifications, architecture, guides
├── server/
│   ├── data/               # Synthetic policy corpus JSONs
│   ├── evals/              # Evaluation benchmarks and accuracy tests
│   ├── src/
│   │   ├── config/         # Environment, DB connection, Gemini client setup
│   │   ├── controllers/    # Express controllers (HTTP mapping & validation)
│   │   ├── middleware/     # Rate limiter, central error handler
│   │   ├── models/         # Mongoose schemas (Policy, Version, Embedding)
│   │   ├── routes/         # Express router endpoints
│   │   ├── services/       # Core business & AI logic (LLM, retrieval, diff)
│   │   ├── utils/          # Cosine similarity, date helpers, diff formatters
│   │   ├── app.js          # Express app configuration & middleware pipeline
│   │   └── server.js       # HTTP server listener & DB initializer
│   ├── package.json
│   └── .env.example
└── client/                 # React + Vite frontend (future milestone)
```

---

## 5. Open Questions & Theme Tracking

> [!WARNING]
> **Theme Discrepancy**: The internal Homingo participant dashboard lists the theme as **"AI for real local commerce"**, whereas the public Edition 01 page states **"Open theme"**.
> - **Status**: Unresolved until official problem statements are released on 21 Nov 2026.
> - **Action**: Treat PolicyLens purely as a technical practice project to master RAG, diffing, embeddings, evaluation, and latency/cost optimization.
> - **Rule**: Always verify rules and announcements directly on the official hackathon site ([https://hackathon.homingo.co.in/hackathons/edition-01](https://hackathon.homingo.co.in/hackathons/edition-01)) rather than guessing or assuming.

---

## 6. Data Model

### Document Schema
* `policyId` (String): Unique identifier linking all versions of a policy.
* `title` (String): Title of the policy document.
* `version` (String / Number): Semantic version or version indicator (e.g., "v1", "v2").
* `effectiveDate` (Date): Effective date for the specific document revision.
* `language` (String): Language code (e.g., "en", "hi").
* `text` (String): Full document text body.

### Chunk Schema
* `docId` (ObjectId): Reference to the parent Document.
* `policyId` (String): Associated policy identifier for filtering.
* `version` (String / Number): Associated version number.
* `effectiveDate` (Date): Inherited effective date for temporal filtering.
* `text` (String): Content snippet / chunk.
* `embedding` (Array of Numbers): Dense vector embedding generated for the chunk.

### QueryLog Schema
* `question` (String): Raw user input.
* `intent` (String): Extracted structured intent (`lookup`, `change_tracking`, etc.).
* `latency` (Number): Total response latency in milliseconds.
* `tokens` (Object / Number): Prompt and candidate token breakdown.
* `found` (Boolean): Whether relevant grounded content was discovered or if the system fell back to "not found".

---

## 7. API Contract (Draft)

All request bodies must be validated with Zod. Standard central error responses follow `{ error: { code, message } }` with proper HTTP status codes.

* **`POST /api/ask`**
  * Body: `{ question }`
  * Response: `{ answer, usage, latencyMs }`
* **`POST /api/search`**
  * Body: `{ question }`
  * Response: `{ answer, sources: [], found, usage, latencyMs }`
* **`POST /api/changes`**
  * Body: `{ since, topic? }`
  * Response: `{ changes: [] }`
* **`POST /api/ask-policies`**
  * Body: `{ question }`
  * Response: Dynamic router delegating to lookup or change-tracking pipeline based on classified intent.
* **`POST /api/documents`**
  * Body: `{ title, text, version, effectiveDate, language }`
  * Response: `{ docId, chunkCount }`
* **`GET /api/health`**
  * Response: `{ status: "ok" }`

---

## 8. Evals & Benchmarking

Target benchmark: ~30 synthetic evaluation questions with verified ground-truth answers:
* ~10 Direct lookup queries
* ~8 "Changed since [date]" queries
* ~3 Multi-policy cross-referencing queries
* ~5 Unanswerable out-of-scope queries (must trigger honest "not found" fallback)
* ~4 Hindi language queries

### Scoring & Metrics
* **Separate Scoring**: Evaluate retrieval accuracy (Did we fetch the right chunks?) separately from answer quality/generation faithfulness (Did the LLM answer honestly from the context without hallucinating?).
* **Operational Telemetry**: Log latency percentiles ($p50$, $p95$), input/output token counts, and estimated cost per query.

---

## 9. 28-Day Preparation Plan (17 Oct – 13 Nov)

Estimated time commitment: ~2 hours/day. Target: fully working end-to-end practice app by **Day 21 (6 Nov)**.

* **Week 1 (Oct 17 – Oct 23)**: LLM API fundamentals, Express REST API scaffolding, Zod schema validation, structured JSON outputs, initial React client.
* **Week 2 (Oct 24 – Oct 30)**: Synthetic corpus generation, chunking strategies, embeddings in MongoDB, in-memory cosine similarity retrieval, grounded answering, and baseline evaluation framework.
* **Week 3 (Oct 31 – Nov 6)**: Deterministic change tracking & diffing pipeline, Hindi language query support, interactive results UI, refusal guardrails. *(End-to-end working milestone: 6 Nov)*.
* **Week 4 (Nov 7 – Nov 13)**: Deployment, mock hackathon presentation drills, evaluation results benchmarking table, demo video walkthrough.

---

## 10. Team Status

* **Team**: Catalysts
* **Roster**: Captain (1 member currently).
* **Deadline**: Official team formation closes on 18 Nov 2026.
