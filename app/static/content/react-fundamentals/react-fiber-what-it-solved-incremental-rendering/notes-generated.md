# React Fiber & Incremental Rendering

## What is React Fiber?
- React Fiber is a complete rewrite of React's reconciliation algorithm, introduced in React 16.
- It represents the Virtual DOM as a linked list of "fiber" nodes, allowing React to pause, resume, and abort work.

## What Problem Did Fiber Solve?
- The old stack-based reconciler was synchronous and blocked the main thread, causing jank in large updates.
- Fiber enables React to split rendering work into units, making it possible to prioritize, interrupt, and schedule updates.

## Incremental Rendering
- Fiber allows React to render components incrementally, yielding control back to the browser between units of work.
- This enables features like time-slicing, concurrent rendering, and prioritization (e.g., updating visible UI before background tasks).

## Key Features
- **Concurrency:** React can work on multiple tasks at once, pausing and resuming as needed.
- **Prioritization:** Updates can be prioritized (e.g., user input vs. data fetching).
- **Interruptibility:** Rendering can be interrupted for higher-priority tasks.
- **Better User Experience:** Smoother UI, less blocking, improved responsiveness.

## Example
- With Fiber, React can update a list of thousands of items without freezing the UI, by breaking the work into chunks and yielding between them.

## Summary
- React Fiber enables incremental, prioritized, and interruptible rendering, solving performance and responsiveness issues in large or complex apps.