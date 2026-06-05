---
description: "Use when syncing interview_topic_roadmap.html topics with app topic manifest."
applyTo: "interview_topic_roadmap.html"
---

- Roadmap topic names are source-of-truth labels; avoid accidental renaming.
- Any added roadmap topic must be mapped to a route slug and category in app/src/lib/data/topics.ts.
- Keep priority and type tags aligned between roadmap and app metadata.
- If roadmap taxonomy changes, update navigation filters and category labels accordingly.
