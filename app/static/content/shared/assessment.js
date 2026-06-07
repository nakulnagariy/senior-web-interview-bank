/*
 * assessment.js — shared scripts for all assessment HTML files
 * Injected by TopicViewer before srcdoc rendering.
 */

/**
 * Toggle a reveal/answer panel.
 * @param {string} id  - Element ID of the answer panel
 * @param {HTMLButtonElement} btn - The button that was clicked
 */
function tog(id, btn) {
  var box = document.getElementById(id);
  if (!box) return;
  var isOpen = box.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  var svg = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>';
  btn.innerHTML = svg + (isOpen ? 'Hide answer' : 'Reveal answer');
}
