# Copilot Instructions for Bench Interview Preparation

## Project Intent
- Keep the interview roadmap fully connected through the Svelte static navigator.
- Treat app topic metadata in app/src/lib/data/topics.ts as a contract: all roadmap topics must remain routable.
- Prefer adding placeholders over leaving unmapped topics.

## Required Workflow for Topic Changes
1. Update topic metadata first in app/src/lib/data/topics.ts.
2. Add or move source assets under app/static/content/<category>/<topic-slug>/.
3. Keep topic slugs stable after publishing unless migration is intentional.
4. Run validation/build commands before finalizing changes.

## Content Standards
- Markdown notes should focus on senior interview expectations, pitfalls, and trade-offs.
- Code assets should be runnable or readable without hidden dependencies.
- Assessment HTML should stay self-contained.
- Placeholder topics must include clear TODO guidance.

## Navigator UI Standards
- Keep mobile and desktop behavior usable.
- Do not remove hash-based deep-linking behavior.
- Preserve progress tracking persistence in localStorage.

## Verification Before Completion
- Run npm --prefix app run check.
- Run npm --prefix app run build.
- Confirm every topic still renders either real content or a placeholder.
