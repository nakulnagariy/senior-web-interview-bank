---
name: topic-sync
description: "Use when adding one or many interview topics and wiring them end-to-end across manifest, content folders, and placeholders."
---

# Topic Sync Skill

## Scope
Use this workflow when topic coverage needs to be expanded while preserving route stability.

## Steps
1. Add or update topic entry in app/src/lib/data/topics.ts.
2. Create or move content into app/static/content/<category>/<topic-slug>/.
3. If content is missing, generate placeholder markdown from templates/placeholder.md.
4. Validate that asset paths resolve and the topic route opens in the app.
5. Run app checks and build.

## Quality Gate
- No unmapped topic labels.
- No broken asset path.
- Placeholder exists for every missing-content topic.
