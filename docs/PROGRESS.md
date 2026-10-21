# PolicyLens — 28-Day Preparation Progress

- **Target**: Fully working end-to-end practice app by **Day 21 (6 Nov 2026)**
- **Build Phase Kickoff**: **21 Nov 2026** (in a fresh repository)
- **Tracking**: Mentor-guided, mentee-implemented core logic

---

## Week 1: LLM Fundamentals, Express REST API, Validation & Initial Client (17 Oct – 23 Oct)
- [x] **Day 1 (17 Oct)**: Project skeleton, directory layout, environment configuration, first Gemini API smoke test (`server/src/hello.js`).
- [x] **Day 2 (18 Oct)**: Express app and HTTP server setup (`app.js`, `server.js`), health check endpoint (`GET /api/health`), and `POST /api/ask` pipeline.
- [ ] **Day 3 (19 Oct)**: Centralized error handling middleware, CORS, rate limiting, and standard JSON response envelopes.
- [ ] **Day 4 (20 Oct)**: Request validation middleware using Zod, `POST /api/ask` routing scaffold.
- [ ] **Day 5 (21 Oct)**: First LLM service integration in Express (`llm.service.js`), token usage, and latency tracking.
- [ ] **Day 6 (22 Oct)**: Structured JSON extraction with Gemini and Zod schema validation (intent, date, topic).
- [ ] **Day 7 (23 Oct)**: Initial React + Vite client setup (`client/`), basic search input, and connection to `POST /api/ask`.

## Week 2: Synthetic Corpus, Embeddings, In-Memory Retrieval & Evals (24 Oct – 30 Oct)
- [ ] **Day 8 (24 Oct)**: MongoDB connection setup via Mongoose; `Document` and `Chunk` schema definitions.
- [ ] **Day 9 (25 Oct)**: Synthetic versioned college policy corpus generation (~30 policies across hostel, academics, fees, conduct).
- [ ] **Day 10 (26 Oct)**: Document chunking utility (sliding window with overlap) and ingestion pipeline (`POST /api/documents`).
- [ ] **Day 11 (27 Oct)**: Embedding generation using `@google/genai` SDK and array storage in MongoDB chunk documents.
- [ ] **Day 12 (28 Oct)**: Cosine similarity vector search in pure JavaScript without external vector databases.
- [ ] **Day 13 (29 Oct)**: Grounded lookup endpoint (`POST /api/search`), context injection, citations, and honest "not found" fallback.
- [ ] **Day 14 (30 Oct)**: Baseline evaluation benchmark scaffold (`server/evals/`) with initial ground-truth lookup queries.

## Week 3: Deterministic Change Tracking, Hindi Support & Guardrails (31 Oct – 6 Nov)
- [ ] **Day 15 (31 Oct)**: Multi-version policy modeling and deterministic relative date parser in JavaScript.
- [ ] **Day 16 (1 Nov)**: Pure code structural text diffing utility comparing version snapshots.
- [ ] **Day 17 (2 Nov)**: Temporal change-tracking endpoint (`POST /api/changes`): version filtering, diff computation, grounded summary.
- [ ] **Day 18 (3 Nov)**: Unified router (`POST /api/ask-policies`) delegating automatically to lookup vs change-tracking.
- [ ] **Day 19 (4 Nov)**: Multilingual policy ingestion and query handling for Hindi documents.
- [ ] **Day 20 (5 Nov)**: Hallucination prevention guardrails, refusal testing, and telemetry logging to `query_logs`.
- [ ] **Day 21 (6 Nov)**: **Milestone Day** — Interactive React UI with search, version diff comparisons, and citations.

## Week 4: Deployment, Benchmarking, Demo Video & Hackathon Drill (7 Nov – 13 Nov)
- [ ] **Day 22 (7 Nov)**: Full benchmark run: ~30 synthetic evaluation queries across lookups, changes, Hindi, and out-of-scope queries.
- [ ] **Day 23 (8 Nov)**: Telemetry analysis: latency percentiles (p50/p95), token costs, and retrieval precision scoring.
- [ ] **Day 24 (9 Nov)**: Optimization pass: prompt refinement, chunk size tuning, and cost reduction.
- [ ] **Day 25 (10 Nov)**: Production build validation, environment hardening, and deployment readiness check.
- [ ] **Day 26 (11 Nov)**: Mock presentation drills: articulating architecture, deterministic diffing rationale, and trade-offs.
- [ ] **Day 27 (12 Nov)**: Script and record demo video walkthrough showcasing lookup, change tracking, Hindi support, and refusals.
- [ ] **Day 28 (13 Nov)**: Final documentation polish, evaluation results table in README, clean practice wrap-up.
