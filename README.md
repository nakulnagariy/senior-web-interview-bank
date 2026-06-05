# Web Dev Interview Playbook

A practical, senior-focused interview preparation repository for modern web development.

This repo includes curated interview questions, edge cases, implementation exercises, and architecture discussions across the full web stack:

- JavaScript and TypeScript
- Promises, async patterns, and event loop behavior
- Node.js and backend fundamentals
- React patterns and pitfalls
- Angular concepts and architecture
- HTML and CSS fundamentals to advanced topics
- System design and real-world trade-offs for frontend and full-stack roles

## Repository Description

Use this as your GitHub repository description:

Senior-focused web development interview prep with practical questions, edge cases, and implementation exercises across JavaScript, TypeScript, React, Angular, Node.js, HTML, and CSS.

## Current Structure

- promises
  - categories
    - fundamentals
    - combinators
    - patterns
    - runtime semantics
    - react + promises

## Interview Navigator App (Svelte Static)

A static SvelteKit app now lives in `app/` and provides a connected navigator for all roadmap topics.

### Run locally

1. `npm --prefix app install`
2. `npm --prefix app run dev`

### Build static site

1. `npm --prefix app run build`
2. Static output is generated in `app/build/`

### Content maintenance scripts

- `npm --prefix app run content:generate`
  - Generates topic-specific md/html/js/csv files for missing asset types under `app/static/content/<category>/<topic-slug>/` using `*-generated.*` filenames.
- `npm --prefix app run placeholders:sync`
  - Backward-compatible alias for `content:generate`.
- `npm --prefix app run validate:manifest`
  - Validates topic slug uniqueness and that all mapped asset paths exist.
- `npm --prefix app run report:coverage`
  - Prints category-wise and overall coverage from manifest data (asset-backed vs placeholder-only topics).
- `npm --prefix app run check:all`
  - Runs placeholder sync + manifest validation + Svelte type checks.

### App contracts

- Topic metadata source: `app/src/lib/data/topics.ts`
- Content source tree: `app/static/content/<category>/<topic-slug>/`
- Category folder names should match manifest category IDs exactly (for example: `js-core`, `async-js`, `react-hooks`).
- Any missing-topic content is rendered as a placeholder route so the graph stays fully connected.

### Supported content renderers

- Markdown (`.md`)
- HTML assessments (`.html`)
- JavaScript code (`.js`)
- CSV flashcards (`.csv`)

### Copilot workspace customization

Repository-level Copilot customizations now exist in `.github/`:

- `copilot-instructions.md`
- `instructions/*.instructions.md`
- `agents/*.agent.md`
- `skills/**/SKILL.md`
- `prompts/*.prompt.md`

## Role-Specific Preparation Packs

- react-angular
  - SCOR_RUP_REACT_EXPERT_INTERVIEW_PREP.md
  - SCOR_RUP_REACT_EXPERT_MOCK_INTERVIEW.md
  - SCOR_RUP_CV_ALIGNMENT_CHECKLIST.md
  - SCOR_RUP_90_SECOND_INTRO.md
  - POPULAR_DESIGN_PATTERNS_WITH_EXAMPLES.md

## Planned Structure

- javascript
- typescript
- react
- angular
- nodejs
- html-css
- system-design
- behavioral-and-senior-rounds

Each section will include:

- Interview-style questions
- Senior expectations
- Correct implementations
- Trade-offs and production nuances

## How To Use This Repo

1. Pick one category at a time.
2. Attempt the question yourself first.
3. Compare your answer with the implementation and trade-offs.
4. Practice explaining your reasoning out loud as if in an interview.
5. Revisit weak areas and add your own variants.

## Who This Is For

- Frontend engineers preparing for product or platform companies
- Full-stack engineers targeting senior-level web roles
- Developers who want practical, interview-ready depth over rote memorization

## Contribution Style

When adding a new question, keep this format:

- Question
- Senior expectation
- Correct implementation
- Trade-offs and caveats

## License

MIT (add a LICENSE file if you want to make this explicit)
