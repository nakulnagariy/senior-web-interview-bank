# MCQ question papers

Each `.md` file in this folder (except this README) is one paper. Files are bundled into the app at build time, so they work offline. To add a paper, drop in a new file and rebuild; no code changes are needed.

```md
---
id: set-5
title: Set 5 — My Topic
description: One line shown on the card.
---

### Q1 | MongoDB | Indexes
Question text. **Markdown** and code fences are supported.

- A) First option
- B) Second option
- C) Third option
- D) Fourth option

**Answer:** C
**Explanation:** Why C is right (Markdown allowed).
```

## Rules

- `id` must be unique across files. Question ids are derived as `<id>-q<n>`.
- The header is `### Q<n> | <Category> | <Subtopic>`. The **category** drives the topic drills and score breakdown, so keep to the existing names: `MongoDB`, `Express`, `React` (put Next.js here, with subtopic `Next.js · ...`), `Node.js` (TypeScript, testing, DevOps also live here). The subtopic is optional and shown as a small tag.
- Options are `- A) ...` through `- F) ...`, at least 2. The app shuffles them, so answer letters in the file don't need to be balanced.
- `**Answer:**` must match one option letter.
- Each paper has 80 questions, 20 per category, and the timer allows 45 s per question (60 min for a full paper).

## Writing good distractors

Make wrong options **as long and as specific as the right one**. If the correct answer is the longest option, people can guess without knowing the topic. Move extra detail into the explanation instead.

## Validate

```sh
npm run validate:mcq
```

Fails on malformed questions or bad answer keys, and warns about wrong category counts, an over-used answer letter, or a correct answer that is the longest option too often.
