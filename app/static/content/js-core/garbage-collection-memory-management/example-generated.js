// Memory leak: event listener not removed
function setupLeak() {
  const el = document.getElementById('btn');
  function handler() { /* ... */ }
  el.addEventListener('click', handler);
  // If el is removed from DOM, handler keeps it in memory
}

// Fix: remove event listener on cleanup
function setupFixed() {
  const el = document.getElementById('btn');
  function handler() { /* ... */ }
  el.addEventListener('click', handler);
  // On cleanup:
  el.removeEventListener('click', handler);
}

// Example: nullifying references
let obj = { data: new Array(1000000).fill('x') };
obj = null; // Eligible for GC