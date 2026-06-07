/*
 * assessment.js — shared scripts for all assessment HTML files
 * Injected by TopicViewer before srcdoc rendering.
 */

/**
 * Toggle a reveal/answer panel. Supports two calling conventions:
 *
 *   tog('a1', this)   — standard: first arg is the panel element ID
 *   tog(this)         — legacy:   single arg is the button; finds the
 *                                 nearest following .ans / .answer sibling
 *
 * @param {string|HTMLElement} idOrBtn
 * @param {HTMLButtonElement} [btn]
 */
function tog(idOrBtn, btn) {
  var box, button;

  if (typeof idOrBtn === 'string') {
    // Standard call: tog('a1', this)
    box = document.getElementById(idOrBtn);
    button = btn;
  } else {
    // Legacy call: tog(this) — walk forward siblings to find the answer panel
    button = idOrBtn;
    var sibling = button.nextElementSibling;
    while (sibling) {
      if (sibling.classList.contains('ans') || sibling.classList.contains('answer')) {
        box = sibling;
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  }

  if (!box || !button) return;

  var isOpen = box.classList.toggle('open');
  button.classList.toggle('open', isOpen);
  var svg = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>';
  button.innerHTML = svg + (isOpen ? 'Hide answer' : 'Reveal answer');
}
