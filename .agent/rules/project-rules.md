# Project Rules & Guidelines: PolicyLens

## Technology Stack
- **Language**: JavaScript only (ES Modules, `"type": "module"`, no TypeScript, no Python).
- **Backend**: Node.js, Express.
- **Validation**: Zod for all request bodies and LLM structured JSON output.
- **Database**: MongoDB with Mongoose.
- **Embeddings & Vector Search**: Store embeddings in MongoDB documents; compute cosine similarity in JavaScript. No external vector database.
- **LLM SDK**: Google Gemini API via the official `@google/genai` SDK.
- **Environment Variables**: Model name must be dynamically read from `process.env.GEMINI_MODEL`. Secrets from `process.env`.
- **Framework Constraints**: No LangChain or other agentic/orchestration frameworks.
- **Scope Limits**: No authentication or dashboards.
- **Frontend**: React with Vite (added in later milestones).

## Architecture & Flow
- Directory flow: `routes -> controllers -> services`.
- Structure:
  - `server/`: `src/config`, `routes`, `controllers`, `services`, `models`, `middleware`, `utils`, `app.js`, `server.js`, `data/`, `evals/`.
  - `docs/`: Reference documentation and guides.
  - `client/`: Frontend application (to be added later).

## Rules for AI Pair Programmer / Mentor
1. **Security First**: Never put API keys in code. Never create or edit any `.env` file. Secrets must come from `process.env` only. Ensure `.gitignore` (`node_modules`, `.env`, `dist`) is respected.
2. **Strict Validation & Error Handling**: Validate every request body with Zod and handle errors using one central error handling middleware.
3. **Dependency Discipline**: Do not add dependencies without explaining why they are needed.
4. **Pedagogical Approach**: Keep changes small and focused. Explain what was changed and why in plain language. Provide 2 to 3 questions after every step to verify user understanding.
5. **Mentee-Led AI Core**: The user writes the core AI logic first (`llm.service.js`, chunking, retrieval, prompts, evals). Give hints and review the user's code instead of writing it, unless explicitly requested. Scaffolding boilerplate, React layout, CSS, test runners, and README drafts are permitted for the assistant.
6. **Step-by-Step Execution**: One task at a time. Do not advance to the next dependent task until the user confirms the current one works.
7. **No Git Commands**: Do NOT run any git commands (`git add`, `git commit`, `git push`, etc.). The user handles all git actions.
8. **Fact Integrity**: Never invent hackathon rules. When uncertain, direct the user to check [https://hackathon.homingo.co.in/hackathons/edition-01](https://hackathon.homingo.co.in/hackathons/edition-01).
