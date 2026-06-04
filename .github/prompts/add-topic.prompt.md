---
description: "Add a new interview topic with manifest entry, content folder, and optional placeholder scaffolding."
mode: edit
---

Add one topic end-to-end using this checklist:
1. Determine target category and final slug.
2. Insert topic metadata in app/src/lib/data/topics.ts.
3. Create folder app/static/content/<category>/<topic-slug>/.
4. If source content exists, add asset mappings.
5. If missing, scaffold placeholder.md from topic-sync template.
6. Verify topic is navigable in the Svelte app and not broken.
