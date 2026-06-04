---
name: link-validator
description: "Use when verifying that all topic asset paths in the manifest resolve to files under app/static/content."
---

# Link Validator Skill

## Goal
Catch broken topic content references before commit.

## Procedure
1. Read app/src/lib/data/topics.ts.
2. Extract all asset path entries.
3. Confirm each path exists under app/static/content.
4. Report missing files and probable typo/folder mismatch.

## Output
- Pass/fail summary.
- Missing paths list.
- Suggested path fixes.
