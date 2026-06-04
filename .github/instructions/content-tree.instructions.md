---
description: "Use when adding or reorganizing interview topic content under app/static/content/**."
applyTo: "app/static/content/**"
---

- Place files under app/static/content/<category>/<topic-slug>/.
- Keep filenames descriptive and lowercase with hyphens where possible.
- For new topics, include at least one note asset and one optional code or assessment asset.
- Do not silently overwrite existing assets with different semantics.
- If a file move changes paths, update topic asset mappings in app/src/lib/data/topics.ts in the same change.
