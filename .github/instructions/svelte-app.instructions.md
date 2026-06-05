---
description: "Use when editing Svelte app code, routing, viewer rendering, or UI behavior in app/src/**."
applyTo: "app/src/**"
---

- Keep the app static-export friendly; avoid server-only dependencies for core navigation.
- Use hash-based topic deep links and preserve backwards compatibility.
- Render markdown, html, code, and csv content gracefully with user-visible fallbacks.
- Prefer small focused components/utilities over oversized single files.
- Keep state persistence keys stable unless migration is handled explicitly.
