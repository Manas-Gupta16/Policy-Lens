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
